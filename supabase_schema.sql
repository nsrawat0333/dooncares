-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    otp TEXT
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    status TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Worker Applications Table
CREATE TABLE IF NOT EXISTS worker_applications (
    id SERIAL PRIMARY KEY,
    profession_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    skill TEXT NOT NULL,
    status TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
