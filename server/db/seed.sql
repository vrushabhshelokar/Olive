-- Sipna Practical Attendance & Student Management System Seed Data

-- 1. Insert Divisions
INSERT INTO division (division_id, name, semester) VALUES
(1, 'CS-A', 5),
(2, 'CS-B', 5),
(3, 'CS-C', 5)
ON CONFLICT (name) DO UPDATE SET semester = EXCLUDED.semester;

-- 2. Insert Batches
INSERT INTO batch (batch_id, name, division_id) VALUES
(1, 'B1', 1),
(2, 'A2', 1),
(3, 'A3', 1),
(4, 'B1', 2),
(5, 'B2', 2),
(6, 'B3', 2),
(7, 'C1', 3),
(8, 'C2', 3),
(9, 'C3', 3)
ON CONFLICT (division_id, name) DO NOTHING;

-- 3. Insert Practical Subjects
INSERT INTO subject (subject_id, name, code, type, semester) VALUES
(1, 'Database Management System', 'DBMS', 'PRACTICAL', 5),
(2, 'C-Skill 4 (Advanced Web Technologies)', 'CSKILL4', 'PRACTICAL', 5),
(3, 'C-Skill 5 (Cloud & System Programming)', 'CSKILL5', 'PRACTICAL', 5)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, semester = EXCLUDED.semester;

-- 4. Insert Demo Faculty
-- Default Password for both demo accounts: Demo@123
INSERT INTO faculty (faculty_id, faculty_code, name, email, department, designation, password_hash) VALUES
(1, 'FAC001', 'Prof. ABC', 'abc@sipna.ac.in', 'Computer Science & Engineering', 'Assistant Professor', '$2b$10$wCy9C3cxxCCqqCprl1fCA.jx/3Y2N4U1rLSKvygoPGFVwoY5jmtKm'),
(2, 'FAC002', 'Prof. XYZ', 'xyz@sipna.ac.in', 'Computer Science & Engineering', 'Associate Professor', '$2b$10$wCy9C3cxxCCqqCprl1fCA.jx/3Y2N4U1rLSKvygoPGFVwoY5jmtKm')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, department = EXCLUDED.department, designation = EXCLUDED.designation, password_hash = EXCLUDED.password_hash;

-- 5. Insert Faculty Assignments
INSERT INTO faculty_assignment (faculty_id, subject_id, division_id, batch_id) VALUES
-- Prof. ABC (FAC001)
(1, 1, 1, 1), -- DBMS -> CS-B -> B1
(1, 1, 2, 5), -- DBMS -> CS-B -> B2
(1, 2, 2, 4), -- C-Skill 4 -> CS-B -> B1
-- Prof. XYZ (FAC002)
(2, 1, 3, 7), -- DBMS -> CS-C -> C1
(2, 3, 3, 9)  -- C-Skill 5 -> CS-C -> C3
ON CONFLICT (faculty_id, subject_id, division_id, batch_id) DO NOTHING;

-- 6. Insert Demo Students for CS-B Batch B2 (30 Students)
INSERT INTO student (student_id, bt_id, name, semester, division_id, batch_id) VALUES
(1, '24BT0001', 'Aarav Sharma', 5, 2, 5),
(2, '24BT0002', 'Aditi Deshmukh', 5, 2, 5),
(3, '24BT0003', 'Aniket Joshi', 5, 2, 5),
(4, '24BT0004', 'Ananya Kulkarni', 5, 2, 5),
(5, '24BT0005', 'Bhavesh Patel', 5, 2, 5),
(6, '24BT0006', 'Chetan Ingole', 5, 2, 5),
(7, '24BT0007', 'Devendra Wankhade', 5, 2, 5),
(8, '24BT0008', 'Divya Tayade', 5, 2, 5),
(9, '24BT0009', 'Gaurav Chaudhari', 5, 2, 5),
(10, '24BT0010', 'Harshada Gawande', 5, 2, 5),
(11, '24BT0011', 'Isha Mahajan', 5, 2, 5),
(12, '24BT0012', 'Kunal Rathi', 5, 2, 5),
(13, '24BT0013', 'Manish Agrawal', 5, 2, 5),
(14, '24BT0014', 'Rahul Sharma', 5, 2, 5),
(15, '24BT0015', 'Nisha Verma', 5, 2, 5),
(16, '24BT0016', 'Omkar Patil', 5, 2, 5),
(17, '24BT0017', 'Pooja Kale', 5, 2, 5),
(18, '24BT0018', 'Pranav Bhole', 5, 2, 5),
(19, '24BT0019', 'Rohan Phadke', 5, 2, 5),
(20, '24BT0020', 'Riya Gadkari', 5, 2, 5),
(21, '24BT0021', 'Sakshi More', 5, 2, 5),
(22, '24BT0022', 'Siddharth Shinde', 5, 2, 5),
(23, '24BT0023', 'Sneha Shelke', 5, 2, 5),
(24, '24BT0024', 'Tanmay Deshpande', 5, 2, 5),
(25, '24BT0025', 'Tejas Nimbalkar', 5, 2, 5),
(26, '24BT0026', 'Utkarsh Bhusari', 5, 2, 5),
(27, '24BT0027', 'Vaishnavi Thorat', 5, 2, 5),
(28, '24BT0028', 'Yash Meshram', 5, 2, 5),
(29, '24BT0029', 'Yogesh Dhote', 5, 2, 5),
(30, '24BT0030', 'Zoya Khan', 5, 2, 5)
ON CONFLICT (bt_id) DO UPDATE SET name = EXCLUDED.name, division_id = EXCLUDED.division_id, batch_id = EXCLUDED.batch_id;

-- Additional Demo Students for CS-B Batch B1
INSERT INTO student (student_id, bt_id, name, semester, division_id, batch_id) VALUES
(31, '24BT0031', 'Abhishek Badhe', 5, 1, 1),
(32, '24BT0032', 'Bhumi Solanki', 5, 1, 1),
(33, '24BT0033', 'Dhiraj Kakde', 5, 1, 1),
(34, '24BT0034', 'Janhavi Mohite', 5, 1, 1),
(35, '24BT0035', 'Karthik Pillai', 5, 1, 1)
ON CONFLICT (bt_id) DO NOTHING;

-- Additional Demo Students for CS-B Batch B1
INSERT INTO student (student_id, bt_id, name, semester, division_id, batch_id) VALUES
(36, '24BT0036', 'Aditya Raut', 5, 2, 4),
(37, '24BT0037', 'Kavya Sawant', 5, 2, 4),
(38, '24BT0038', 'Mayur Gade', 5, 2, 4)
ON CONFLICT (bt_id) DO NOTHING;

-- Additional Demo Students for CS-C Batch C1
INSERT INTO student (student_id, bt_id, name, semester, division_id, batch_id) VALUES
(39, '24BT0039', 'Nitin Sable', 5, 3, 7),
(40, '24BT0040', 'Payal Khadse', 5, 3, 7)
ON CONFLICT (bt_id) DO NOTHING;

-- 7. Seed Historical Sessions for DBMS CS-B B2 for realistic history testing
INSERT INTO practical_session (session_id, subject_id, division_id, batch_id, session_date, description) VALUES
(1, 1, 2, 5, '2026-09-21', 'Lab Experiment 1: ER Diagram Modeling & Relational Schema'),
(2, 1, 2, 5, '2026-09-23', 'Lab Experiment 2: DDL Statements & Constraints Construction'),
(3, 1, 2, 5, '2026-09-25', 'Lab Experiment 3: DML Queries & Complex Joins')
ON CONFLICT (subject_id, division_id, batch_id, session_date) DO NOTHING;

-- 8. Seed Attendance Records for Session 1 (2026-09-21): 28 Present, 2 Absent
INSERT INTO attendance (session_id, student_id, status) VALUES
(1, 1, 'PRESENT'), (1, 2, 'PRESENT'), (1, 3, 'PRESENT'), (1, 4, 'PRESENT'), (1, 5, 'PRESENT'),
(1, 6, 'PRESENT'), (1, 7, 'PRESENT'), (1, 8, 'PRESENT'), (1, 9, 'PRESENT'), (1, 10, 'PRESENT'),
(1, 11, 'PRESENT'), (1, 12, 'PRESENT'), (1, 13, 'PRESENT'), (1, 14, 'ABSENT'), (1, 15, 'PRESENT'),
(1, 16, 'PRESENT'), (1, 17, 'PRESENT'), (1, 18, 'PRESENT'), (1, 19, 'PRESENT'), (1, 20, 'PRESENT'),
(1, 21, 'PRESENT'), (1, 22, 'PRESENT'), (1, 23, 'PRESENT'), (1, 24, 'PRESENT'), (1, 25, 'PRESENT'),
(1, 26, 'PRESENT'), (1, 27, 'PRESENT'), (1, 28, 'PRESENT'), (1, 29, 'PRESENT'), (1, 30, 'ABSENT')
ON CONFLICT (session_id, student_id) DO NOTHING;

-- Seed Attendance Records for Session 2 (2026-09-23): 24 Present, 6 Absent
INSERT INTO attendance (session_id, student_id, status) VALUES
(2, 1, 'PRESENT'), (2, 2, 'PRESENT'), (2, 3, 'ABSENT'), (2, 4, 'PRESENT'), (2, 5, 'PRESENT'),
(2, 6, 'PRESENT'), (2, 7, 'ABSENT'), (2, 8, 'PRESENT'), (2, 9, 'PRESENT'), (2, 10, 'PRESENT'),
(2, 11, 'PRESENT'), (2, 12, 'ABSENT'), (2, 13, 'PRESENT'), (2, 14, 'ABSENT'), (2, 15, 'PRESENT'),
(2, 16, 'PRESENT'), (2, 17, 'PRESENT'), (2, 18, 'ABSENT'), (2, 19, 'PRESENT'), (2, 20, 'PRESENT'),
(2, 21, 'PRESENT'), (2, 22, 'PRESENT'), (2, 23, 'PRESENT'), (2, 24, 'PRESENT'), (2, 25, 'PRESENT'),
(2, 26, 'PRESENT'), (2, 27, 'ABSENT'), (2, 28, 'PRESENT'), (2, 29, 'PRESENT'), (2, 30, 'PRESENT')
ON CONFLICT (session_id, student_id) DO NOTHING;

-- Seed Attendance Records for Session 3 (2026-09-25): 26 Present, 4 Absent
INSERT INTO attendance (session_id, student_id, status) VALUES
(3, 1, 'PRESENT'), (3, 2, 'PRESENT'), (3, 3, 'PRESENT'), (3, 4, 'PRESENT'), (3, 5, 'PRESENT'),
(3, 6, 'ABSENT'), (3, 7, 'PRESENT'), (3, 8, 'PRESENT'), (3, 9, 'PRESENT'), (3, 10, 'PRESENT'),
(3, 11, 'PRESENT'), (3, 12, 'PRESENT'), (3, 13, 'PRESENT'), (3, 14, 'ABSENT'), (3, 15, 'PRESENT'),
(3, 16, 'PRESENT'), (3, 17, 'PRESENT'), (3, 18, 'PRESENT'), (3, 19, 'PRESENT'), (3, 20, 'ABSENT'),
(3, 21, 'PRESENT'), (3, 22, 'PRESENT'), (3, 23, 'PRESENT'), (3, 24, 'PRESENT'), (3, 25, 'PRESENT'),
(3, 26, 'PRESENT'), (3, 27, 'PRESENT'), (3, 28, 'PRESENT'), (3, 29, 'ABSENT'), (3, 30, 'PRESENT')
ON CONFLICT (session_id, student_id) DO NOTHING;


