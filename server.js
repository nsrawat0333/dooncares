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
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
        rejectUnauthorized: false // Bypass some cloud firewall restrictions
    },
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const resendApiKey = process.env.RESEND_API_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error("WARNING: Missing SUPABASE_URL or SUPABASE_KEY in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Initialized Supabase client.');

// Helper function to send email via Resend API
async function sendResendEmail(to, subject, html) {
    if (!resendApiKey) {
        console.error("[RESEND ERROR] API Key missing");
        return { ok: false, error: 'API Key missing' };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Home Solution <onboarding@resend.dev>',
                to: Array.isArray(to) ? to : [to],
                subject: subject,
                html: html
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("[RESEND ERROR]", JSON.stringify(data, null, 2));
        }
        return { data, ok: response.ok };
    } catch (err) {
        console.error("[RESEND FETCH ERROR]", err);
        return { ok: false, error: err.message };
    }
}

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
    console.log(`[AUTH] Send OTP request for: ${email}`);
    
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    
    if (error) {
        console.error("[AUTH ERROR] Supabase Auth OTP Error:", JSON.stringify(error, null, 2));
        return res.status(400).json({ error: error.message });
    }

    console.log(`[AUTH SUCCESS] Supabase OTP email requested for ${email}`);
    res.json({ message: 'OTP sent successfully via Supabase.' });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, username, otp } = req.body;
    console.log(`[AUTH] Signup attempt for: ${email}, Username: ${username}`);
    
    const { data: { user }, error: authError } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    
    if (authError) {
        console.error("[AUTH ERROR] Signup Verify Error:", JSON.stringify(authError, null, 2));
        return res.status(400).json({ error: authError.message || 'Invalid or expired OTP' });
    }

    console.log(`[AUTH SUCCESS] OTP Verified for ${email}. Supabase User ID: ${user.id}`);

    try {
        const user_id = user.id; // Use Supabase Auth UUID
        console.log(`[DB] Inserting user into public.users table...`);
        
        const { error } = await supabase
            .from('users')
            .insert([{ user_id, email, username }]); // Removed otp from here to fix missing column error

        if (error) {
            console.error("[DB ERROR] Signup Insert Error:", JSON.stringify(error, null, 2));
            if (error.code === '23505') { // Unique constraint violation in Postgres
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Database error' });
        }
        
        console.log(`[DB SUCCESS] User profile created in public.users for ${email}`);
        
        // Generate token for automatic login
        const token = jwt.sign({ id: user_id, email: email }, SECRET_KEY, { expiresIn: '24h' });
        
        res.status(201).json({ 
            message: 'User created successfully', 
            token, 
            email, 
            username, 
            user_id 
        });
    } catch (error) {
        console.error("[SERVER ERROR] Signup Catch Block:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, otp } = req.body;
    console.log(`[AUTH] Login attempt for: ${email}`);
    
    const { data: { user }, error: authError } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    
    if (authError) {
        console.error("[AUTH ERROR] Login Verify Error:", JSON.stringify(authError, null, 2));
        return res.status(400).json({ error: authError.message || 'Invalid or expired OTP' });
    }

    console.log(`[AUTH SUCCESS] OTP Verified for ${email}. Fetching profile...`);

    const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !dbUser) {
        console.error("[DB ERROR] Login Profile Fetch Error:", error ? JSON.stringify(error, null, 2) : "User profile not found");
        return res.status(400).json({ error: 'User not found in database' });
    }

    console.log(`[AUTH SUCCESS] Login complete for ${email}`);
    const token = jwt.sign({ id: dbUser.user_id, email: dbUser.email }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, email: dbUser.email, username: dbUser.username, user_id: dbUser.user_id });
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
        console.error("[DB ERROR] Booking Table Insert Error:", JSON.stringify(error, null, 2));
        return res.status(500).json({ error: 'Database error' });
    }

    console.log(`[DB SUCCESS] Booking created: ${booking_id} for ${userEmail}`);

    // 1. Respond immediately so the user doesn't wait!
    res.status(201).json({ message: 'Booking created successfully', booking_id: booking_id });

    // 2. Send emails in the background (Fast for the user!)
    (async () => {
        try {
            console.log(`[EMAIL] Attempting to send admin notification via Resend to: ${process.env.EMAIL_USER}`);
            const adminEmailHtml = `
                <h2>New Booking Received!</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Service:</strong> ${service}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>User Email:</strong> ${userEmail}</p>
            `;
            
            const adminRes = await sendResendEmail(process.env.EMAIL_USER, `New Booking: ${service} by ${name}`, adminEmailHtml);
            if (adminRes.ok) {
                console.log(`[EMAIL SUCCESS] Admin notification sent via Resend.`);
            }

            if (userEmail && userEmail !== 'Guest') {
                console.log(`[EMAIL] Attempting to send user confirmation via Resend to: ${userEmail}`);
                const userEmailHtml = `<h3>Hi ${name}, your booking for ${service} on ${date} is confirmed!</h3><p>Our team will contact you shortly.</p>`;
                
                // Note: Resend's free tier only allows sending to your own email unless you verify a domain.
                const userRes = await sendResendEmail(userEmail, `Booking Confirmed: ${service}`, userEmailHtml);
                if (userRes.ok) {
                    console.log(`[EMAIL SUCCESS] User confirmation sent via Resend.`);
                } else {
                    console.warn(`[EMAIL WARN] User confirmation failed (might be due to Resend sandbox limits).`);
                }
            }
        } catch (emailErr) {
            console.error("[EMAIL ERROR] Unexpected error in Resend flow:", emailErr);
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

    if (error) {
        console.error("Supabase Error GET /api/partner:", error);
        return res.status(500).json({ error: 'Database error' });
    }
    res.json(data);
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
