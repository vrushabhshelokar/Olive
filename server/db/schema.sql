-- Sipna Practical Attendance & Student Management System Schema
-- PostgreSQL DDL

DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS practical_session CASCADE;
DROP TABLE IF EXISTS student CASCADE;
DROP TABLE IF EXISTS faculty_assignment CASCADE;
DROP TABLE IF EXISTS batch CASCADE;
DROP TABLE IF EXISTS division CASCADE;
DROP TABLE IF EXISTS subject CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;

-- 1. Faculty Table
CREATE TABLE faculty (
    faculty_id SERIAL PRIMARY KEY,
    faculty_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subject Table
CREATE TABLE subject (
    subject_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type = 'PRACTICAL'),
    semester INT NOT NULL
);

-- 3. Division Table
CREATE TABLE division (
    division_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    semester INT NOT NULL
);

-- 4. Batch Table
CREATE TABLE batch (
    batch_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    division_id INT NOT NULL REFERENCES division(division_id) ON DELETE CASCADE,
    CONSTRAINT unique_division_batch UNIQUE (division_id, name)
);

-- 5. Faculty Assignment Table
CREATE TABLE faculty_assignment (
    assignment_id SERIAL PRIMARY KEY,
    faculty_id INT NOT NULL REFERENCES faculty(faculty_id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES subject(subject_id) ON DELETE CASCADE,
    division_id INT NOT NULL REFERENCES division(division_id) ON DELETE CASCADE,
    batch_id INT NOT NULL REFERENCES batch(batch_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_faculty_assignment UNIQUE (faculty_id, subject_id, division_id, batch_id)
);

-- 6. Student Table
CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    bt_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    semester INT NOT NULL,
    division_id INT NOT NULL REFERENCES division(division_id) ON DELETE CASCADE,
    batch_id INT NOT NULL REFERENCES batch(batch_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Practical Session Table
CREATE TABLE practical_session (
    session_id SERIAL PRIMARY KEY,
    subject_id INT NOT NULL REFERENCES subject(subject_id) ON DELETE CASCADE,
    division_id INT NOT NULL REFERENCES division(division_id) ON DELETE CASCADE,
    batch_id INT NOT NULL REFERENCES batch(batch_id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_practical_session UNIQUE (subject_id, division_id, batch_id, session_date)
);

-- 8. Attendance Table
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES practical_session(session_id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES student(student_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT')),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_session_student UNIQUE (session_id, student_id)
);

-- Database Indexes for performance
CREATE INDEX idx_faculty_email ON faculty(email);
CREATE INDEX idx_faculty_code ON faculty(faculty_code);
CREATE INDEX idx_student_bt_id ON student(bt_id);
CREATE INDEX idx_student_batch ON student(batch_id);
CREATE INDEX idx_student_name ON student(name);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_session_date ON practical_session(session_date);
