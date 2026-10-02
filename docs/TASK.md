# TASK.md

# Sipna Practical Attendance & Student Management System

## 1. Purpose

This document defines the implementation tasks required to build the
MVP.

Tasks should be completed in order where dependencies exist.

The implementation must follow:

-   `PRD.md`
-   `ARCHITECTURE.md`
-   `DESIGN.md`
-   `MEMORY.md`
-   `RULES.md`

The project must use:

``` text
HTML5
CSS3
Vanilla JavaScript
Node.js
Express.js
PostgreSQL
pg
bcrypt
express-session
```

Do not introduce Java, Spring Boot, React, TypeScript, Tailwind CSS,
microservices, or other unnecessary complexity.

------------------------------------------------------------------------

# 2. Implementation Strategy

Build the project in the following order:

``` text
P0 → Project Setup
P1 → Database
P2 → Backend Foundation
P3 → Authentication
P4 → Academic Data
P5 → Faculty Assignments
P6 → Attendance
P7 → History
P8 → Student & Batch Snapshots
P9 → Frontend Polish
P10 → Security & Validation
P11 → Testing
P12 → Demo Readiness
```

Do not begin advanced UI polish before the core database and attendance
workflow works.

------------------------------------------------------------------------

# P0 --- Project Setup

## P0.1 Create Repository

Create:

``` text
sipna-practical-attendance/
```

### Tasks

-   [ ] Initialize Git repository.
-   [ ] Create `README.md`.
-   [ ] Create `.gitignore`.
-   [ ] Create `.env.example`.
-   [ ] Create `package.json`.
-   [ ] Create `public/`.
-   [ ] Create `server/`.
-   [ ] Create required backend directories.

------------------------------------------------------------------------

## P0.2 Initialize Node.js

### Tasks

-   [ ] Initialize Node.js project.
-   [ ] Install Express.
-   [ ] Install `pg`.
-   [ ] Install `bcrypt`.
-   [ ] Install `express-session`.
-   [ ] Install required development dependency only if genuinely
    useful.
-   [ ] Create basic Express server.
-   [ ] Verify server starts successfully.

Expected:

``` text
npm install
npm start
```

------------------------------------------------------------------------

## P0.3 Basic Express Configuration

### Tasks

-   [ ] Configure JSON request parsing.
-   [ ] Configure URL-encoded parsing if required.
-   [ ] Configure static frontend serving.
-   [ ] Configure environment variables.
-   [ ] Configure session middleware.
-   [ ] Add centralized error middleware.
-   [ ] Add basic health endpoint.

Example:

``` text
GET /api/health
```

Expected:

``` json
{
  "success": true
}
```

------------------------------------------------------------------------

# P1 --- PostgreSQL Database

## P1.1 Create Database

Create PostgreSQL database:

``` text
sipna_attendance
```

### Tasks

-   [ ] Create database.
-   [ ] Configure database connection.
-   [ ] Verify Node.js can connect to PostgreSQL.
-   [ ] Add connection pool using `pg`.

------------------------------------------------------------------------

## P1.2 Create Schema

Create:

``` text
server/db/schema.sql
```

Tables:

``` text
faculty
faculty_assignment
subject
division
batch
student
practical_session
attendance
```

### Tasks

-   [ ] Create Faculty table.
-   [ ] Create FacultyAssignment table.
-   [ ] Create Subject table.
-   [ ] Create Division table.
-   [ ] Create Batch table.
-   [ ] Create Student table.
-   [ ] Create PracticalSession table.
-   [ ] Create Attendance table.

------------------------------------------------------------------------

## P1.3 Database Constraints

### Tasks

-   [ ] Add primary keys.
-   [ ] Add foreign keys.
-   [ ] Add unique Faculty email.
-   [ ] Add unique Faculty code.
-   [ ] Add unique Student BT ID.
-   [ ] Add unique FacultyAssignment combination.
-   [ ] Add unique PracticalSession combination.
-   [ ] Add unique Attendance session/student combination.
-   [ ] Add attendance status check constraint.
-   [ ] Verify all constraints manually.

Required session uniqueness:

``` text
subject_id
division_id
batch_id
session_date
```

Required attendance uniqueness:

``` text
session_id
student_id
```

------------------------------------------------------------------------

## P1.4 Database Indexes

Add useful indexes only.

### Tasks

-   [ ] Index Faculty email.
-   [ ] Index Faculty code.
-   [ ] Index Student BT ID.
-   [ ] Index Student batch.
-   [ ] Index Student name if needed.
-   [ ] Index Attendance session.
-   [ ] Index Attendance student.
-   [ ] Index PracticalSession date if needed.

------------------------------------------------------------------------

## P1.5 Seed Data

Create:

``` text
server/db/seed.sql
```

### Seed:

``` text
Divisions
Batches
Subjects
Faculty
Faculty Assignments
Students
```

### Tasks

-   [ ] Insert CS-B.
-   [ ] Insert CS-B.
-   [ ] Insert CS-C.
-   [ ] Insert A1/A2/A3.
-   [ ] Insert B1/B2/B3.
-   [ ] Insert C1/C2/C3.
-   [ ] Insert DBMS.
-   [ ] Insert C-Skill 4.
-   [ ] Insert C-Skill 5.
-   [ ] Insert demo faculty.
-   [ ] Insert faculty assignments.
-   [ ] Insert demo students.
-   [ ] Verify all foreign keys.

------------------------------------------------------------------------

# P2 --- Backend Foundation

## P2.1 Backend Structure

Create:

``` text
server/
├── server.js
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── middleware/
└── db/
```

### Tasks

-   [ ] Create route modules.
-   [ ] Create controller modules.
-   [ ] Create service modules.
-   [ ] Create repository modules.
-   [ ] Create middleware.
-   [ ] Connect all routes from `server.js`.

------------------------------------------------------------------------

## P2.2 Error Handling

### Tasks

-   [ ] Create centralized error middleware.
-   [ ] Return consistent JSON errors.
-   [ ] Use meaningful HTTP status codes.
-   [ ] Prevent raw database errors from unnecessarily reaching users.
-   [ ] Log useful server-side errors.

------------------------------------------------------------------------

## P2.3 API Response Structure

Use a consistent structure.

Success:

``` json
{
  "success": true,
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "error": {
    "message": "Something went wrong."
  }
}
```

### Tasks

-   [ ] Apply consistent success responses.
-   [ ] Apply consistent error responses.

------------------------------------------------------------------------

# P3 --- Authentication

## P3.1 Faculty Registration

Endpoint:

``` text
POST /api/auth/register
```

### Tasks

-   [ ] Create registration route.
-   [ ] Create registration controller.
-   [ ] Validate required fields.
-   [ ] Check Faculty ID uniqueness.
-   [ ] Check Faculty code uniqueness.
-   [ ] Check email uniqueness.
-   [ ] Hash password using bcrypt.
-   [ ] Insert faculty.
-   [ ] Return success response.

------------------------------------------------------------------------

## P3.2 Faculty Login

Endpoint:

``` text
POST /api/auth/login
```

### Tasks

-   [ ] Find faculty by email.
-   [ ] Compare password using bcrypt.
-   [ ] Create session.
-   [ ] Return authenticated faculty information.
-   [ ] Handle invalid credentials.

------------------------------------------------------------------------

## P3.3 Session

### Tasks

-   [ ] Configure `express-session`.
-   [ ] Store authenticated faculty ID in session.
-   [ ] Create authentication middleware.
-   [ ] Protect private API routes.
-   [ ] Implement logout.
-   [ ] Destroy session during logout.

Endpoint:

``` text
POST /api/auth/logout
```

------------------------------------------------------------------------

## P3.4 Session Check

Endpoint:

``` text
GET /api/auth/session
```

### Tasks

-   [ ] Return current authentication state.
-   [ ] Return faculty identity when authenticated.
-   [ ] Return unauthenticated response otherwise.

------------------------------------------------------------------------

# P4 --- Academic Data APIs

## P4.1 Subjects

Endpoint:

``` text
GET /api/subjects
```

### Tasks

-   [ ] Create subject repository query.
-   [ ] Create subject service.
-   [ ] Create subject controller.
-   [ ] Create subject route.
-   [ ] Return practical subjects.

------------------------------------------------------------------------

## P4.2 Divisions

Endpoint:

``` text
GET /api/divisions
```

### Tasks

-   [ ] Create division query.
-   [ ] Return divisions from PostgreSQL.
-   [ ] Do not hardcode division data in frontend.

------------------------------------------------------------------------

## P4.3 Batches

Endpoint:

``` text
GET /api/divisions/:divisionId/batches
```

### Tasks

-   [ ] Validate division.
-   [ ] Retrieve related batches.
-   [ ] Return batches from PostgreSQL.

------------------------------------------------------------------------

# P5 --- Faculty Assignments

## P5.1 Assignment API

Endpoint:

``` text
GET /api/faculty/me/assignments
```

### Tasks

-   [ ] Authenticate faculty.
-   [ ] Query FacultyAssignment.
-   [ ] Join Subject.
-   [ ] Join Division.
-   [ ] Join Batch.
-   [ ] Return only current faculty assignments.

------------------------------------------------------------------------

## P5.2 Assignment Authorization

Create reusable authorization logic.

### Tasks

-   [ ] Accept faculty ID.
-   [ ] Accept subject ID.
-   [ ] Accept division ID.
-   [ ] Accept batch ID.
-   [ ] Check assignment.
-   [ ] Return authorized/unauthorized result.
-   [ ] Reuse this check for attendance.
-   [ ] Reuse this check for history.
-   [ ] Reuse this check for snapshots.

------------------------------------------------------------------------

# P6 --- Student APIs

## P6.1 Batch Students

Endpoint:

``` text
GET /api/batches/:batchId/students
```

### Tasks

-   [ ] Validate batch.
-   [ ] Retrieve students belonging to batch.
-   [ ] Return BT ID.
-   [ ] Return student name.
-   [ ] Return semester.
-   [ ] Return division.
-   [ ] Return batch.

------------------------------------------------------------------------

## P6.2 Student Search

Endpoint:

``` text
GET /api/students/search
```

### Tasks

-   [ ] Support BT ID search.
-   [ ] Support name search.
-   [ ] Use parameterized SQL.
-   [ ] Return only authorized/relevant student information.

------------------------------------------------------------------------

## P6.3 Student Details

Endpoint:

``` text
GET /api/students/:id
```

### Tasks

-   [ ] Validate student ID.
-   [ ] Retrieve student.
-   [ ] Return student academic information.
-   [ ] Enforce authorization where attendance context is involved.

------------------------------------------------------------------------

# P7 --- Attendance Core

## P7.1 Attendance Page Data

### Tasks

-   [ ] Load faculty assignments.
-   [ ] Select subject.
-   [ ] Select division.
-   [ ] Select batch.
-   [ ] Load students.
-   [ ] Default all students to ABSENT.
-   [ ] Display context.

------------------------------------------------------------------------

## P7.2 Attendance State

Frontend attendance state should contain:

``` text
studentId
status
```

### Tasks

-   [ ] Implement status toggling.
-   [ ] Default status to ABSENT.
-   [ ] Toggle ABSENT → PRESENT.
-   [ ] Toggle PRESENT → ABSENT.
-   [ ] Update present count.
-   [ ] Update absent count.
-   [ ] Update total count.

------------------------------------------------------------------------

## P7.3 Attendance Draft

### Tasks

-   [ ] Store temporary draft in browser storage.
-   [ ] Key draft by practical context.
-   [ ] Restore draft when available.
-   [ ] Allow draft discard.
-   [ ] Preserve draft after failed submission.
-   [ ] Delete draft only after successful submission.

------------------------------------------------------------------------

## P7.4 Attendance Submission API

Endpoint:

``` text
POST /api/attendance
```

### Tasks

-   [ ] Authenticate faculty.
-   [ ] Validate request body.
-   [ ] Verify faculty assignment.
-   [ ] Verify subject.
-   [ ] Verify division.
-   [ ] Verify batch.
-   [ ] Verify batch/division relationship.
-   [ ] Verify every student.
-   [ ] Verify every student belongs to batch.
-   [ ] Validate PRESENT/ABSENT status.
-   [ ] Determine current date on backend.
-   [ ] Check duplicate session.
-   [ ] Begin PostgreSQL transaction.
-   [ ] Insert PracticalSession.
-   [ ] Insert Attendance records.
-   [ ] Commit transaction.
-   [ ] Roll back transaction on failure.
-   [ ] Return created session information.

------------------------------------------------------------------------

## P7.5 Attendance Transaction

Implement:

``` text
BEGIN
 ↓
INSERT PracticalSession
 ↓
INSERT Attendance Records
 ↓
COMMIT
```

Failure:

``` text
ROLLBACK
```

### Tasks

-   [ ] Use one PostgreSQL client for the transaction.
-   [ ] Do not use separate unrelated connections for transaction steps.
-   [ ] Release client after commit/rollback.
-   [ ] Verify rollback behavior manually.

------------------------------------------------------------------------

## P7.6 Duplicate Session Handling

### Tasks

-   [ ] Check for existing session.
-   [ ] Rely on database uniqueness as final protection.
-   [ ] Return HTTP 409 for duplicate submission.
-   [ ] Provide readable frontend message.
-   [ ] Provide option to view existing attendance.

------------------------------------------------------------------------

## P7.7 Completed Attendance

### Tasks

-   [ ] Mark successful session as completed.
-   [ ] Display read-only state.
-   [ ] Remove editing controls.
-   [ ] Do not provide normal update endpoint.
-   [ ] Prevent frontend from resubmitting completed session.

------------------------------------------------------------------------

# P8 --- Attendance History

## P8.1 History API

Endpoint:

``` text
GET /api/attendance/history
```

### Tasks

-   [ ] Accept subject/division/batch context.
-   [ ] Authenticate faculty.
-   [ ] Verify assignment.
-   [ ] Retrieve historical sessions.
-   [ ] Calculate present count.
-   [ ] Calculate absent count.
-   [ ] Return date and summary.

------------------------------------------------------------------------

## P8.2 Historical Session

Endpoint:

``` text
GET /api/attendance/:sessionId
```

### Tasks

-   [ ] Authenticate faculty.
-   [ ] Find session.
-   [ ] Verify faculty authorization.
-   [ ] Retrieve students.
-   [ ] Retrieve attendance.
-   [ ] Return complete read-only snapshot.

------------------------------------------------------------------------

## P8.3 Historical UI

### Tasks

-   [ ] Create history page.
-   [ ] Show Subject.
-   [ ] Show Division.
-   [ ] Show Batch.
-   [ ] Show date.
-   [ ] Show Present count.
-   [ ] Show Absent count.
-   [ ] Add View action.
-   [ ] Make historical records read-only.

------------------------------------------------------------------------

# P9 --- Student Snapshot

## P9.1 Student Snapshot API

Endpoint:

``` text
GET /api/snapshots/student/:studentId
```

### Tasks

-   [ ] Authenticate faculty.
-   [ ] Validate student.
-   [ ] Determine authorized practical context.
-   [ ] Retrieve attendance records.
-   [ ] Count total sessions.
-   [ ] Count present.
-   [ ] Count absent.
-   [ ] Calculate percentage.
-   [ ] Return attendance history.

------------------------------------------------------------------------

## P9.2 Student Snapshot UI

### Tasks

-   [ ] Show BT ID.
-   [ ] Show name.
-   [ ] Show semester.
-   [ ] Show division.
-   [ ] Show batch.
-   [ ] Show practical context.
-   [ ] Show total sessions.
-   [ ] Show present.
-   [ ] Show absent.
-   [ ] Show percentage.
-   [ ] Show date-specific history.

------------------------------------------------------------------------

# P10 --- Batch Snapshot

## P10.1 Batch Snapshot API

Endpoint:

``` text
GET /api/snapshots/batch/:batchId
```

### Tasks

-   [ ] Authenticate faculty.
-   [ ] Verify assignment.
-   [ ] Scope result to subject.
-   [ ] Scope result to division.
-   [ ] Scope result to batch.
-   [ ] Retrieve student attendance.
-   [ ] Calculate total sessions.
-   [ ] Calculate student percentages.
-   [ ] Calculate average attendance.
-   [ ] Return snapshot.

------------------------------------------------------------------------

## P10.2 Batch Snapshot UI

### Tasks

-   [ ] Show subject.
-   [ ] Show division.
-   [ ] Show batch.
-   [ ] Show total students.
-   [ ] Show total sessions.
-   [ ] Show average attendance.
-   [ ] Show student-wise attendance.
-   [ ] Keep practical subjects separate.

------------------------------------------------------------------------

# P11 --- Frontend Foundation

## P11.1 Common Layout

Create:

``` text
Header
Sidebar
Main Content
Breadcrumbs
```

### Tasks

-   [ ] Implement header.
-   [ ] Implement sidebar.
-   [ ] Implement active navigation state.
-   [ ] Implement main content layout.
-   [ ] Implement responsive structure.
-   [ ] Implement faculty identity display.

------------------------------------------------------------------------

## P11.2 Common UI Components

Create reusable patterns for:

``` text
Buttons
Inputs
Cards
Tables
Status Badges
Summary Cards
Toast Messages
Loading States
Empty States
Error States
```

Do not over-engineer these components.

------------------------------------------------------------------------

# P12 --- Login UI

### Tasks

-   [ ] Build login page.
-   [ ] Add email field.
-   [ ] Add password field.
-   [ ] Add login button.
-   [ ] Add validation.
-   [ ] Call login API.
-   [ ] Handle invalid credentials.
-   [ ] Redirect authenticated faculty to dashboard.

------------------------------------------------------------------------

# P13 --- Faculty Setup UI

### Tasks

-   [ ] Build setup page.
-   [ ] Add Faculty ID.
-   [ ] Add Faculty Code.
-   [ ] Add Name.
-   [ ] Add Email.
-   [ ] Add Department.
-   [ ] Add Designation.
-   [ ] Add Password.
-   [ ] Submit registration.
-   [ ] Show validation errors.
-   [ ] Handle duplicate email/code.
-   [ ] Redirect after successful registration.

------------------------------------------------------------------------

# P14 --- Dashboard UI

### Tasks

-   [ ] Show faculty name.
-   [ ] Show current date.
-   [ ] Show My Practicals.
-   [ ] Show recent attendance.
-   [ ] Keep dashboard simple.
-   [ ] Avoid college-wide analytics.

------------------------------------------------------------------------

# P15 --- My Practicals UI

### Tasks

-   [ ] Load assignments from API.
-   [ ] Display subject.
-   [ ] Display division.
-   [ ] Display batch.
-   [ ] Display practical type.
-   [ ] Provide Open Practical action.
-   [ ] Show empty state if no assignments exist.

------------------------------------------------------------------------

# P16 --- Attendance UI

### Tasks

-   [ ] Display breadcrumbs.
-   [ ] Display subject.
-   [ ] Display division.
-   [ ] Display batch.
-   [ ] Display current date.
-   [ ] Load students.
-   [ ] Default all students to ABSENT.
-   [ ] Add search.
-   [ ] Add attendance toggles.
-   [ ] Add summary cards.
-   [ ] Add save button.
-   [ ] Add loading state.
-   [ ] Add submitting state.
-   [ ] Add success state.
-   [ ] Add error state.
-   [ ] Add draft restoration.
-   [ ] Add completed read-only state.
-   [ ] Handle already-submitted state.

------------------------------------------------------------------------

# P17 --- History UI

### Tasks

-   [ ] Build history page.
-   [ ] Display practical context.
-   [ ] Display date list.
-   [ ] Display present count.
-   [ ] Display absent count.
-   [ ] Add View button.
-   [ ] Build historical session page.
-   [ ] Display complete student attendance.
-   [ ] Make historical data read-only.

------------------------------------------------------------------------

# P18 --- Student UI

### Tasks

-   [ ] Build student search page.
-   [ ] Add BT ID search.
-   [ ] Add name search.
-   [ ] Display search results.
-   [ ] Build student snapshot page.
-   [ ] Display student information.
-   [ ] Display attendance summary.
-   [ ] Display attendance percentage.
-   [ ] Display attendance history.
-   [ ] Support date-specific verification.

------------------------------------------------------------------------

# P19 --- Batch Snapshot UI

### Tasks

-   [ ] Build batch snapshot page.
-   [ ] Display practical context.
-   [ ] Display total students.
-   [ ] Display total sessions.
-   [ ] Display average attendance.
-   [ ] Display student-wise attendance.
-   [ ] Keep practical context visible.

------------------------------------------------------------------------

# P20 --- Responsive Design

### Tasks

-   [ ] Test desktop layout.
-   [ ] Test tablet layout.
-   [ ] Test mobile layout.
-   [ ] Make sidebar responsive.
-   [ ] Make summary cards responsive.
-   [ ] Make attendance table usable on mobile.
-   [ ] Make buttons touch-friendly.
-   [ ] Verify no horizontal overflow.

------------------------------------------------------------------------

# P21 --- Accessibility

### Tasks

-   [ ] Use semantic HTML.
-   [ ] Add form labels.
-   [ ] Add keyboard focus states.
-   [ ] Ensure buttons are keyboard accessible.
-   [ ] Ensure attendance status is text-based.
-   [ ] Verify color contrast.
-   [ ] Verify form error visibility.
-   [ ] Verify navigation accessibility.

------------------------------------------------------------------------

# P22 --- Validation & Security

## P22.1 Authentication Security

### Tasks

-   [ ] Hash passwords with bcrypt.
-   [ ] Never store plaintext passwords.
-   [ ] Never expose password hashes to frontend.
-   [ ] Protect private routes.
-   [ ] Destroy sessions on logout.
-   [ ] Store session secret in environment variables.

------------------------------------------------------------------------

## P22.2 Authorization Security

### Tasks

-   [ ] Verify faculty on every protected request.
-   [ ] Verify faculty assignment.
-   [ ] Verify subject/division/batch context.
-   [ ] Verify student membership.
-   [ ] Protect history.
-   [ ] Protect snapshots.

------------------------------------------------------------------------

## P22.3 SQL Security

### Tasks

-   [ ] Use parameterized queries.
-   [ ] Avoid SQL string concatenation with user input.
-   [ ] Validate query parameters.
-   [ ] Validate request body.
-   [ ] Avoid exposing raw SQL errors.

------------------------------------------------------------------------

# P23 --- Error Handling

### Tasks

Handle:

``` text
Invalid Login
Unauthorized Access
Invalid Subject
Invalid Division
Invalid Batch
Invalid Student
Student Not in Batch
Duplicate Session
Duplicate Attendance
Database Failure
Network Failure
```

Every error should have:

``` text
Backend Error
↓
HTTP Status
↓
Readable Message
↓
Frontend Feedback
```

------------------------------------------------------------------------

# P24 --- Database Testing

## P24.1 Constraint Testing

Verify:

-   [ ] Duplicate Faculty email rejected.
-   [ ] Duplicate Faculty code rejected.
-   [ ] Duplicate Student BT ID rejected.
-   [ ] Invalid foreign key rejected.
-   [ ] Duplicate FacultyAssignment rejected.
-   [ ] Duplicate PracticalSession rejected.
-   [ ] Duplicate Attendance rejected.
-   [ ] Invalid attendance status rejected.

------------------------------------------------------------------------

## P24.2 Transaction Testing

Test:

``` text
Session creation succeeds
+
All attendance records succeed
=
COMMIT
```

Then simulate failure:

``` text
Session creation
+
Attendance insert failure
=
ROLLBACK
```

Verify no partial session remains.

------------------------------------------------------------------------

# P25 --- API Testing

Test all major endpoints.

### Authentication

-   [ ] Register.
-   [ ] Login.
-   [ ] Session.
-   [ ] Logout.

### Faculty

-   [ ] Faculty profile.
-   [ ] Faculty assignments.

### Academic

-   [ ] Subjects.
-   [ ] Divisions.
-   [ ] Batches.

### Students

-   [ ] Batch students.
-   [ ] Student search.
-   [ ] Student details.

### Attendance

-   [ ] Create attendance.
-   [ ] History.
-   [ ] Historical session.
-   [ ] Student attendance.

### Snapshots

-   [ ] Student snapshot.
-   [ ] Batch snapshot.

------------------------------------------------------------------------

# P26 --- Authorization Testing

Test:

``` text
Faculty A → Assigned Practical
```

Expected:

``` text
Allowed
```

Test:

``` text
Faculty A → Unassigned Practical
```

Expected:

``` text
403 Forbidden
```

Repeat for:

-   [ ] Attendance creation.
-   [ ] Attendance history.
-   [ ] Historical session.
-   [ ] Student snapshot.
-   [ ] Batch snapshot.

------------------------------------------------------------------------

# P27 --- Attendance Workflow Testing

## Test Case 1 --- Normal Submission

``` text
Faculty
→ DBMS
→ CS-B
→ B2
→ 30 Students
→ Mark 26 Present
→ Save
```

Expected:

``` text
30 Total
26 Present
4 Absent
```

Database should contain:

``` text
1 PracticalSession
30 Attendance records
```

------------------------------------------------------------------------

## Test Case 2 --- Duplicate Submission

Submit the same practical again on the same date.

Expected:

``` text
Conflict
```

No second session should be created.

------------------------------------------------------------------------

## Test Case 3 --- Draft Recovery

``` text
Open Attendance
→ Mark Students
→ Refresh / Interrupt
```

Expected:

``` text
Draft Found
→ Restore Draft
```

------------------------------------------------------------------------

## Test Case 4 --- Failed Submission

Simulate backend/database failure.

Expected:

``` text
Submission Failed
Draft Preserved
```

------------------------------------------------------------------------

## Test Case 5 --- Historical View

``` text
Open History
→ Select 23 September 2026
→ View
```

Expected:

``` text
Complete Read-only Attendance
```

------------------------------------------------------------------------

## Test Case 6 --- Student Verification

``` text
Search 24BT0014
→ Student Snapshot
→ Previous Date
```

Expected:

``` text
Correct PRESENT / ABSENT status
```

------------------------------------------------------------------------

# P28 --- Data Consistency Testing

Verify:

-   [ ] Every student belongs to a valid batch.
-   [ ] Every batch belongs to a valid division.
-   [ ] Every assignment references valid entities.
-   [ ] Every session references valid subject/division/batch.
-   [ ] Every attendance record references valid session/student.
-   [ ] Practical attendance is not mixed between subjects.

------------------------------------------------------------------------

# P29 --- UI/UX Testing

Verify:

-   [ ] Faculty always sees practical context.
-   [ ] Attendance defaults to absent.
-   [ ] Summary counts update immediately.
-   [ ] Save button is disabled during submission.
-   [ ] Completed attendance is read-only.
-   [ ] History is easy to access.
-   [ ] Student search works.
-   [ ] Batch snapshot is readable.
-   [ ] Loading states appear.
-   [ ] Empty states appear.
-   [ ] Errors are understandable.
-   [ ] Responsive layout works.

------------------------------------------------------------------------

# P30 --- Performance Testing

For the expected academic demo dataset:

-   [ ] Student list loads quickly.
-   [ ] Attendance toggle is immediate.
-   [ ] Search is responsive.
-   [ ] History loads quickly.
-   [ ] Snapshot calculations complete quickly.
-   [ ] No unnecessary database queries are executed.

Do not optimize prematurely.

------------------------------------------------------------------------

# P31 --- Final Security Review

Before final demo:

-   [ ] No passwords in source code.
-   [ ] No database password in frontend.
-   [ ] `.env` ignored by Git.
-   [ ] `.env.example` available.
-   [ ] Parameterized SQL used.
-   [ ] Authentication middleware active.
-   [ ] Authorization checks active.
-   [ ] Unauthorized practical access rejected.
-   [ ] Session logout works.
-   [ ] Sensitive information not logged.

------------------------------------------------------------------------

# P32 --- Final Database Review

Verify final schema contains:

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

Verify:

-   [ ] PKs exist.
-   [ ] FKs exist.
-   [ ] Unique constraints exist.
-   [ ] Check constraints exist.
-   [ ] Required indexes exist.
-   [ ] Duplicate session prevention works.
-   [ ] Duplicate attendance prevention works.
-   [ ] Transaction works.

------------------------------------------------------------------------

# P33 --- Final Application Review

Verify complete flow:

``` text
Setup
 ↓
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
Students
 ↓
Attendance
 ↓
Save
 ↓
PostgreSQL
 ↓
History
 ↓
Historical Attendance
 ↓
Student Snapshot
 ↓
Batch Snapshot
```

Every step must use real backend/database data.

------------------------------------------------------------------------

# P34 --- Demo Preparation

Prepare one clean demonstration scenario.

## Demo Faculty

Use one faculty account with multiple assignments.

Example:

``` text
DBMS → CS-B → B2
```

## Demo Batch

``` text
CS-B
B2
```

## Demo Students

``` text
30 students
```

## Demo Attendance

``` text
26 Present
4 Absent
```

------------------------------------------------------------------------

# P35 --- DBMS Demonstration Checklist

During the project presentation, demonstrate:

-   [ ] Primary keys.
-   [ ] Foreign keys.
-   [ ] Unique constraints.
-   [ ] Student-batch relationship.
-   [ ] Batch-division relationship.
-   [ ] Faculty assignment relationship.
-   [ ] Attendance-session relationship.
-   [ ] SQL JOIN.
-   [ ] SQL filtering.
-   [ ] SQL aggregation.
-   [ ] Attendance transaction.
-   [ ] Duplicate prevention.
-   [ ] Historical retrieval.

------------------------------------------------------------------------

# P36 --- Final Project Cleanup

Before final submission:

-   [ ] Remove unused files.
-   [ ] Remove unused packages.
-   [ ] Remove debug logs.
-   [ ] Remove hardcoded production credentials.
-   [ ] Remove dead code.
-   [ ] Verify `.gitignore`.
-   [ ] Verify `.env.example`.
-   [ ] Verify README.
-   [ ] Verify SQL scripts.
-   [ ] Verify all frontend pages.
-   [ ] Verify all APIs.
-   [ ] Verify database schema.
-   [ ] Verify seed data.

------------------------------------------------------------------------

# P37 --- Documentation

README must explain:

``` text
Project Overview
Features
Technology Stack
Requirements
Installation
Environment Variables
Database Setup
Seed Data
Run Commands
API Overview
Project Structure
Demo Workflow
```

Do not document technologies that are not actually used.

------------------------------------------------------------------------

# P38 --- Final Definition of Done

The project is considered complete only when:

``` text
[ ] Faculty can create/login to account.

[ ] Faculty session works.

[ ] Faculty sees only assigned practicals.

[ ] Faculty can select subject/division/batch.

[ ] Students load automatically.

[ ] All students default to ABSENT.

[ ] Faculty can mark PRESENT.

[ ] Summary counts update correctly.

[ ] Attendance submission works.

[ ] Submission uses PostgreSQL transaction.

[ ] Duplicate session is prevented.

[ ] Completed attendance is read-only.

[ ] Historical attendance is available.

[ ] Historical attendance is read-only.

[ ] Student search works.

[ ] Student snapshot works.

[ ] Student date-specific attendance verification works.

[ ] Batch snapshot works.

[ ] Attendance percentage is calculated correctly.

[ ] Practical subjects remain separate.

[ ] Backend authorization works.

[ ] SQL is parameterized.

[ ] Passwords are hashed.

[ ] Database constraints work.

[ ] Responsive UI works.

[ ] Error/loading/empty states work.

[ ] Demo scenario works end-to-end.
```

------------------------------------------------------------------------

# P39 --- Final Implementation Order

The recommended execution order is:

``` text
1. Project Setup
       ↓
2. PostgreSQL Schema
       ↓
3. Seed Data
       ↓
4. Express Server
       ↓
5. Database Connection
       ↓
6. Authentication
       ↓
7. Faculty Assignments
       ↓
8. Academic APIs
       ↓
9. Student APIs
       ↓
10. Attendance Backend
       ↓
11. Attendance Transaction
       ↓
12. Attendance Frontend
       ↓
13. History
       ↓
14. Student Snapshot
       ↓
15. Batch Snapshot
       ↓
16. Responsive UI
       ↓
17. Security
       ↓
18. Testing
       ↓
19. Demo Preparation
       ↓
20. Final Cleanup
```

------------------------------------------------------------------------

# P40 --- Final Project Rule

Do not move to advanced features until the following works reliably:

``` text
Login
 ↓
Assigned Practical
 ↓
Batch
 ↓
Students
 ↓
Attendance
 ↓
PostgreSQL
 ↓
History
```

The core attendance workflow is more important than visual extras.

The final project should remain:

``` text
Simple
Reliable
Relational
Faculty-focused
DBMS-focused
Easy to understand
Easy to demonstrate
```
