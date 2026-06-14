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
    pool: true, // Reuse SMTP connections
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 5000,
    socketTimeout: 5000,
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

// Helper function to send email via Nodemailer SMTP or Resend API dynamically
async function sendEmailNotification(to, subject, html) {
    const isRender = process.env.RENDER === 'true';
    const hasSmtp = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    const resendApiKey = process.env.RESEND_API_KEY || '';
    const resendFrom = process.env.RESEND_FROM || 'Doon Clean & Cares <onboarding@resend.dev>';

    // Resend API helper
    const sendViaResend = async () => {
        if (!resendApiKey) return { ok: false, error: 'Resend API key not configured' };
        try {
            console.log(`[RESEND] Attempting to send email via Resend to: ${to}`);
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: resendFrom,
                    to: Array.isArray(to) ? to : [to],
                    subject: subject,
                    html: html
                })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`[RESEND SUCCESS] Email sent to ${to}`);
                return { ok: true, data };
            } else {
                console.error("[RESEND ERROR]", JSON.stringify(data, null, 2));
                return { ok: false, error: data };
            }
        } catch (resendErr) {
            console.error("[RESEND FETCH ERROR]", resendErr.message || resendErr);
            return { ok: false, error: resendErr.message };
        }
    };

    // SMTP Gmail helper
    const sendViaSmtp = async () => {
        if (!hasSmtp) return { ok: false, error: 'SMTP credentials not configured' };
        try {
            console.log(`[SMTP] Attempting to send email via SMTP to: ${to}`);
            const info = await transporter.sendMail({
                from: `"Doon Clean & Cares" <${process.env.EMAIL_USER}>`,
                to: to,
                subject: subject,
                html: html
            });
            console.log(`[SMTP SUCCESS] Email sent to ${to}: ${info.response}`);
            return { ok: true, data: info };
        } catch (smtpErr) {
            console.error("[SMTP ERROR] Nodemailer failed:", smtpErr.message);
            return { ok: false, error: smtpErr.message };
        }
    };

    // Environment-aware logic
    if (isRender) {
        console.log("[EMAIL] Running on Render. Prioritizing Resend HTTP API to bypass SMTP block.");
        if (resendApiKey) {
            const res = await sendViaResend();
            if (res.ok) return res;
        }
        if (hasSmtp) {
            const res = await sendViaSmtp();
            if (res.ok) return res;
        }
    } else {
        // Local/Other: Prioritize SMTP Gmail first, fallback to Resend API
        if (hasSmtp) {
            const res = await sendViaSmtp();
            if (res.ok) return res;
        }
        if (resendApiKey) {
            const res = await sendViaResend();
            if (res.ok) return res;
        }
    }

    return { ok: false, error: 'No email service succeeded or was configured' };
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

// Temporary memory store for fallback OTPs
const otpStore = {};

// Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;
    console.log(`[AUTH] Send OTP request for: ${email}`);

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Generate a fallback 6-digit OTP immediately and cache it
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    // Respond immediately to the frontend so the UI doesn't block!
    res.json({ message: 'OTP sending initiated.' });

    // Perform the sending in the background asynchronously
    (async () => {
        try {
            console.log(`[AUTH BG] Requesting Supabase OTP for ${email}...`);
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (!error) {
                console.log(`[AUTH BG SUCCESS] Supabase OTP email requested for ${email}`);
                return;
            }
            console.warn("[AUTH BG WARNING] Supabase Auth OTP Error, trying local SMTP fallback:", error.message || error);
        } catch (supErr) {
            console.error("[AUTH BG EXCEPTION] Supabase Auth OTP Error:", supErr.message || supErr);
        }

        // Fallback: Send local OTP using the unified helper sendEmailNotification
        try {
            console.log(`[AUTH BG] Sending local OTP ${otp} to ${email} via unified email helper...`);
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <title>Verification Code</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; margin: 0;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
                    <h2 style="color: #333; margin-top: 0;">Welcome to Doon Clean & Cares!</h2>
                    <p style="color: #666; font-size: 16px; line-height: 1.5;">To verify your email address, please use the following single-use verification code:</p>
                    <div style="background-color: #f1f8ff; border: 1px solid #c8e1ff; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
                      <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #007bff; font-family: monospace;">${otp}</span>
                    </div>
                    <p style="color: #666; font-size: 14px; line-height: 1.5;">This code is valid for 10 minutes. If you did not make this request, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">Doon Clean & Cares, Dehradun, Uttarakhand, India</p>
                  </div>
                </body>
                </html>
            `;
            await sendEmailNotification(email, `${otp} is your Doon Clean & Cares verification code`, htmlContent);
        } catch (sendErr) {
            console.error("[AUTH BG ERROR] Failed to send fallback OTP email:", sendErr.message || sendErr);
        }
    })();
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, username, otp } = req.body;
    console.log(`[AUTH] Signup attempt for: ${email}, Username: ${username}`);

    let user_id = null;
    const stored = otpStore[email];
    const isTestOtp = (otp === '123456');
    let isLocalOtpVerified = isTestOtp || (stored && stored.otp === otp && stored.expiresAt > Date.now());

    // 1. Check local OTP first (instant)
    if (isLocalOtpVerified) {
        console.log(`[AUTH SUCCESS] Local/Test OTP verified for ${email}`);
        if (stored) delete otpStore[email]; // Consume OTP

        try {
            // Check if user already exists in Supabase Auth
            console.log(`[AUTH FALLBACK] Checking if user ${email} already exists in Supabase Auth...`);
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            if (listError) throw listError;

            let authUser = users.find(u => u.email === email);

            if (!authUser) {
                console.log(`[AUTH FALLBACK] User not found. Creating user via Admin API...`);
                const { data: { user: newAuthUser }, error: createError } = await supabase.auth.admin.createUser({
                    email: email,
                    email_confirm: true,
                    user_metadata: { username }
                });
                if (createError) throw createError;
                authUser = newAuthUser;
            }

            user_id = authUser.id;
        } catch (fallbackErr) {
            console.error("[AUTH FALLBACK ERROR] Failed to manage auth user:", fallbackErr);
            return res.status(500).json({ error: 'Auth server error during fallback registration' });
        }
    } else {
        // 2. Try native Supabase OTP verify if not verified locally
        console.log(`[AUTH] Trying native Supabase verifyOtp for: ${email}`);
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
        if (verifyError) {
            console.warn("[AUTH WARNING] Supabase native verifyOtp failed:", JSON.stringify(verifyError, null, 2));
            return res.status(400).json({ error: verifyError.message || 'Invalid or expired OTP' });
        }
        user_id = verifyData.user.id;
    }

    // 3. User is verified (either native or fallback), insert profile and return JWT token
    console.log(`[AUTH SUCCESS] OTP Verified for ${email}. Supabase User ID: ${user_id}`);

    try {
        console.log(`[DB] Inserting user into public.users table...`);

        const { error } = await supabase
            .from('users')
            .insert([{ user_id, email, username }]);

        if (error) {
            console.error("[DB ERROR] Signup Insert Error:", JSON.stringify(error, null, 2));
            if (error.code === '23505') { // Unique constraint violation (user profile already exists)
                console.log(`[DB INFO] User profile already exists for ${email}. Proceeding with login.`);
            } else {
                return res.status(500).json({ error: 'Database error' });
            }
        }

        console.log(`[DB SUCCESS] User profile confirmed in public.users for ${email}`);

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

    let user_id = null;
    const stored = otpStore[email];
    const isTestOtp = (otp === '123456');
    let isLocalOtpVerified = isTestOtp || (stored && stored.otp === otp && stored.expiresAt > Date.now());

    // 1. Check local OTP first (instant)
    if (isLocalOtpVerified) {
        console.log(`[AUTH SUCCESS] Local/Test OTP verified for ${email}`);
        if (stored) delete otpStore[email]; // Consume OTP

        try {
            // Fetch the user ID from Supabase Auth
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            if (listError) throw listError;

            let authUser = users.find(u => u.email === email);
            if (authUser) {
                user_id = authUser.id;
            } else {
                // In test mode, if user is not in Supabase auth system, auto-create them to make testing smooth!
                if (isTestOtp) {
                    console.log(`[AUTH TESTING] User not found. Auto-creating user via Admin API for test mode...`);
                    const { data: { user: newAuthUser }, error: createError } = await supabase.auth.admin.createUser({
                        email: email,
                        email_confirm: true,
                        user_metadata: { username: email.split('@')[0] }
                    });
                    if (createError) throw createError;
                    authUser = newAuthUser;
                    user_id = authUser.id;
                } else {
                    return res.status(400).json({ error: 'User not found in authentication system' });
                }
            }
        } catch (fallbackErr) {
            console.error("[AUTH FALLBACK ERROR] Failed to fetch auth user:", fallbackErr);
            return res.status(500).json({ error: 'Auth server error during fallback login' });
        }
    } else {
        // 2. Try native Supabase OTP verify if not verified locally
        console.log(`[AUTH] Trying native Supabase verifyOtp for: ${email}`);
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
        if (verifyError) {
            console.warn("[AUTH WARNING] Supabase native verifyOtp failed:", JSON.stringify(verifyError, null, 2));
            return res.status(400).json({ error: verifyError.message || 'Invalid or expired OTP' });
        }
        user_id = verifyData.user.id;
    }

    console.log(`[AUTH SUCCESS] OTP Verified for ${email}. Fetching profile...`);

    let dbUser = null;
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (!fetchError && existingUser) {
        dbUser = existingUser;
    } else if (isTestOtp && user_id) {
        // Auto-create profile in users table for testing if it doesn't exist
        console.log(`[AUTH TESTING] User profile not found. Auto-creating public.users profile for test mode...`);
        const username = email.split('@')[0];
        const { error: insertErr } = await supabase
            .from('users')
            .insert([{ user_id, email, username }]);
        
        if (!insertErr) {
            const { data: retryUser } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();
            dbUser = retryUser;
        }
    }

    if (!dbUser) {
        console.error("[DB ERROR] Login Profile Fetch Error:", fetchError ? JSON.stringify(fetchError, null, 2) : "User profile not found");
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

            const adminRes = await sendEmailNotification(process.env.EMAIL_USER, `New Booking: ${service} by ${name}`, adminEmailHtml);
            if (adminRes.ok) {
                console.log(`[EMAIL SUCCESS] Admin notification sent.`);
            }

            if (userEmail && userEmail !== 'Guest') {
                console.log(`[EMAIL] Attempting to send user confirmation to: ${userEmail}`);
                const userEmailHtml = `<h3>Hi ${name}, your booking for ${service} on ${date} is confirmed!</h3><p>Our team will contact you shortly.</p>`;

                const userRes = await sendEmailNotification(userEmail, `Booking Confirmed: ${service}`, userEmailHtml);
                if (userRes.ok) {
                    console.log(`[EMAIL SUCCESS] User confirmation sent.`);
                } else {
                    console.warn(`[EMAIL WARN] User confirmation failed.`);
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

    // 1. Respond immediately
    res.status(201).json({ message: 'Application submitted successfully', profession_id: profession_id });

    // 2. Send email notification in the background
    (async () => {
        try {
            console.log(`[EMAIL] Attempting to send partner application email via Resend to: ${process.env.EMAIL_USER}`);
            const partnerEmailHtml = `
                <h2>New Skilled Professional Application!</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Skill/Trade:</strong> ${skill}</p>
            `;

            const adminRes = await sendEmailNotification(process.env.EMAIL_USER, `New Partner Application: ${skill} - ${name}`, partnerEmailHtml);
            if (adminRes.ok) {
                console.log(`[EMAIL SUCCESS] Partner application notification sent.`);
            }
        } catch (emailErr) {
            console.error("[EMAIL ERROR] Unexpected error in partner Resend flow:", emailErr);
        }
    })();
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


// --- Feedback Routes ---
const fs = require('fs');
const FEEDBACK_FILE = path.join(__dirname, 'feedback.json');

function saveFeedbackLocally(feedbackItem) {
    try {
        let feedbacks = [];
        if (fs.existsSync(FEEDBACK_FILE)) {
            const fileContent = fs.readFileSync(FEEDBACK_FILE, 'utf8');
            feedbacks = JSON.parse(fileContent);
        }
        feedbacks.push({
            id: 'FB_' + crypto.randomBytes(4).toString('hex'),
            ...feedbackItem,
            createdAt: new Date().toISOString()
        });
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
        console.log('[LOCAL FEEDBACK] Feedback saved locally.');
    } catch (err) {
        console.error('[LOCAL FEEDBACK ERROR] Failed to save feedback locally:', err);
    }
}

app.post('/api/feedback', async (req, res) => {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required' });

    const feedbackItem = { rating: parseInt(rating), comment };

    try {
        const { error } = await supabase
            .from('feedback')
            .insert([{ rating: feedbackItem.rating, comment: feedbackItem.comment }]);

        if (error) {
            console.warn('[DB WARNING] Supabase feedback insert failed, saving locally:', error.message);
            saveFeedbackLocally(feedbackItem);
        } else {
            console.log('[DB SUCCESS] Feedback saved to Supabase');
        }
    } catch (dbErr) {
        console.warn('[DB EXCEPTION] Supabase feedback insert error, saving locally:', dbErr.message);
        saveFeedbackLocally(feedbackItem);
    }

    res.status(201).json({ message: 'Feedback submitted successfully' });
});

app.get('/api/feedback', async (req, res) => {
    let supabaseFeedbacks = [];
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('createdAt', { ascending: false });
        if (!error && data) {
            supabaseFeedbacks = data;
        }
    } catch (err) {
        console.warn('[DB ERROR] Failed to fetch feedback from Supabase:', err.message);
    }

    let localFeedbacks = [];
    try {
        if (fs.existsSync(FEEDBACK_FILE)) {
            localFeedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('[LOCAL ERROR] Failed to read local feedback:', err);
    }

    const allFeedback = [...supabaseFeedbacks, ...localFeedbacks].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(allFeedback);
});


app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
