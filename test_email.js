require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.sendMail({
    from: `"Doon Clean & Cares Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "Test Email from Node.js",
    text: "This is a test email.",
})
.then(info => console.log('Email sent successfully:', info.response))
.catch(err => console.error('Failed to send email:', err));
