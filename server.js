require('dotenv').config();
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const otpStore = {}; // Temporary memory store for OTPs

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'super_secret_key_for_house_cleaning';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )`);

        // Create Bookings table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            address TEXT,
            service TEXT,
            date TEXT,
            userEmail TEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Worker Applications table
        db.run(`CREATE TABLE IF NOT EXISTS worker_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            skill TEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: `"Home Solution" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP for Account Verification",
            html: `<h3>Your Verification Code is: <b>${otp}</b></h3>`,
        });

        console.log(`[TESTING] OTP sent to ${email}`);

        res.json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, password, otp } = req.body;
    
    if (!otpStore[email] || otpStore[email] !== otp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            delete otpStore[email];
            res.status(201).json({ message: 'User created successfully', id: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, email: user.email });
    });
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
app.post('/api/bookings', (req, res) => {
    const { name, phone, address, service, date, userEmail } = req.body;
    const status = 'Pending';
    
    db.run(
        `INSERT INTO bookings (name, phone, address, service, date, userEmail, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, phone, address, service, date, userEmail, status],
        async function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            try {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                // 1. Send Email to the Business Admin
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

                // 2. Send Confirmation Email to the User (if they are logged in)
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

            res.status(201).json({ message: 'Booking created successfully', id: this.lastID });
        }
    );
});

// Get Bookings (Admin)
app.get('/api/bookings', (req, res) => {
    db.all(`SELECT * FROM bookings ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// --- Worker Application Routes ---

// Create Application
app.post('/api/partner', (req, res) => {
    const { name, phone, skill } = req.body;
    const status = 'New Applicant';
    
    db.run(
        `INSERT INTO worker_applications (name, phone, skill, status) VALUES (?, ?, ?, ?)`,
        [name, phone, skill, status],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Application submitted successfully', id: this.lastID });
        }
    );
});

// Get Applications (Admin)
app.get('/api/partner', (req, res) => {
    db.all(`SELECT * FROM worker_applications ORDER BY createdAt DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
