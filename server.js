require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const otpStore = {}; // Temporary memory store for OTPs

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'super_secret_key_for_house_cleaning';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Global email transporter (improves performance by not reconnecting on every request)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("WARNING: Missing SUPABASE_URL or SUPABASE_KEY in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Initialized Supabase client.');

// Middleware to verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// --- Auth Routes ---

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    try {
        // Send email asynchronously so the user doesn't have to wait
        transporter.sendMail({
            from: `"Home Solution" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Home Solution - Account Verification Code",
            text: `Hello,\n\nYour Verification Code is: ${otp}\n\nPlease enter this code on the website to verify your account.\n\nThank you,\nHome Solution Team`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Welcome to Home Solution!</h2>
                    <p>Your Verification Code is:</p>
                    <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>Please enter this code on the website to verify your account.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999;">If you didn't request this code, you can safely ignore this email.</p>
                </div>
            `,
        }).catch(error => {
            console.error("Background email send error:", error);
        });

        // Print the OTP to the terminal for easy testing
        console.log(`[TESTING] OTP for ${email} is: ${otp}`);

        res.json({ message: 'OTP sent successfully (check email or terminal).' });
    } catch (error) {
        console.error("Error setting up OTP:", error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, username, otp } = req.body;
    
    if (!otpStore[email] || otpStore[email] !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    try {
        const user_id = 'USR_' + crypto.randomBytes(4).toString('hex');
        const { error } = await supabase
            .from('users')
            .insert([{ user_id, email, username }]);

        if (error) {
            if (error.code === '23505') { // Unique constraint violation in Postgres
                return res.status(400).json({ error: 'Email already exists' });
            }
            console.error("Signup error:", error);
            return res.status(500).json({ error: 'Database error' });
        }
        delete otpStore[email];
        res.status(201).json({ message: 'User created successfully', user_id: user_id });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, otp } = req.body;
    
    if (!otpStore[email] || otpStore[email] !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) {
        return res.status(400).json({ error: 'User not found' });
    }

    delete otpStore[email];
    const token = jwt.sign({ id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, email: user.email, username: user.username, user_id: user.user_id });
});

// Admin Login
app.post('/api/auth/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@gmail.com' && password === 'admin123') { // Hardcoded admin for simplicity as requested
        const token = jwt.sign({ email, role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, email });
    } else {
        res.status(400).json({ error: 'Invalid admin credentials' });
    }
});


// --- Booking Routes ---

// Create Booking
app.post('/api/bookings', async (req, res) => {
    const { name, phone, address, service, date, userEmail } = req.body;
    const status = 'Pending';
    const booking_id = 'BKG_' + crypto.randomBytes(4).toString('hex');
    
    const { error } = await supabase
        .from('bookings')
        .insert([{ booking_id, name, phone, address, service, date, userEmail, status }]);

    if (error) {
        console.error("Booking error:", error);
        return res.status(500).json({ error: 'Database error' });
    }

    // 1. Respond immediately so the user doesn't wait!
    res.status(201).json({ message: 'Booking created successfully', booking_id: booking_id });

            // 2. Send emails in the background
            (async () => {
                try {
                    await transporter.sendMail({
                        from: `"Home Solution" <${process.env.EMAIL_USER}>`,
                        to: process.env.EMAIL_USER, 
                        subject: `New Booking: ${service} by ${name}`,
                        html: `
                            <h2>New Booking Received!</h2>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Service:</strong> ${service}</p>
                            <p><strong>Date:</strong> ${date}</p>
                            <p><strong>Address:</strong> ${address}</p>
                            <p><strong>User Email:</strong> ${userEmail}</p>
                        `,
                    });

                    if (userEmail && userEmail !== 'Guest') {
                        await transporter.sendMail({
                            from: `"Home Solution" <${process.env.EMAIL_USER}>`,
                            to: userEmail,
                            subject: `Booking Confirmed: ${service}`,
                            html: `<h3>Hi ${name}, your booking for ${service} on ${date} is confirmed!</h3><p>Our team will contact you shortly.</p>`,
                        });
                    }
                } catch (emailErr) {
                    console.error("Failed to send booking email:", emailErr);
                }
            })();
});

// Get Bookings (Admin)
app.get('/api/bookings', async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: 'Database error' });
    res.json(data);
});

// --- Worker Application Routes ---

// Create Application
app.post('/api/partner', async (req, res) => {
    const { name, phone, skill } = req.body;
    const status = 'New Applicant';
    const profession_id = 'PRO_' + crypto.randomBytes(4).toString('hex');
    
    const { error } = await supabase
        .from('worker_applications')
        .insert([{ profession_id, name, phone, skill, status }]);

    if (error) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Application submitted successfully', profession_id: profession_id });
});

// Get Applications (Admin)
app.get('/api/partner', async (req, res) => {
    const { data, error } = await supabase
        .from('worker_applications')
        .select('*')
        .order('createdAt', { ascending: false });

    if (error) return res.status(500).json({ error: 'Database error' });
    res.json(data);
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
