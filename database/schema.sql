-- Clinic Appointment System - Database Schema
-- Compatible with SQLite, PostgreSQL, and MySQL

PRAGMA foreign_keys = ON;

-- 1. Bảng USERS (Tài khoản người dùng: PATIENT, DOCTOR, ADMIN)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('PATIENT', 'DOCTOR', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng SPECIALTIES (Chuyên khoa y tế)
CREATE TABLE IF NOT EXISTS specialties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 3. Bảng DOCTORS (Hồ sơ Bác sĩ, liên kết 1-1 với Users, N-1 với Specialties)
CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    specialty_id INTEGER NOT NULL,
    phone TEXT,
    experience INTEGER DEFAULT 0,
    description TEXT,
    available INTEGER DEFAULT 1 CHECK(available IN (0, 1)),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE RESTRICT
);