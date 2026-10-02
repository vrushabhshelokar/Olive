# MEMORY.md

# Sipna Practical Attendance & Student Management System

## 1. Project Identity

**Project Name:** Sipna Practical Attendance & Student Management System

**Institution:** Sipna College of Engineering and Technology

**Project Type:** DBMS academic project

**Primary Objective:** Build a useful faculty-facing practical
attendance system backed by a properly designed PostgreSQL relational
database.

**Primary User:** Faculty

**Secondary User:** Class teacher / authorized faculty verifying student
attendance

------------------------------------------------------------------------

# 2. Core Technology Stack

The project intentionally uses a simple technology stack.

``` text
Frontend:
HTML5
CSS3
Vanilla JavaScript

Backend:
Node.js
Express.js

Database:
PostgreSQL

Database Driver:
pg

Authentication:
bcrypt
express-session

Architecture:
Modular Monolith
```

The project does not require:

``` text
Java
Spring Boot
Spring Data JPA
Hibernate
React
TypeScript
Tailwind CSS
Microservices
Redis
Kubernetes
GraphQL
```

The goal is to demonstrate DBMS concepts clearly without unnecessary
technical complexity.

------------------------------------------------------------------------

# 3. Product Purpose

The system digitizes practical laboratory attendance for Sipna College
of Engineering and Technology.

The product is intentionally focused on:

``` text
Faculty
   +
Practical Attendance
   +
Student Retrieval
   +
Historical Verification
   +
PostgreSQL
```

It is not intended to become a complete college ERP.

------------------------------------------------------------------------

# 4. Main Problem

Manual practical attendance creates difficulty when faculty need to:

-   Record attendance quickly.
-   Find attendance for a previous date.
-   Check whether a particular student was present.
-   Review an entire batch.
-   Calculate attendance percentage.
-   Keep practical subjects separated.
-   Maintain reliable historical records.

The system provides a centralized digital workflow for these
requirements.

------------------------------------------------------------------------

# 5. Main Product Workflow

``` text
Faculty Login
      ↓
Dashboard
      ↓
My Practicals
      ↓
Subject
      ↓
Division
      ↓
Batch
      ↓
Students
      ↓
Practical Attendance
      ↓
PostgreSQL
      ↓
Attendance History
      ↓
Student Snapshot
      ↓
Batch Snapshot
```

------------------------------------------------------------------------

# 6. Academic Structure

## Divisions

Current divisions:

``` text
CS-B
CS-B
CS-C
```

## Practical Batches

Each division has three practical batches.

``` text
CS-B
├── A1
├── A2
└── A3

CS-B
├── B1
├── B2
└── B3

CS-C
├── C1
├── C2
└── C3
```

## Practical Subjects

Current subjects:

``` text
DBMS
C-Skill 4
C-Skill 5
```

All current subjects are practical subjects.

## Semester

Semester remains part of the academic model.

There is no separate `Course` entity.

------------------------------------------------------------------------

# 7. Faculty Model

A faculty member can have multiple practical assignments.

Example:

``` text
Faculty A

├── DBMS → CS-B → A1
├── DBMS → CS-B → A2
├── DBMS → CS-B → B1
├── C-Skill 4 → CS-B → B2
└── C-Skill 5 → CS-C → C3
```

The system must show only the assignments belonging to the authenticated
faculty.

Faculty access must be enforced by the backend.

Frontend filtering is not authorization.

------------------------------------------------------------------------

# 8. Faculty Account

Faculty setup contains:

``` text
Faculty ID
Faculty Code
Name
Email
Department
Designation
Password
```

Constraints:

``` text
Faculty ID → Unique
Faculty Code → Unique
Email → Unique
```

Password must be hashed using bcrypt.

Plaintext passwords must never be stored.

------------------------------------------------------------------------

# 9. Authentication

Login uses:

``` text
Email
Password
```

The MVP uses session-based authentication.

Conceptual flow:

``` text
Email + Password
      ↓
Express
      ↓
Find Faculty
      ↓
bcrypt.compare()
      ↓
Create Session
      ↓
Authenticated Faculty
```

Protected backend routes require authentication.

------------------------------------------------------------------------

# 10. Authorization

After authentication, the backend must verify whether the faculty has an
assignment for:

``` text
Subject
+
Division
+
Batch
```

Example:

``` text
Faculty A
Assigned:
DBMS → CS-B → B2
```

Allowed:

``` text
DBMS → CS-B → B2
```

Rejected:

``` text
DBMS → CS-C → C1
```

if no assignment exists.

Unauthorized access should return:

``` text
403 Forbidden
```

------------------------------------------------------------------------

# 11. Attendance Workflow

The standard workflow is:

``` text
Login
 ↓
Dashboard
 ↓
My Practicals
 ↓
Subject
 ↓
Division
 ↓
Batch
 ↓
Load Students
 ↓
Mark Attendance
 ↓
Save Attendance
 ↓
PostgreSQL
```

Faculty should not manually enter student IDs.

Students are loaded automatically from the selected batch.

------------------------------------------------------------------------

# 12. Attendance Date

The faculty must not manually enter the current attendance date.

The backend determines the authoritative current date.

Example:

``` text
Current Date
27 September 2026
```

The normal attendance workflow uses that date.

Historical date selection is only for viewing previous attendance.

------------------------------------------------------------------------

# 13. Practical Session Identity

One practical session is uniquely identified by:

``` text
Subject
+
Division
+
Batch
+
Date
```

Example:

``` text
DBMS
CS-B
B2
27 September 2026
```

The database must prevent duplicate sessions for the same combination.

Constraint:

``` text
UNIQUE(subject_id, division_id, batch_id, session_date)
```

------------------------------------------------------------------------

# 14. Attendance Behavior

When the attendance screen opens:

``` text
All Students = ABSENT
```

Faculty only marks present students.

Example:

``` text
BT ID       Name          Status
------------------------------------
24BT0001    Student 1     ABSENT
24BT0002    Student 2     PRESENT
24BT0003    Student 3     PRESENT
24BT0004    Student 4     ABSENT
```

Only these statuses are allowed:

``` text
PRESENT
ABSENT
```

------------------------------------------------------------------------

# 15. Attendance Summary

The attendance screen displays:

``` text
Total Students
Present
Absent
```

Example:

``` text
Total:   30
Present: 26
Absent:   4
```

The values update immediately when attendance changes.

------------------------------------------------------------------------

# 16. Attendance Submission

Submission sequence:

``` text
Frontend
   ↓
Backend
   ↓
Authenticate Faculty
   ↓
Verify Faculty Assignment
   ↓
Verify Subject
   ↓
Verify Division
   ↓
Verify Batch
   ↓
Verify Students
   ↓
Determine Current Date
   ↓
Check Duplicate Session
   ↓
Create Session
   ↓
Create Attendance Records
   ↓
Commit Transaction
```

Attendance submission must be transactional.

If an operation fails:

``` text
ROLLBACK
```

No partial official attendance should remain.

------------------------------------------------------------------------

# 17. Attendance Immutability

After successful submission:

``` text
Status = COMPLETED
```

Attendance becomes read-only.

The MVP does not provide normal post-submission editing.

The UI should not display edit controls for completed attendance.

------------------------------------------------------------------------

# 18. Attendance Draft

An incomplete attendance session may be temporarily stored in browser
storage.

Example:

``` text
Faculty starts attendance
      ↓
Marks students
      ↓
Page interruption
      ↓
Draft restored
      ↓
Faculty continues
      ↓
Submit
      ↓
PostgreSQL
```

The draft is temporary and unofficial.

PostgreSQL is the source of truth for completed attendance.

After successful submission:

``` text
Local Draft → Deleted
PostgreSQL → Permanent
```

If submission fails, the draft should remain available.

------------------------------------------------------------------------

# 19. Attendance History

Faculty can view previous attendance.

History is scoped to:

``` text
Subject
+
Division
+
Batch
```

Example:

``` text
DBMS
CS-B
B2

Date          Present    Absent
--------------------------------
25 Sep 2026      26         4
23 Sep 2026      24         6
21 Sep 2026      28         2
```

Selecting a date opens the complete read-only attendance snapshot.

------------------------------------------------------------------------

# 20. Student Verification

The system must support:

> Check whether a particular student was present on a particular date.

Example:

``` text
Student: 24BT0014
Subject: DBMS
Division: CS-B
Batch: B2
Date: 23 September 2026
Status: ABSENT
```

The result must come from PostgreSQL attendance records.

------------------------------------------------------------------------

# 21. Student Snapshot

The student snapshot displays:

``` text
BT ID
Name
Semester
Division
Batch
Total Sessions
Present
Absent
Attendance Percentage
Attendance History
```

Example:

``` text
24BT0014

Student Name
Semester 5
CS-B
B2

DBMS

Total Sessions: 10
Present: 8
Absent: 2
Attendance: 80%
```

Attendance history:

``` text
Date          Status
-------------------------
25 Sep 2026   PRESENT
23 Sep 2026   ABSENT
21 Sep 2026   PRESENT
18 Sep 2026   PRESENT
```

------------------------------------------------------------------------

# 22. Attendance Percentage

Attendance percentage is calculated from stored attendance records.

Formula:

``` text
Present Sessions
--------------------- × 100
Total Sessions
```

Example:

``` text
Present = 8
Total = 10

Attendance = 80%
```

Percentage must not be stored as a manually maintained student field.

------------------------------------------------------------------------

# 23. Batch Snapshot

A batch snapshot is scoped to:

``` text
Subject
+
Division
+
Batch
```

It may display:

``` text
Total Students
Total Sessions
Average Attendance
Student-wise Attendance
```

Example:

``` text
Student       Present   Total   Percentage
-------------------------------------------
Student 1        8       10       80%
Student 2        9       10       90%
Student 3        6       10       60%
```

Practical subjects must remain separate.

------------------------------------------------------------------------

# 24. Student Master Data

Student fields:

``` text
Student ID
BT ID
Name
Semester
Division
Batch
Created At
```

BT ID is unique.

Students should be populated using demo/seed data.

Faculty should not have unrestricted CRUD access to student master data.

------------------------------------------------------------------------

# 25. Core Entities

The system contains these core entities:

``` text
Faculty
FacultyAssignment
Subject
Division
Batch
Student
PracticalSession
Attendance
```

There is no `Course` entity.

------------------------------------------------------------------------

# 26. Faculty Entity

Conceptual fields:

``` text
faculty_id
faculty_code
name
email
department
designation
password_hash
created_at
```

Constraints:

``` text
faculty_id → PRIMARY KEY
faculty_code → UNIQUE
email → UNIQUE
```

------------------------------------------------------------------------

# 27. FacultyAssignment Entity

Conceptual fields:

``` text
assignment_id
faculty_id
subject_id
division_id
batch_id
created_at
```

Recommended uniqueness:

``` text
(faculty_id, subject_id, division_id, batch_id)
```

This defines the practical access of each faculty member.

------------------------------------------------------------------------

# 28. Subject Entity

Conceptual fields:

``` text
subject_id
name
code
type
semester
```

Current subjects:

``` text
DBMS
C-Skill 4
C-Skill 5
```

Current type:

``` text
PRACTICAL
```

------------------------------------------------------------------------

# 29. Division Entity

Conceptual fields:

``` text
division_id
name
semester
```

Current divisions:

``` text
CS-B
CS-B
CS-C
```

------------------------------------------------------------------------

# 30. Batch Entity

Conceptual fields:

``` text
batch_id
name
division_id
```

Relationships:

``` text
CS-B → A1, A2, A3
CS-B → B1, B2, B3
CS-C → C1, C2, C3
```

------------------------------------------------------------------------

# 31. Student Entity

Conceptual fields:

``` text
student_id
bt_id
name
semester
division_id
batch_id
created_at
```

Constraints:

``` text
student_id → PRIMARY KEY
bt_id → UNIQUE
division_id → FOREIGN KEY
batch_id → FOREIGN KEY
```

------------------------------------------------------------------------

# 32. PracticalSession Entity

Conceptual fields:

``` text
session_id
subject_id
division_id
batch_id
session_date
description
created_at
```

Required uniqueness:

``` text
(subject_id, division_id, batch_id, session_date)
```

------------------------------------------------------------------------

# 33. Attendance Entity

Conceptual fields:

``` text
attendance_id
session_id
student_id
status
marked_at
```

Constraints:

``` text
attendance_id → PRIMARY KEY
session_id → FOREIGN KEY
student_id → FOREIGN KEY
status → PRESENT / ABSENT
(session_id, student_id) → UNIQUE
```

------------------------------------------------------------------------

# 34. Database Relationships

## Faculty

``` text
Faculty
   ↓
FacultyAssignment
   ├── Subject
   ├── Division
   └── Batch
```

## Academic Structure

``` text
Division
   ↓
Batch
   ↓
Student
```

## Attendance

``` text
Subject
   ↓
PracticalSession
   ↓
Attendance
   ↑
Student
```

------------------------------------------------------------------------

# 35. Required DBMS Concepts

The project must genuinely demonstrate:

``` text
Primary Keys
Foreign Keys
Unique Constraints
Normalization
Relationships
Joins
Filtering
Aggregation
Transactions
CRUD
```

Examples:

### Joins

Student + Division + Batch.

### Filtering

Students in a selected batch.

### Aggregation

-   Present count.
-   Absent count.
-   Attendance percentage.
-   Average batch attendance.
-   Total sessions.

### Transactions

Creating one session and all its attendance records atomically.

### Constraints

Preventing duplicate and invalid records.

------------------------------------------------------------------------

# 36. Backend API

Core authentication APIs:

``` text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
```

Faculty:

``` text
GET /api/faculty/me
GET /api/faculty/me/assignments
```

Academic:

``` text
GET /api/subjects
GET /api/divisions
GET /api/divisions/:divisionId/batches
```

Students:

``` text
GET /api/students
GET /api/students/:id
GET /api/batches/:batchId/students
GET /api/students/search
```

Attendance:

``` text
POST /api/attendance
GET /api/attendance/history
GET /api/attendance/:sessionId
GET /api/attendance/student/:studentId
```

Snapshots:

``` text
GET /api/snapshots/student/:studentId
GET /api/snapshots/batch/:batchId
```

Exact API paths may evolve while preserving the product requirements.

------------------------------------------------------------------------

# 37. Attendance Request

Conceptual request:

``` json
{
  "subjectId": 1,
  "divisionId": 2,
  "batchId": 5,
  "attendance": [
    {
      "studentId": 101,
      "status": "PRESENT"
    },
    {
      "studentId": 102,
      "status": "ABSENT"
    }
  ]
}
```

The backend determines the permanent date.

The backend also validates:

-   Faculty authorization.
-   Subject.
-   Division.
-   Batch.
-   Student membership.
-   Attendance status.

------------------------------------------------------------------------

# 38. UI Requirements

Main pages/views:

``` text
Login
Faculty Setup
Dashboard
My Practicals
Subject Selection
Division Selection
Batch Selection
Attendance
Attendance History
Historical Attendance Snapshot
Student Search
Student Snapshot
Batch Snapshot
```

------------------------------------------------------------------------

# 39. Main Navigation

Primary navigation:

``` text
Dashboard
My Practicals
Students
```

Optional:

``` text
Profile
Logout
```

Avoid unrelated ERP modules.

------------------------------------------------------------------------

# 40. Dashboard

The dashboard is an entry point rather than an analytics dashboard.

It may show:

``` text
Faculty Name
Today's Date
My Practicals
Recent Attendance
```

Avoid:

``` text
College-wide KPIs
Large analytics charts
Unrelated metrics
```

------------------------------------------------------------------------

# 41. My Practicals

Only assignments of the authenticated faculty are shown.

Example:

``` text
DBMS
CS-B
A1

DBMS
CS-B
B2

C-Skill 4
CS-B
B1
```

------------------------------------------------------------------------

# 42. Attendance Screen

The primary screen should show:

``` text
DBMS · CS-B · B2

Practical Attendance
27 September 2026

Total Students
Present
Absent

Search Students

BT ID
Name
Status

Save Attendance
```

------------------------------------------------------------------------

# 43. History Screen

History should show:

``` text
Subject
Division
Batch
```

and:

``` text
Date
Present
Absent
View
```

Historical attendance is read-only.

------------------------------------------------------------------------

# 44. Student Search

Search supports:

``` text
BT ID
Name
```

Example:

``` text
24BT0014
```

Results should respect authorization and relevant practical context.

------------------------------------------------------------------------

# 45. UI States

Major pages require:

``` text
Loading
Success
Error
Empty
```

Attendance additionally requires:

``` text
Draft
Submitting
Completed
```

------------------------------------------------------------------------

# 46. Design Principles

The UI should be:

``` text
Modern
Professional
Minimal
Clean
Academic
Light
Spacious
Responsive
Desktop-first
```

Priorities:

``` text
Speed
Clarity
Minimal interaction
Strong context visibility
Reliable feedback
```

------------------------------------------------------------------------

# 47. Design Palette

Primary:

``` text
#2563EB
```

Primary hover:

``` text
#1D4ED8
```

Background:

``` text
#F8FAFC
```

Card:

``` text
#FFFFFF
```

Primary text:

``` text
#0F172A
```

Secondary text:

``` text
#475569
```

Muted text:

``` text
#64748B
```

Border:

``` text
#E2E8F0
```

Attendance status uses green for present and red for absent, with text
labels included.

------------------------------------------------------------------------

# 48. Layout

Primary application layout:

``` text
┌─────────────────────────────────────────────┐
│ Header                                      │
├───────────────┬─────────────────────────────┤
│ Sidebar       │ Main Content                │
│               │                             │
│ Dashboard     │                             │
│ My Practicals │                             │
│ Students      │                             │
│               │                             │
│ Profile       │                             │
│ Logout        │                             │
└───────────────┴─────────────────────────────┘
```

------------------------------------------------------------------------

# 49. Context Visibility

Attendance pages must always show:

``` text
Subject
Division
Batch
Date
```

Example:

``` text
DBMS · CS-B · B2
27 September 2026
```

This prevents faculty from marking the wrong practical.

------------------------------------------------------------------------

# 50. Accessibility

The UI should provide:

-   Adequate contrast.
-   Visible focus.
-   Semantic buttons.
-   Form labels.
-   Keyboard support.
-   Status text.
-   Meaningful errors.

Attendance state must not rely on color alone.

------------------------------------------------------------------------

# 51. Error Handling

Important errors:

``` text
Invalid Login
Unauthorized Practical
Invalid Subject
Invalid Division
Invalid Batch
Invalid Student
Student Not in Batch
Duplicate Session
Duplicate Attendance
Database Error
Network Error
```

Errors should be understandable.

Example:

``` text
Attendance could not be submitted.

Your current attendance has been preserved.

Please try again.
```

------------------------------------------------------------------------

# 52. Non-Functional Requirements

## Performance

-   Student lists should load quickly.
-   Attendance interactions should feel immediate.
-   Search should be responsive.
-   Queries should retrieve only required data.

## Reliability

-   Attendance submission must be transactional.
-   Duplicate sessions must be prevented.
-   Duplicate attendance records must be prevented.
-   Failed submissions must preserve drafts.

## Security

-   Passwords must be bcrypt-hashed.
-   Protected APIs require authentication.
-   Authorization is checked server-side.
-   SQL queries are parameterized.
-   User input is validated.
-   Database credentials remain server-side.

## Maintainability

-   Keep backend responsibilities separated.
-   Keep SQL access organized.
-   Keep frontend modules focused.
-   Avoid unnecessary abstractions.

------------------------------------------------------------------------

# 53. Demo Scenario

Primary demo:

``` text
Faculty Login
      ↓
DBMS
      ↓
CS-B
      ↓
B2
      ↓
30 Students
      ↓
All Absent
      ↓
Mark 26 Present
      ↓
Summary:
26 Present
4 Absent
      ↓
Save
      ↓
PostgreSQL
```

Then:

``` text
Attendance History
      ↓
23 September 2026
      ↓
View Complete Attendance
```

Then:

``` text
Search Student
      ↓
24BT0014
      ↓
Student Snapshot
      ↓
Previous Date
      ↓
Present / Absent
```

------------------------------------------------------------------------

# 54. Demo Data

Recommended demo entities:

``` text
Faculty
Students
Subjects
Divisions
Batches
Faculty Assignments
```

Demo data should be inserted through SQL seed data or an equivalent
controlled initialization process.

------------------------------------------------------------------------

# 55. Recommended Repository Structure

``` text
sipna-practical-attendance/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── setup.html
│   ├── dashboard.html
│   ├── practicals.html
│   ├── attendance.html
│   ├── history.html
│   ├── students.html
│   │
│   ├── css/
│   └── js/
│
├── server/
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   └── db/
│
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

The actual implementation may simplify this structure when appropriate.

------------------------------------------------------------------------

# 56. PostgreSQL Source of Truth

Official records:

``` text
Faculty
Assignments
Subjects
Divisions
Batches
Students
Practical Sessions
Attendance
```

are stored in PostgreSQL.

Browser storage is only for temporary attendance drafts.

------------------------------------------------------------------------

# 57. Security Rules

The backend must:

-   Authenticate every protected request.
-   Verify faculty assignments.
-   Validate subject/division/batch relationships.
-   Validate student membership.
-   Use parameterized SQL.
-   Hash passwords.
-   Keep secrets in environment variables.
-   Avoid exposing database credentials.
-   Prevent unauthorized historical access.

------------------------------------------------------------------------

# 58. Implementation Constraints

The project should remain simple.

Do not introduce unnecessary:

``` text
Frameworks
Libraries
Services
Infrastructure
Abstraction layers
```

The technology must serve the product.

The project is a DBMS academic system, not an enterprise platform.

------------------------------------------------------------------------

# 59. Explicitly Out of Scope

The MVP does not include:

``` text
Theory Attendance
Student Login
Parent Login
Fees
Library
Examinations
Marks
Payroll
Faculty Leave
Timetable
AI Assistant
Chatbot
Face Recognition
Biometric Attendance
GPS Attendance
QR Attendance
Mobile Application
Complex Notifications
Advanced ERP Modules
```

------------------------------------------------------------------------

# 60. Possible Future Features

Potential future additions:

``` text
Theory Attendance
Student Portal
PDF Reports
Excel Export
Low Attendance Alerts
Timetable Integration
QR Attendance
Mobile Application
Parent Access
Advanced Reports
```

These are not MVP requirements.

------------------------------------------------------------------------

# 61. Success Criteria

## UI

The system provides:

-   Professional faculty-focused interface.
-   Clear navigation.
-   Fast attendance workflow.
-   Responsive design.
-   Useful history.
-   Student and batch snapshots.

## Backend

The system provides:

-   Node.js + Express.
-   Authentication.
-   Authorization.
-   Validation.
-   Business logic.
-   Transactions.
-   REST APIs.

## Database

The system provides:

-   PostgreSQL.
-   Relational schema.
-   Primary keys.
-   Foreign keys.
-   Unique constraints.
-   Joins.
-   Aggregations.
-   Transactions.
-   Persistent history.

## Practical Use

Faculty can:

``` text
Take attendance quickly
Find previous attendance
Check one student's attendance by date
View batch attendance
```

------------------------------------------------------------------------

# 62. Definition of Done

The MVP is complete when this flow works with real database data:

``` text
Faculty Setup
      ↓
Login
      ↓
Faculty Assignments
      ↓
Dashboard
      ↓
My Practicals
      ↓
Subject
      ↓
Division
      ↓
Batch
      ↓
Student List
      ↓
Attendance
      ↓
Present / Absent
      ↓
Save
      ↓
PostgreSQL
      ↓
History
      ↓
Date-Specific Attendance
      ↓
Student Snapshot
      ↓
Batch Snapshot
```

Hardcoded-only pages are not considered complete.

------------------------------------------------------------------------

# 63. Final Product Definition

The product is:

> A practical attendance productivity system for Sipna College of
> Engineering and Technology that replaces manual practical attendance
> records with a searchable, persistent, faculty-specific
> PostgreSQL-backed system.

The core outcome is:

``` text
Faculty takes attendance quickly
        +
Attendance is stored safely
        +
Historical records remain available
        +
Student attendance can be verified by date
        +
Batch attendance can be reviewed
```

------------------------------------------------------------------------

# 64. Final Architecture Memory

``` text
Browser
   │
   │ HTML + CSS + Vanilla JS
   ▼
Node.js + Express
   │
   ├── Authentication
   ├── Authorization
   ├── Validation
   ├── Business Logic
   └── SQL / pg
   │
   ▼
PostgreSQL
   │
   ├── Faculty
   ├── FacultyAssignment
   ├── Subject
   ├── Division
   ├── Batch
   ├── Student
   ├── PracticalSession
   └── Attendance
```

------------------------------------------------------------------------

# 65. Final Rules to Preserve During Implementation

1.  Practical attendance is the core product.
2.  The system is Sipna-specific.
3.  PostgreSQL is the source of truth.
4.  Faculty can have multiple practical assignments.
5.  Faculty can be assigned to multiple divisions/batches.
6.  Faculty sees only assigned practicals.
7.  Backend authorization is mandatory.
8.  `Course` is not required.
9.  `Semester` remains part of the model.
10. Each division has three practical batches.
11. Current practical subjects are DBMS, C-Skill 4, and C-Skill 5.
12. Attendance supports only PRESENT and ABSENT.
13. All students default to ABSENT.
14. Faculty marks students PRESENT.
15. Current attendance date is determined by the backend.
16. Historical dates are for viewing previous attendance.
17. Practical sessions are unique by subject/division/batch/date.
18. Attendance records are unique by session/student.
19. Attendance submission uses a PostgreSQL transaction.
20. Failed transactions roll back.
21. Completed attendance is read-only.
22. Local drafts are temporary.
23. PostgreSQL stores official attendance.
24. Student attendance percentage is derived from records.
25. Practical subjects remain separate.
26. Faculty should not have unrestricted student master-data CRUD.
27. SQL must use parameterized queries.
28. Passwords must be hashed.
29. Unnecessary frameworks must not be introduced.
30. The project must remain simple enough to understand and demonstrate
    as a DBMS project.
