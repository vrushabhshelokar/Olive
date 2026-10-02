# PRD.md

# Sipna Practical Attendance & Student Management System

## 1. Product Overview

**Project Name:** Sipna Practical Attendance & Student Management System

**Institution:** Sipna College of Engineering and Technology

**Project Type:** DBMS academic project

**Primary Objective:** Build a genuinely useful faculty-facing practical
attendance system that demonstrates meaningful use of a relational
PostgreSQL database.

### Technology Stack

-   **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
-   **Backend:** Node.js + Express.js
-   **Database:** PostgreSQL
-   **Database Driver:** `pg`
-   **Authentication:** Session-based authentication with bcrypt
    password hashing
-   **Architecture:** Modular monolith
-   **ORM:** None
-   **Frontend Framework:** None
-   **Build Framework:** None required

The system replaces rough/manual practical attendance records with a
searchable, persistent, faculty-specific digital system.

------------------------------------------------------------------------

# 2. Problem Statement

Practical laboratory attendance may currently be recorded manually on
paper or through rough temporary records. This creates problems when
faculty need to:

-   Record attendance quickly.
-   Find attendance for a particular date.
-   Verify whether a particular student attended a practical.
-   Review attendance for an entire batch.
-   Calculate student attendance percentage.
-   Review historical attendance without searching through physical
    records.

The system should digitize this workflow while keeping the product
focused specifically on practical attendance.

------------------------------------------------------------------------

# 3. Product Vision

The product should follow one central principle:

> **Faculty should enter attendance once, and the system should handle
> storage, organization, retrieval, and calculation automatically.**

The system should be simple enough for rapid faculty use while
demonstrating:

-   PostgreSQL relational design.
-   Primary and foreign keys.
-   Unique constraints.
-   Normalization.
-   SQL joins.
-   Filtering.
-   Aggregation.
-   Transactions.
-   Authentication.
-   Authorization.
-   Historical data persistence.

------------------------------------------------------------------------

# 4. Primary Users

## 4.1 Faculty

Faculty are the primary users.

A faculty member can:

-   Create/setup an account.
-   Log in.
-   View their assigned practicals.
-   View assigned divisions.
-   View assigned batches.
-   Open a practical.
-   Load students automatically.
-   Mark attendance.
-   Save attendance.
-   View previous attendance.
-   Search students.
-   View student attendance history.
-   View batch attendance snapshots.

A faculty member may be responsible for more than one division and
multiple practical assignments.

## 4.2 Class Teacher

Class teachers are a secondary practical user.

They may need to verify student attendance records, but the MVP remains
primarily faculty-focused.

------------------------------------------------------------------------

# 5. Product Scope

The MVP focuses only on practical laboratory attendance.

### Core flow

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

The system is intentionally not a complete college ERP.

------------------------------------------------------------------------

# 6. Academic Structure

## 6.1 Divisions

Current prototype divisions:

``` text
CS-B
CS-B
CS-C
```

## 6.2 Practical Batches

Each division contains three practical batches:

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

## 6.3 Practical Subjects

Current semester practical subjects:

``` text
DBMS
C-Skill 4
C-Skill 5
```

All current subjects are of type:

``` text
PRACTICAL
```

## 6.4 Semester

Semester must be retained in the academic model.

The project does not require a separate `Course` entity.

------------------------------------------------------------------------

# 7. Faculty Assignment Model

Faculty access is controlled through explicit assignments.

A faculty member may have assignments such as:

``` text
Faculty A

├── DBMS → CS-B → A1
├── DBMS → CS-B → A2
├── DBMS → CS-B → B1
├── C-Skill 4 → CS-B → B2
└── C-Skill 5 → CS-C → C3
```

The system must not automatically expose every subject, division, or
batch to every faculty member.

The dashboard and backend must show/enforce only assignments belonging
to the authenticated faculty.

------------------------------------------------------------------------

# 8. Faculty Account Setup

During first-time setup, faculty provide:

-   Faculty ID
-   Faculty code
-   Name
-   Email
-   Department
-   Designation
-   Password

### Constraints

-   Faculty ID must be unique.
-   Faculty code must be unique.
-   Email must be unique.
-   Password must never be stored as plaintext.
-   Password must be stored using a secure bcrypt hash.

------------------------------------------------------------------------

# 9. Faculty Authentication

Faculty login uses:

``` text
Email
Password
```

The MVP uses simple session-based authentication.

After successful login:

``` text
Browser
   ↓
Session
   ↓
Authenticated Faculty
   ↓
Protected Routes
```

The backend must identify the faculty associated with the active
session.

Complex enterprise authentication is not required for the MVP.

------------------------------------------------------------------------

# 10. Authorization

Authentication alone is not sufficient.

The backend must verify that the authenticated faculty is assigned to
the requested:

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
    ↓
Assigned to DBMS → CS-B → B2
```

Faculty A may access that practical.

If Faculty A attempts:

``` text
DBMS → CS-C → C1
```

without an assignment, the backend must reject the request.

Frontend filtering is never considered authorization.

------------------------------------------------------------------------

# 11. Main Attendance Workflow

The main workflow is:

``` text
Faculty Login
      ↓
Dashboard
      ↓
My Practicals
      ↓
Select Subject
      ↓
Select Division
      ↓
Select Batch
      ↓
Load Students
      ↓
Mark Attendance
      ↓
Save Attendance
      ↓
PostgreSQL
```

Example:

``` text
DBMS
 ↓
CS-B
 ↓
B2
 ↓
Students
 ↓
Attendance
```

The faculty should not manually enter student IDs.

------------------------------------------------------------------------

# 12. Attendance Date Handling

Faculty must not manually enter the date during normal attendance.

The system automatically determines the current date.

The backend is authoritative for the permanent attendance date.

Example:

``` text
Current Date
27 September 2026
```

When faculty opens the attendance page, attendance is created for the
current date.

Historical date selection is allowed only when viewing previous
attendance.

The normal attendance page must not expose a date picker for selecting
the attendance date.

------------------------------------------------------------------------

# 13. Practical Session Model

A practical attendance session is uniquely identified by:

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
B1
25 September 2026
```

This represents one practical attendance session.

The database must prevent multiple sessions for the same:

``` text
Subject + Division + Batch + Date
```

combination.

------------------------------------------------------------------------

# 14. Attendance Behavior

When attendance is opened:

``` text
ALL STUDENTS = ABSENT
```

Faculty only needs to mark students who are present.

Example:

``` text
BT ID       Name          Status
------------------------------------
24BT0001    Student 1     ABSENT
24BT0002    Student 2     PRESENT
24BT0003    Student 3     PRESENT
24BT0004    Student 4     ABSENT
```

Only two attendance states exist:

``` text
PRESENT
ABSENT
```

------------------------------------------------------------------------

# 15. Attendance Summary

The attendance page must display a live summary:

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

The values must update immediately when faculty changes attendance
states.

------------------------------------------------------------------------

# 16. Attendance Submission

The conceptual submission flow is:

``` text
Frontend
   ↓
Express API
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
Commit PostgreSQL Transaction
```

Attendance submission must be transactional.

If any critical operation fails, the transaction must roll back.

No partially submitted attendance session should remain in PostgreSQL.

------------------------------------------------------------------------

# 17. Attendance Immutability

Once attendance is successfully submitted:

``` text
COMPLETED
```

the attendance becomes read-only.

The MVP does not provide a normal post-submission editing workflow.

The system should not expose an endpoint intended to modify completed
attendance.

This protects historical attendance integrity.

------------------------------------------------------------------------

# 18. Attendance Draft Preservation

Incomplete attendance should be temporarily preserved in the browser.

Example:

``` text
Faculty starts attendance
       ↓
Marks students
       ↓
Browser refresh / interruption
       ↓
Draft restored
       ↓
Faculty continues
       ↓
Submit
       ↓
Permanent PostgreSQL record
```

Possible browser storage:

``` text
localStorage
```

The draft is not official attendance.

PostgreSQL is the source of truth for completed attendance.

After successful submission:

``` text
Local Draft → Delete
PostgreSQL → Permanent Record
```

If submission fails, the draft must remain available for retry.

------------------------------------------------------------------------

# 19. Historical Attendance

Faculty must be able to view previous attendance.

History is scoped to:

``` text
Subject
Division
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

# 20. Student Date-Specific Verification

The system must answer:

> Was a particular student present on a particular date?

Example:

``` text
Student: 24BT0014
Subject: DBMS
Division: CS-B
Batch: B2
Date: 23 September 2026
Status: ABSENT
```

The result must come from the actual stored PostgreSQL attendance
record.

The system must not reconstruct historical attendance from temporary
frontend state.

------------------------------------------------------------------------

# 21. Student Snapshot

The student snapshot is scoped to a selected practical.

Example:

``` text
Student:
24BT0014

Subject:
DBMS

Division:
CS-B

Batch:
B2
```

It should display:

-   BT ID
-   Name
-   Semester
-   Division
-   Batch
-   Total Sessions
-   Present
-   Absent
-   Attendance Percentage
-   Attendance History

Example:

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

Attendance percentage is derived from stored attendance records.

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

Attendance percentage must not be manually stored in the student master
table.

It must be calculated from attendance records.

------------------------------------------------------------------------

# 23. Batch Attendance Snapshot

A batch snapshot is scoped to:

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

The snapshot must never combine different practical subjects.

------------------------------------------------------------------------

# 24. Practical Separation

Attendance for:

``` text
DBMS
C-Skill 4
C-Skill 5
```

must remain separate.

DBMS attendance percentage must not include C-Skill 4 or C-Skill 5
attendance.

The same student may have records for all three practicals, but each
practical maintains its own attendance history.

------------------------------------------------------------------------

# 25. Student Master Data

Student master data requires:

-   BT ID
-   Name
-   Semester
-   Division
-   Batch

`Course` is not required.

BT ID must be unique.

Students should initially be populated using demo/seed data.

Faculty must not have unrestricted CRUD access to student master data.

Faculty should not casually be able to:

-   Delete students.
-   Change BT IDs.
-   Change divisions.
-   Change batches.

This protects historical attendance integrity.

------------------------------------------------------------------------

# 26. Core Database Entities

The core relational entities are:

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

There is no separate `Course` entity.

------------------------------------------------------------------------

# 27. Faculty Entity

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
faculty_id    → PRIMARY KEY
faculty_code  → UNIQUE
email         → UNIQUE
```

------------------------------------------------------------------------

# 28. FacultyAssignment Entity

Conceptual fields:

``` text
assignment_id
faculty_id
subject_id
division_id
batch_id
created_at
```

This represents:

``` text
Faculty
+
Subject
+
Division
+
Batch
```

Example:

``` text
FAC001
DBMS
CS-B
B2
```

The assignment determines which practical batch appears under the
faculty's `My Practicals`.

------------------------------------------------------------------------

# 29. Subject Entity

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

# 30. Division Entity

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

# 31. Batch Entity

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

A batch belongs to one division.

------------------------------------------------------------------------

# 32. Student Entity

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
bt_id      → UNIQUE
division_id → FOREIGN KEY
batch_id    → FOREIGN KEY
```

A student belongs to a valid division and batch.

------------------------------------------------------------------------

# 33. PracticalSession Entity

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

The session represents:

``` text
Subject
+
Division
+
Batch
+
Date
```

The database must prevent duplicate sessions for the same context.

------------------------------------------------------------------------

# 34. Attendance Entity

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
session_id    → FOREIGN KEY
student_id    → FOREIGN KEY
status        → PRESENT / ABSENT
(session_id, student_id) → UNIQUE
```

A student can have only one attendance record in one practical session.

------------------------------------------------------------------------

# 35. Database Relationships

## Academic Structure

``` text
Division
   ↓
Batch
   ↓
Student
```

## Faculty Structure

``` text
Faculty
   ↓
FacultyAssignment
   ├── Subject
   ├── Division
   └── Batch
```

## Attendance Structure

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

# 36. DBMS Requirements

The project must demonstrate genuine relational database usage.

Required concepts:

-   Primary Keys
-   Foreign Keys
-   Unique Constraints
-   Normalization
-   Relationships
-   Joins
-   Filtering
-   Aggregation
-   Transactions
-   CRUD operations

Important SQL use cases include:

### Joins

Student + Division + Batch.

### Filtering

Students belonging to a selected batch.

### Aggregation

-   Present count.
-   Absent count.
-   Attendance percentage.
-   Average batch attendance.
-   Total sessions.

### Transactions

Saving one practical session and all of its attendance records as one
logical database operation.

### Constraints

Prevent:

-   Duplicate BT IDs.
-   Duplicate faculty emails.
-   Duplicate faculty codes.
-   Duplicate sessions.
-   Duplicate attendance records.
-   Invalid foreign keys.

------------------------------------------------------------------------

# 37. Backend Requirements

The backend must use:

``` text
Node.js
Express.js
pg
bcrypt
express-session
```

Recommended backend structure:

``` text
server/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── repositories/
├── utils/
├── db/
└── server.js
```

The exact folder structure may evolve, but responsibilities must remain
separated.

------------------------------------------------------------------------

# 38. Backend Layer Responsibilities

Conceptual flow:

``` text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository / SQL
  ↓
PostgreSQL
```

### Routes

Define HTTP endpoints.

### Controllers

Handle HTTP request/response concerns.

Controllers should remain thin.

### Services

Contain business rules and validation.

### Repositories

Contain database access and SQL queries.

### Middleware

Handle:

-   Authentication.
-   Session checks.
-   Request validation where appropriate.
-   Error handling.

------------------------------------------------------------------------

# 39. Backend Services

Recommended services:

``` text
AuthService
FacultyService
AssignmentService
StudentService
AttendanceService
SnapshotService
```

### AuthService

Handles:

-   Registration.
-   Password hashing.
-   Login.
-   Session creation.
-   Logout.

### FacultyService

Handles:

-   Faculty information.
-   Faculty assignment retrieval.

### AssignmentService

Handles:

-   Faculty assignment validation.
-   Faculty access checks.

### StudentService

Handles:

-   Student retrieval.
-   Search.
-   Batch-specific student retrieval.

### AttendanceService

Handles:

-   Attendance creation.
-   Session creation.
-   Validation.
-   Duplicate detection.
-   Transactions.
-   Historical retrieval.

### SnapshotService

Handles:

-   Student snapshots.
-   Batch snapshots.
-   Attendance calculations.

------------------------------------------------------------------------

# 40. Frontend Requirements

The frontend must use:

``` text
HTML5
CSS3
Vanilla JavaScript
```

No React or other frontend framework is required.

Recommended structure:

``` text
public/
├── index.html
├── css/
│   ├── styles.css
│   └── components.css
└── js/
    ├── app.js
    ├── api.js
    ├── auth.js
    ├── attendance.js
    ├── students.js
    ├── history.js
    └── utils.js
```

The exact structure may evolve.

The frontend communicates with the Express backend through REST APIs
using `fetch()`.

------------------------------------------------------------------------

# 41. Main Pages

Required pages/views:

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

# 42. Main Routes

Conceptual browser routes:

``` text
/login
/setup
/dashboard
/practicals
/practicals/:subjectId
/practicals/:subjectId/:divisionId
/practicals/:subjectId/:divisionId/:batchId
/practicals/:subjectId/:divisionId/:batchId/attendance
/practicals/:subjectId/:divisionId/:batchId/history
/practicals/:subjectId/:divisionId/:batchId/history/:sessionId
/students
/students/:studentId
```

Routes should preserve practical context.

------------------------------------------------------------------------

# 43. API Requirements

## Authentication

``` http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
```

## Faculty

``` http
GET /api/faculty/me
GET /api/faculty/me/assignments
```

## Academic

``` http
GET /api/subjects
GET /api/divisions
GET /api/divisions/:divisionId/batches
```

## Students

``` http
GET /api/students
GET /api/students/:id
GET /api/batches/:batchId/students
GET /api/students/search
```

## Attendance

``` http
POST /api/attendance
GET /api/attendance/history
GET /api/attendance/:sessionId
GET /api/attendance/student/:studentId
```

## Snapshots

Conceptually:

``` http
GET /api/snapshots/student/:studentId
GET /api/snapshots/batch/:batchId
```

The exact final API may evolve during implementation as long as the
underlying product requirements remain intact.

------------------------------------------------------------------------

# 44. Main Attendance Request

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

The backend determines the permanent attendance date.

The backend must also validate that every student belongs to the
selected batch and that the faculty is authorized for the selected
practical context.

------------------------------------------------------------------------

# 45. Main Attendance Response

Conceptual response:

``` json
{
  "sessionId": 101,
  "subject": "DBMS",
  "division": "CS-B",
  "batch": "B2",
  "date": "2026-09-27",
  "totalStudents": 30,
  "present": 26,
  "absent": 4,
  "status": "COMPLETED"
}
```

------------------------------------------------------------------------

# 46. UI States

Every major page must support:

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

After successful submission, the attendance view becomes read-only.

------------------------------------------------------------------------

# 47. Search Requirements

Student search must support:

``` text
BT ID
Name
```

Example:

``` text
Search: 24BT0014
```

Search must respect the relevant faculty and practical context where
applicable.

When searching inside attendance, only students from the current batch
should be returned.

------------------------------------------------------------------------

# 48. Historical Retrieval Requirements

The system must support:

### Batch history

``` text
Subject
→ Division
→ Batch
→ Attendance History
→ Date
→ Complete Attendance
```

### Student verification

``` text
Subject
→ Division
→ Batch
→ Student
→ Attendance History
```

The system must retrieve historical records from PostgreSQL.

------------------------------------------------------------------------

# 49. Demo Data

Demo data will be prepared by the project owner.

Recommended file:

``` text
demo-data.xlsx
```

Recommended sheets:

``` text
faculty
students
subjects
faculty_assignments
```

Optional:

``` text
divisions
batches
```

------------------------------------------------------------------------

# 50. Faculty Demo Data Format

``` text
faculty_code
name
email
department
designation
password
```

Example:

``` text
FAC001
Prof. ABC
abc@sipna.ac.in
CSE
Assistant Professor
Demo@123
```

Passwords from demo data must be hashed before being stored in
PostgreSQL.

------------------------------------------------------------------------

# 51. Student Demo Data Format

``` text
bt_id
name
semester
division
batch
```

Example:

``` text
24BT0014
Student Name
5
CS-B
B2
```

------------------------------------------------------------------------

# 52. Subject Demo Data Format

``` text
subject_code
subject_name
type
semester
```

Example:

``` text
DBMS
Database Management System
PRACTICAL
5
```

------------------------------------------------------------------------

# 53. Faculty Assignment Demo Data Format

``` text
faculty_code
subject_code
division
batch
```

Example:

``` text
FAC001
DBMS
CS-B
B2
```

This determines what the faculty sees under `My Practicals`.

------------------------------------------------------------------------

# 54. Data Initialization

Logical flow:

``` text
demo-data.xlsx
      ↓
Validation
      ↓
Seed Process
      ↓
PostgreSQL
```

The frontend should not require manually entering all students for the
demo.

Attendance records should normally be created through the application
workflow.

------------------------------------------------------------------------

# 55. Data Integrity Requirements

The database/application must ensure:

-   BT ID is unique.
-   Faculty email is unique.
-   Faculty code is unique.
-   A batch belongs to one division.
-   A student belongs to one batch.
-   A student belongs to a valid division.
-   Faculty assignments reference valid entities.
-   A faculty can access only assigned practicals.
-   A practical session is unique by subject/division/batch/date.
-   Attendance is unique by session/student.
-   Attendance status is `PRESENT` or `ABSENT`.
-   Completed attendance is read-only.

------------------------------------------------------------------------

# 56. Error Handling

Important errors include:

``` text
Invalid login
Unauthorized practical
Invalid subject
Invalid division
Invalid batch
Invalid student
Student not belonging to batch
Duplicate attendance session
Duplicate student attendance
Database error
Network error
```

Errors must be understandable to faculty.

Example:

``` text
Attendance could not be submitted.

Your current attendance has been preserved.

Please try again.
```

------------------------------------------------------------------------

# 57. Required UI/UX Principles

The application should be:

-   Modern.
-   Professional.
-   Minimal.
-   Faculty-focused.
-   Clean.
-   Responsive.
-   Desktop-first.

The interface should communicate:

> Sipna College faculty practical attendance system.

Attendance screens must prioritize speed over decoration.

The faculty should be able to:

``` text
Open
 ↓
See students
 ↓
Click Present
 ↓
Review
 ↓
Save
```

with minimal unnecessary interaction.

------------------------------------------------------------------------

# 58. Context Visibility

Every attendance-related page must clearly show:

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

This prevents confusion when the same faculty and student are associated
with multiple practical contexts.

------------------------------------------------------------------------

# 59. Attendance Interaction

Default:

``` text
All = Absent
```

Clicking a student changes:

``` text
ABSENT → PRESENT
```

Clicking again may change:

``` text
PRESENT → ABSENT
```

The interface must immediately update:

``` text
Present count
Absent count
```

No full-page reload should be required.

------------------------------------------------------------------------

# 60. Completed Attendance UI

After submission:

``` text
Attendance Completed
```

The page becomes read-only.

Do not display misleading edit controls.

If today's attendance already exists:

``` text
Attendance Already Submitted

DBMS · CS-B · B2
27 September 2026

This practical attendance has already been submitted.

[ View Attendance ]
```

Do not show a second Save button.

------------------------------------------------------------------------

# 61. Out of Scope

The MVP must not introduce:

``` text
Theory Attendance
Student Login
Parent Login
Student Portal
Fees
Library
Examination Management
Marks Management
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

These may be considered in future versions but must not interfere with
the core project.

------------------------------------------------------------------------

# 62. Future Expansion

Possible future additions:

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

These are future possibilities, not MVP requirements.

------------------------------------------------------------------------

# 63. Project Boundaries

The project does not attempt to manage:

``` text
Entire College
Entire Student Lifecycle
All Academic Activities
All Faculty Activities
```

It specifically solves:

``` text
Faculty
   +
Practical Attendance
   +
Student Retrieval
   +
Historical Verification
```

------------------------------------------------------------------------

# 64. Main Demo Scenario

The primary demonstration should use:

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

Then demonstrate historical retrieval:

``` text
Attendance History
      ↓
23 September 2026
      ↓
Complete Batch Attendance
```

Then demonstrate student verification:

``` text
Search Student
      ↓
24BT0014
      ↓
Student Snapshot
      ↓
Select Previous Date
      ↓
PRESENT / ABSENT
```

This demonstrates the complete purpose of the system.

------------------------------------------------------------------------

# 65. Project Success Criteria

## UI

The system should provide:

-   Professional faculty-focused interface.
-   Easy navigation.
-   Clear attendance workflow.
-   Responsive design.
-   Useful history and snapshot views.

## Backend

The system should provide:

-   Real Node.js + Express backend.
-   Authentication.
-   Authorization.
-   Validation.
-   Business logic.
-   Transactions.
-   Correct REST API design.
-   Secure password hashing.

## Database

The system should provide:

-   PostgreSQL.
-   Proper relational structure.
-   Foreign keys.
-   Unique constraints.
-   Joins.
-   Aggregations.
-   Transactions.
-   Historical persistence.

## Practical Usefulness

Faculty should be able to:

``` text
Take attendance quickly
Find previous attendance quickly
Check one student's attendance on a specific date
View a batch attendance snapshot
```

------------------------------------------------------------------------

# 66. Non-Functional Requirements

## Performance

-   Attendance interactions should feel immediate.
-   Student lists should load without unnecessary page reloads.
-   Search should respond quickly for the expected demo dataset.
-   SQL queries should retrieve only required records.

## Reliability

-   Attendance submission must be transactional.
-   Duplicate sessions must be prevented.
-   Duplicate attendance must be prevented.
-   Failed submissions must preserve the local draft.

## Security

-   Passwords must be bcrypt-hashed.
-   Sessions must be protected.
-   Protected APIs must require authentication.
-   Faculty authorization must be checked server-side.
-   SQL queries must use parameterized queries.
-   User input must be validated.
-   Sensitive authentication data must not be exposed to the frontend
    unnecessarily.

## Maintainability

-   Keep controllers thin.
-   Keep SQL/database access separate from HTTP handling.
-   Keep business rules in services.
-   Use reusable frontend JavaScript functions.
-   Avoid unnecessary frameworks or abstractions.

------------------------------------------------------------------------

# 67. Database Transaction Requirement

Attendance submission must use a PostgreSQL transaction.

Conceptually:

``` text
BEGIN
   ↓
Validate request
   ↓
Create practical session
   ↓
Insert attendance records
   ↓
COMMIT
```

If any operation fails:

``` text
ROLLBACK
```

The system must never leave a partially created official attendance
session.

------------------------------------------------------------------------

# 68. PostgreSQL as Source of Truth

Completed attendance must always come from PostgreSQL.

The browser may temporarily contain:

``` text
Draft attendance
```

but this is not official data.

Official data exists only after successful database submission.

``` text
Browser Draft
     ↓
Submission
     ↓
Express
     ↓
PostgreSQL Transaction
     ↓
Permanent Attendance
```

------------------------------------------------------------------------

# 69. Definition of Done

The MVP is complete only when the following flow works end-to-end:

``` text
Faculty Setup
      ↓
Login
      ↓
Faculty Assignment Loading
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
Attendance History
      ↓
Date-Specific View
      ↓
Student Snapshot
      ↓
Batch Snapshot
```

Every major feature must use real backend/database data.

A page containing only hardcoded demo data is not considered complete.

------------------------------------------------------------------------

# 70. Final Product Definition

The final product is:

> **A practical attendance productivity system for Sipna College of
> Engineering and Technology that replaces rough/manual practical
> attendance records with a searchable, persistent, faculty-specific
> PostgreSQL-backed system.**

The most important outcome is:

``` text
Faculty can take attendance quickly
        +
Attendance is safely stored
        +
Faculty can retrieve it later
        +
Faculty can verify any student's attendance by date
        +
Batch attendance can be viewed quickly
```

The project should remain focused on this outcome throughout
implementation.

------------------------------------------------------------------------

# 71. Final Technology Definition

The implementation must use:

``` text
Frontend:
HTML5 + CSS3 + Vanilla JavaScript

Backend:
Node.js + Express.js

Database:
PostgreSQL

Database Access:
pg

Authentication:
bcrypt + express-session

Architecture:
Modular Monolith
```

The following are explicitly not part of the implementation stack:

``` text
React
Vite
Tailwind CSS
Java
Spring Boot
Spring Data JPA
Hibernate
Microservices
```

The system should remain simple, relational, understandable, and
suitable for demonstrating core DBMS concepts.
