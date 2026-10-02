-- Sipna Practical Attendance & Student Management System Seed Data
-- Simplified 1-Section Demo: CS-B (B1, B2, B3) & 3 Practical Labs

-- 1. Insert Division: CS-B
INSERT INTO division (division_id, name, semester) VALUES
(1, 'CS-B', 5)
ON CONFLICT (name) DO UPDATE SET semester = EXCLUDED.semester;

-- 2. Insert Batches under CS-B: B1, B2, B3
INSERT INTO batch (batch_id, name, division_id) VALUES
(1, 'B1', 1),
(2, 'B2', 1),
(3, 'B3', 1)
ON CONFLICT (division_id, name) DO NOTHING;

-- 3. Insert 3 Practical Subjects
INSERT INTO subject (subject_id, name, code, type, semester) VALUES
(1, 'DBMS Lab', 'DBMS', 'PRACTICAL', 5),
(2, 'C Skill Lab VI', 'CSKILL6', 'PRACTICAL', 5),
(3, 'C Skill Lab V', 'CSKILL5', 'PRACTICAL', 5)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, semester = EXCLUDED.semester;

-- 4. Insert Demo Faculty (abc@sipna.ac.in / Demo@123)
INSERT INTO faculty (faculty_id, faculty_code, name, email, department, designation, password_hash) VALUES
(1, 'FAC001', 'Prof. ABC', 'abc@sipna.ac.in', 'Computer Science & Engineering', 'Assistant Professor', '$2b$10$wCy9C3cxxCCqqCprl1fCA.jx/3Y2N4U1rLSKvygoPGFVwoY5jmtKm')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, department = EXCLUDED.department, designation = EXCLUDED.designation, password_hash = EXCLUDED.password_hash;

-- 5. Insert Faculty Assignments: Prof. ABC assigned to ALL 3 practical labs across ALL 3 batches in CS-B
INSERT INTO faculty_assignment (faculty_id, subject_id, division_id, batch_id) VALUES
-- DBMS Lab
(1, 1, 1, 1), -- DBMS Lab -> CS-B -> B1
(1, 1, 1, 2), -- DBMS Lab -> CS-B -> B2
(1, 1, 1, 3), -- DBMS Lab -> CS-B -> B3
-- C Skill Lab VI
(1, 2, 1, 1), -- C Skill Lab VI -> CS-B -> B1
(1, 2, 1, 2), -- C Skill Lab VI -> CS-B -> B2
(1, 2, 1, 3), -- C Skill Lab VI -> CS-B -> B3
-- C Skill Lab V
(1, 3, 1, 1), -- C Skill Lab V -> CS-B -> B1
(1, 3, 1, 2), -- C Skill Lab V -> CS-B -> B2
(1, 3, 1, 3)  -- C Skill Lab V -> CS-B -> B3
ON CONFLICT (faculty_id, subject_id, division_id, batch_id) DO NOTHING;

-- 6. Insert 30 Unique Students (Exactly 10 per batch)
-- Batch B1: 10 Students (24BT0001 - 24BT0010)
INSERT INTO student (student_id, bt_id, name, semester, division_id, batch_id) VALUES
(1,  '24BT0001', 'Aarav Sharma',      5, 1, 1),
(2,  '24BT0002', 'Aditi Deshmukh',    5, 1, 1),
(3,  '24BT0003', 'Aniket Joshi',      5, 1, 1),
(4,  '24BT0004', 'Ananya Kulkarni',   5, 1, 1),
(5,  '24BT0005', 'Bhavesh Patel',     5, 1, 1),
(6,  '24BT0006', 'Chetan Ingole',     5, 1, 1),
(7,  '24BT0007', 'Devendra Wankhade', 5, 1, 1),
(8,  '24BT0008', 'Divya Tayade',      5, 1, 1),
(9,  '24BT0009', 'Gaurav Chaudhari',  5, 1, 1),
(10, '24BT0010', 'Harshada Gawande',  5, 1, 1),

-- Batch B2: 10 Students (24BT0011 - 24BT0020)
(11, '24BT0011', 'Isha Mahajan',      5, 1, 2),
(12, '24BT0012', 'Kunal Rathi',       5, 1, 2),
(13, '24BT0013', 'Manish Agrawal',    5, 1, 2),
(14, '24BT0014', 'Neha Verma',        5, 1, 2),
(15, '24BT0015', 'Omkar Patil',       5, 1, 2),
(16, '24BT0016', 'Pooja Kale',        5, 1, 2),
(17, '24BT0017', 'Pranav Bhole',      5, 1, 2),
(18, '24BT0018', 'Rahul Phadke',      5, 1, 2),
(19, '24BT0019', 'Riya Gadkari',      5, 1, 2),
(20, '24BT0020', 'Sakshi More',       5, 1, 2),

-- Batch B3: 10 Students (24BT0021 - 24BT0030)
(21, '24BT0021', 'Siddharth Shinde',  5, 1, 3),
(22, '24BT0022', 'Sneha Shelke',      5, 1, 3),
(23, '24BT0023', 'Tanmay Deshpande',  5, 1, 3),
(24, '24BT0024', 'Tejas Nimbalkar',   5, 1, 3),
(25, '24BT0025', 'Utkarsh Bhusari',   5, 1, 3),
(26, '24BT0026', 'Vaishnavi Thorat',  5, 1, 3),
(27, '24BT0027', 'Yash Meshram',      5, 1, 3),
(28, '24BT0028', 'Yogesh Dhote',      5, 1, 3),
(29, '24BT0029', 'Zoya Khan',         5, 1, 3),
(30, '24BT0030', 'Chirag Agrawal',    5, 1, 3)
ON CONFLICT (bt_id) DO UPDATE SET 
  name = EXCLUDED.name, 
  division_id = EXCLUDED.division_id, 
  batch_id = EXCLUDED.batch_id;

-- 7. Seed Sample Demo Session Data for History Verification
INSERT INTO practical_session (session_id, subject_id, division_id, batch_id, session_date, description) VALUES
(1, 1, 1, 1, '2026-09-25', 'DBMS Lab: Indexing & Relational Queries'),
(2, 1, 1, 2, '2026-09-25', 'DBMS Lab: SQL Joins & Schema Design'),
(3, 2, 1, 1, '2026-09-26', 'C Skill Lab VI: Modern DOM & Event Architecture')
ON CONFLICT (subject_id, division_id, batch_id, session_date) DO NOTHING;

-- Seed Attendance Records for Session 1 (DBMS Lab B1: 8 Present, 2 Absent)
INSERT INTO attendance (session_id, student_id, status) VALUES
(1, 1, 'PRESENT'), (1, 2, 'PRESENT'), (1, 3, 'PRESENT'), (1, 4, 'PRESENT'), (1, 5, 'PRESENT'),
(1, 6, 'PRESENT'), (1, 7, 'PRESENT'), (1, 8, 'PRESENT'), (1, 9, 'ABSENT'),  (1, 10, 'ABSENT')
ON CONFLICT (session_id, student_id) DO NOTHING;

-- Seed Attendance Records for Session 2 (DBMS Lab B2: 9 Present, 1 Absent)
INSERT INTO attendance (session_id, student_id, status) VALUES
(2, 11, 'PRESENT'), (2, 12, 'PRESENT'), (2, 13, 'PRESENT'), (2, 14, 'PRESENT'), (2, 15, 'PRESENT'),
(2, 16, 'PRESENT'), (2, 17, 'PRESENT'), (2, 18, 'PRESENT'), (2, 19, 'PRESENT'), (2, 20, 'ABSENT')
ON CONFLICT (session_id, student_id) DO NOTHING;

-- Seed Attendance Records for Session 3 (C Skill Lab VI B1: 9 Present, 1 Absent)
INSERT INTO attendance (session_id, student_id, status) VALUES
(3, 1, 'PRESENT'), (3, 2, 'PRESENT'), (3, 3, 'PRESENT'), (3, 4, 'PRESENT'), (3, 5, 'PRESENT'),
(3, 6, 'PRESENT'), (3, 7, 'PRESENT'), (3, 8, 'PRESENT'), (3, 9, 'PRESENT'), (3, 10, 'ABSENT')
ON CONFLICT (session_id, student_id) DO NOTHING;
