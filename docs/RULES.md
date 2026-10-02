# RULES.md

# Sipna Practical Attendance & Student Management System

## 1. Purpose

This document defines the implementation rules for the project.

These rules are mandatory unless a later project decision explicitly
changes them.

The project must remain:

-   Simple
-   Understandable
-   Relational
-   Secure
-   Maintainable
-   Faculty-focused
-   Suitable for a DBMS academic demonstration

------------------------------------------------------------------------

# 2. Core Product Rule

The project is primarily a **practical attendance system**.

Do not allow unrelated features to change the scope of the MVP.

The core workflow is:

``` text
Faculty Login
→ My Practicals
→ Subject
→ Division
→ Batch
→ Students
→ Attendance
→ Save
→ History
→ Student / Batch Snapshot
```

------------------------------------------------------------------------

# 3. Technology Stack Rules

The implementation must use:

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
```

Do not introduce unnecessary frameworks or infrastructure.

------------------------------------------------------------------------

# 4. Explicitly Prohibited Technologies

The MVP must not use:

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

Do not replace the simple stack with a more complex stack without an
explicit project requirement.

------------------------------------------------------------------------

# 5. Architecture Rule

Use a simple modular monolith.

Preferred flow:

``` text
Browser
 ↓
Express Route
 ↓
Controller
 ↓
Service
 ↓
Repository / SQL
 ↓
PostgreSQL
```

Do not create unnecessary enterprise layers such as:

``` text
Controller
→ Service
→ Manager
→ Repository
→ DAO
→ Mapper
→ DTO
→ Factory
→ Adapter
```

Only create a layer when it has a clear responsibility.

------------------------------------------------------------------------

# 6. Database Rule

PostgreSQL is the **source of truth**.

Official application data must be stored in PostgreSQL.

This includes:

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

Browser storage may contain temporary attendance drafts only.

------------------------------------------------------------------------

# 7. DBMS Demonstration Rule

The project must genuinely demonstrate DBMS concepts.

Required concepts:

``` text
Primary Keys
Foreign Keys
Unique Constraints
Check Constraints
Normalization
Relationships
Joins
Filtering
Aggregation
Transactions
CRUD
Indexes where useful
```

Do not create a fake database layer or hardcode database results in the
frontend.

------------------------------------------------------------------------

# 8. SQL Rule

Use PostgreSQL SQL directly through `pg`.

Parameterized queries are mandatory.

Correct:

``` javascript
pool.query(
    'SELECT * FROM student WHERE bt_id = $1',
    [btId]
);
```

Do not construct SQL using direct user-input string concatenation.

Incorrect:

``` javascript
`SELECT * FROM student WHERE bt_id = '${btId}'`
```

------------------------------------------------------------------------

# 9. Faculty Rule

Faculty is the primary user.

Faculty may:

-   Log in.
-   View their profile.
-   View assigned practicals.
-   Open assigned batches.
-   Load students.
-   Mark attendance.
-   Submit attendance.
-   View previous attendance.
-   Search students.
-   View student snapshots.
-   View batch snapshots.

------------------------------------------------------------------------

# 10. Multiple Assignment Rule

One faculty member may have multiple assignments.

A faculty member may be assigned to:

``` text
Multiple Subjects
Multiple Divisions
Multiple Batches
```

Example:

``` text
Faculty A
├── DBMS → CS-B → A1
├── DBMS → CS-B → B2
└── C-Skill 4 → CS-C → C3
```

The data model and UI must support this.

Do not assume one faculty = one division.

------------------------------------------------------------------------

# 11. Faculty Assignment Rule

Access is determined by:

``` text
Faculty
+
Subject
+
Division
+
Batch
```

A faculty member can access a practical only if a corresponding
assignment exists.

The backend must enforce this rule.

------------------------------------------------------------------------

# 12. Authorization Rule

Frontend filtering is not authorization.

Even if the frontend hides an assignment, the backend must independently
verify access.

For protected operations:

``` text
Authenticate Faculty
        ↓
Verify Faculty Assignment
        ↓
Allow Request
```

Otherwise:

``` text
403 Forbidden
```

------------------------------------------------------------------------

# 13. Academic Structure Rule

Current divisions:

``` text
CS-B
CS-B
CS-C
```

Each division has exactly three practical batches in the current
prototype:

``` text
CS-B → A1, A2, A3
CS-B → B1, B2, B3
CS-C → C1, C2, C3
```

Do not hardcode these values throughout the frontend.

They should be represented by database records.

------------------------------------------------------------------------

# 14. Subject Rule

Current practical subjects:

``` text
DBMS
C-Skill 4
C-Skill 5
```

Each current subject is:

``` text
PRACTICAL
```

Practical subjects must remain separate in attendance calculations.

------------------------------------------------------------------------

# 15. Course Rule

Do not introduce a `Course` entity unless the project requirements
explicitly change.

The current model does not require a separate Course table.

------------------------------------------------------------------------

# 16. Semester Rule

Semester remains part of the academic model.

Semester information may exist in:

``` text
Subject
Division
Student
```

where appropriate.

------------------------------------------------------------------------

# 17. Faculty Account Rule

Faculty setup must support:

``` text
Faculty ID
Faculty Code
Name
Email
Department
Designation
Password
```

Required uniqueness:

``` text
Faculty ID
Faculty Code
Email
```

Passwords must never be stored as plaintext.

------------------------------------------------------------------------

# 18. Password Rule

Use bcrypt for password hashing.

Correct conceptual flow:

``` text
Password
 ↓
bcrypt.hash()
 ↓
password_hash
 ↓
PostgreSQL
```

Login:

``` text
Password
 ↓
bcrypt.compare()
 ↓
Authentication
```

Never store or log plaintext passwords.

------------------------------------------------------------------------

# 19. Session Rule

Use simple session-based authentication.

The browser receives an authenticated session.

Protected APIs must verify the session before executing protected
operations.

Do not expose:

``` text
Database password
Session secret
Faculty password
```

to browser JavaScript.

------------------------------------------------------------------------

# 20. Attendance Rule

Attendance is the core feature.

Attendance is recorded for:

``` text
Subject
+
Division
+
Batch
+
Date
```

This combination identifies one practical attendance session.

------------------------------------------------------------------------

# 21. Attendance Date Rule

Faculty must not manually enter the current attendance date.

The backend determines the authoritative date.

Normal attendance creation must use the current date determined by the
server/application backend.

Historical dates are used only for viewing previous attendance.

------------------------------------------------------------------------

# 22. Historical Date Rule

Historical attendance must be retrievable by date.

Faculty must be able to select a previous session and view its complete
attendance.

Historical attendance is read-only.

------------------------------------------------------------------------

# 23. Attendance Status Rule

Only two statuses are allowed:

``` text
PRESENT
ABSENT
```

Do not introduce:

``` text
LATE
EXCUSED
LEAVE
HALF_DAY
```

unless the product requirements are explicitly changed.

------------------------------------------------------------------------

# 24. Default Attendance Rule

When a batch is loaded:

``` text
All students = ABSENT
```

Faculty marks students as:

``` text
PRESENT
```

This is the required attendance interaction model.

------------------------------------------------------------------------

# 25. Student Loading Rule

Faculty must not manually enter students during attendance.

Students must be loaded automatically from:

``` text
Selected Batch
```

The backend must validate that the returned students actually belong to
that batch.

------------------------------------------------------------------------

# 26. Student Membership Rule

For an attendance submission:

``` text
Student
must belong to
Selected Batch
```

If a student does not belong to the selected batch, the backend must
reject the invalid attendance record.

------------------------------------------------------------------------

# 27. Practical Session Uniqueness Rule

The database must prevent duplicate practical sessions.

Required uniqueness:

``` text
(subject_id, division_id, batch_id, session_date)
```

There must not be two official attendance sessions for the same
practical context on the same date.

------------------------------------------------------------------------

# 28. Attendance Record Uniqueness Rule

A student can have only one attendance record within one practical
session.

Required uniqueness:

``` text
(session_id, student_id)
```

------------------------------------------------------------------------

# 29. Attendance Transaction Rule

Attendance submission must be atomic.

Required conceptual flow:

``` text
BEGIN
 ↓
Create PracticalSession
 ↓
Create Attendance Records
 ↓
COMMIT
```

If anything fails:

``` text
ROLLBACK
```

Never leave a partial official attendance session in the database.

------------------------------------------------------------------------

# 30. Attendance Submission Validation Rule

Before inserting attendance, the backend must verify:

``` text
Faculty is authenticated
Faculty has the assignment
Subject exists
Division exists
Batch exists
Batch belongs to division
Students exist
Students belong to selected batch
Attendance statuses are valid
Current session does not already exist
```

Only then should the transaction be committed.

------------------------------------------------------------------------

# 31. Completed Attendance Rule

After successful submission:

``` text
COMPLETED
```

Attendance becomes read-only.

The MVP must not provide normal editing of completed attendance.

Do not expose a normal update endpoint for completed attendance.

------------------------------------------------------------------------

# 32. Duplicate Submission Rule

If attendance already exists for:

``` text
Subject
+
Division
+
Batch
+
Current Date
```

the system must not create another session.

The faculty should be shown a clear message and allowed to view the
existing attendance.

------------------------------------------------------------------------

# 33. Attendance Draft Rule

Temporary attendance drafts may be stored in browser storage.

A draft is:

``` text
Temporary
Unofficial
Recoverable
```

A draft is not a PostgreSQL attendance record.

------------------------------------------------------------------------

# 34. Draft Recovery Rule

If an attendance draft exists:

``` text
Draft Found
```

The faculty may:

``` text
Restore Draft
Discard Draft
```

The system should preserve the draft if submission fails.

------------------------------------------------------------------------

# 35. Draft Cleanup Rule

After successful attendance submission:

``` text
Delete local draft
```

Do not delete the draft before the backend confirms successful
submission.

------------------------------------------------------------------------

# 36. PostgreSQL Source-of-Truth Rule

After successful submission:

``` text
PostgreSQL = Official Attendance
```

Never treat:

``` text
localStorage
frontend state
browser cache
```

as the official attendance record.

------------------------------------------------------------------------

# 37. Attendance History Rule

History must be scoped by:

``` text
Subject
Division
Batch
```

Do not combine different practical subjects into one attendance history.

Example:

``` text
DBMS → CS-B → B2
```

must remain separate from:

``` text
C-Skill 4 → CS-B → B2
```

------------------------------------------------------------------------

# 38. Student Snapshot Rule

A student snapshot must show:

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

The snapshot must preserve practical context.

------------------------------------------------------------------------

# 39. Student Date Verification Rule

The system must allow faculty to answer:

``` text
Was this student present on this date?
```

The answer must come from stored attendance records.

Do not infer historical attendance from current state.

------------------------------------------------------------------------

# 40. Attendance Percentage Rule

Attendance percentage must be derived.

Formula:

``` text
Present Sessions
--------------------- × 100
Total Sessions
```

Do not manually maintain attendance percentages in the student master
record.

------------------------------------------------------------------------

# 41. Batch Snapshot Rule

Batch snapshot must be scoped to:

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

Do not mix different practical subjects.

------------------------------------------------------------------------

# 42. Student Master Data Rule

Student master data contains:

``` text
BT ID
Name
Semester
Division
Batch
```

BT ID must be unique.

Faculty should not have unrestricted access to modify student master
data.

------------------------------------------------------------------------

# 43. Database Entity Rule

The core database entities are:

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

Do not add unnecessary entities.

------------------------------------------------------------------------

# 44. Foreign Key Rule

Relationships must use foreign keys.

Examples:

``` text
FacultyAssignment.faculty_id
    → Faculty.faculty_id

FacultyAssignment.subject_id
    → Subject.subject_id

FacultyAssignment.division_id
    → Division.division_id

FacultyAssignment.batch_id
    → Batch.batch_id

Batch.division_id
    → Division.division_id

Student.division_id
    → Division.division_id

Student.batch_id
    → Batch.batch_id

PracticalSession.subject_id
    → Subject.subject_id

PracticalSession.division_id
    → Division.division_id

PracticalSession.batch_id
    → Batch.batch_id

Attendance.session_id
    → PracticalSession.session_id

Attendance.student_id
    → Student.student_id
```

------------------------------------------------------------------------

# 45. Constraint Rule

Use database constraints wherever appropriate.

Required examples:

``` text
PRIMARY KEY
FOREIGN KEY
UNIQUE
CHECK
```

Important constraints:

``` text
Faculty email UNIQUE
Faculty code UNIQUE
Student BT ID UNIQUE
Session context UNIQUE
Attendance session/student UNIQUE
Attendance status CHECK
```

------------------------------------------------------------------------

# 46. Normalization Rule

Avoid unnecessary data duplication.

Do not store repeatedly:

``` text
Subject Name
Division Name
Batch Name
Student Name
```

inside attendance records when these can be obtained through
relationships.

Attendance should reference the appropriate entities.

------------------------------------------------------------------------

# 47. Query Rule

Use SQL to demonstrate relational operations.

Important operations include:

``` text
JOIN
WHERE
GROUP BY
COUNT
AVG
ORDER BY
```

Use the simplest query that correctly solves the requirement.

------------------------------------------------------------------------

# 48. Aggregation Rule

Attendance statistics should be calculated from attendance/session
records.

Examples:

``` text
COUNT(PRESENT)
COUNT(ABSENT)
COUNT(TOTAL)
AVG(ATTENDANCE_PERCENTAGE)
```

Do not create redundant manually maintained counters unless required for
performance.

------------------------------------------------------------------------

# 49. API Rule

APIs must follow a clear REST-style structure.

Examples:

``` text
POST /api/auth/login
GET  /api/faculty/me
GET  /api/faculty/me/assignments
GET  /api/batches/:batchId/students
POST /api/attendance
GET  /api/attendance/history
GET  /api/attendance/:sessionId
```

Exact endpoint names may evolve, but responsibilities must remain clear.

------------------------------------------------------------------------

# 50. HTTP Status Rule

Use meaningful HTTP status codes.

``` text
200 → Successful request
201 → Resource created
400 → Invalid request
401 → Not authenticated
403 → Not authorized
404 → Resource not found
409 → Conflict / duplicate
500 → Server error
```

Do not return `200` for every type of failure.

------------------------------------------------------------------------

# 51. Error Message Rule

Errors must be understandable to faculty.

Bad:

``` text
SQLSTATE 23505
```

Better:

``` text
Today's attendance has already been submitted for this practical.
```

Technical details may be logged on the server but should not be
unnecessarily exposed to the user.

------------------------------------------------------------------------

# 52. Frontend Rule

The frontend uses:

``` text
HTML
CSS
Vanilla JavaScript
```

Do not introduce a frontend framework.

The frontend must communicate with the backend using HTTP requests.

------------------------------------------------------------------------

# 53. Frontend Security Rule

Never put:

``` text
Database credentials
Database connection strings
Session secrets
Server-only secrets
```

inside frontend JavaScript.

The browser communicates only with the backend API.

------------------------------------------------------------------------

# 54. Backend Business Logic Rule

Business rules must be enforced on the backend.

Examples:

``` text
Faculty assignment
Student batch membership
Current attendance date
Duplicate attendance
Attendance immutability
```

Do not rely only on JavaScript validation.

------------------------------------------------------------------------

# 55. Frontend Validation Rule

Frontend validation is for usability.

Backend validation is for correctness and security.

Both may exist, but backend validation is mandatory.

------------------------------------------------------------------------

# 56. UI Context Rule

Attendance-related pages must clearly display:

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

The faculty should always know which attendance context is active.

------------------------------------------------------------------------

# 57. Navigation Rule

Primary navigation should remain limited to:

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

Do not add unused navigation items.

------------------------------------------------------------------------

# 58. Dashboard Rule

The dashboard is an entry point.

Do not turn it into a complex analytics dashboard.

It may show:

``` text
Faculty Name
Today's Date
My Practicals
Recent Attendance
```

------------------------------------------------------------------------

# 59. Attendance UI Rule

The attendance screen must prioritize:

``` text
Student List
Attendance Status
Search
Summary
Save
```

Avoid unnecessary controls.

------------------------------------------------------------------------

# 60. Attendance Interaction Rule

The normal interaction is:

``` text
ABSENT
   ↓ click
PRESENT
   ↓ click
ABSENT
```

The interface should update counts immediately.

------------------------------------------------------------------------

# 61. Search Rule

Student search must support:

``` text
BT ID
Name
```

Attendance-page search is restricted to the current batch.

------------------------------------------------------------------------

# 62. History UI Rule

Historical attendance must be clearly read-only.

Do not show:

``` text
Edit
Save Changes
Update
```

on completed historical sessions.

------------------------------------------------------------------------

# 63. Loading State Rule

Major data-loading operations must show a loading state.

Examples:

``` text
Loading practicals...
Loading students...
Loading attendance history...
```

Do not leave the user uncertain whether an operation is running.

------------------------------------------------------------------------

# 64. Empty State Rule

Empty data must have a meaningful message.

Example:

``` text
No practical assignments found.
```

Do not display a blank screen without explanation.

------------------------------------------------------------------------

# 65. Success State Rule

Successful actions must provide clear feedback.

Example:

``` text
Attendance submitted successfully.
```

Avoid unnecessary full-screen success modals.

------------------------------------------------------------------------

# 66. Responsive Rule

The UI must work on:

``` text
Desktop
Tablet
Mobile
```

Desktop is the primary target.

Mobile should remain usable, especially for:

``` text
Viewing
Searching
Marking attendance
```

------------------------------------------------------------------------

# 67. Accessibility Rule

Use:

-   Semantic HTML.
-   Visible form labels.
-   Keyboard-accessible controls.
-   Focus states.
-   Adequate contrast.
-   Text-based status indicators.

Do not use color as the only way to communicate status.

------------------------------------------------------------------------

# 68. Design Complexity Rule

Do not add:

``` text
Large hero sections
Excessive animations
Decorative charts
Unnecessary modals
Complex dashboards
Unrelated widgets
```

The interface should prioritize faculty productivity.

------------------------------------------------------------------------

# 69. Data Integrity Rule

The database must remain authoritative for:

``` text
Faculty
Assignments
Students
Sessions
Attendance
History
```

Never create a second unofficial database inside the frontend.

------------------------------------------------------------------------

# 70. Demo Data Rule

Demo data should be initialized through controlled seed data.

Recommended entities:

``` text
Faculty
Subjects
Divisions
Batches
Students
Faculty Assignments
```

The demo data must represent valid foreign-key relationships.

------------------------------------------------------------------------

# 71. Seed Data Rule

`seed.sql` should not insert invalid relationships.

For example:

``` text
FacultyAssignment
```

must reference existing:

``` text
Faculty
Subject
Division
Batch
```

Students must reference valid:

``` text
Division
Batch
```

------------------------------------------------------------------------

# 72. Environment Variable Rule

Sensitive configuration belongs in `.env`.

Examples:

``` text
PORT
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
SESSION_SECRET
```

`.env` must not be committed to Git.

Provide:

``` text
.env.example
```

instead.

------------------------------------------------------------------------

# 73. Logging Rule

Useful server logs are allowed.

Do not log:

``` text
Passwords
Database passwords
Session secrets
Sensitive authentication data
```

------------------------------------------------------------------------

# 74. Performance Rule

Keep queries simple and targeted.

Do not retrieve unnecessary data.

Examples:

``` text
Selected batch → selected students
Selected practical → selected history
Selected student → relevant attendance
```

Do not load the entire college database for every page.

------------------------------------------------------------------------

# 75. Index Rule

Use indexes where they support actual queries.

Potential indexes include:

``` text
faculty.email
faculty.faculty_code
student.bt_id
student.name
student.batch_id
attendance.session_id
attendance.student_id
practical_session.session_date
```

Avoid unnecessary indexes.

------------------------------------------------------------------------

# 76. Code Quality Rule

Code should be:

``` text
Readable
Consistent
Small where possible
Easy to debug
Easy to demonstrate
```

Avoid clever code when simple code is clearer.

------------------------------------------------------------------------

# 77. Abstraction Rule

Do not abstract code just because abstraction is possible.

Create reusable functions/modules when:

``` text
The logic is repeated
The responsibility is clear
The abstraction improves maintainability
```

Avoid abstraction for its own sake.

------------------------------------------------------------------------

# 78. Naming Rule

Use clear names.

Good:

``` text
facultyAssignment
attendanceSession
studentId
batchId
submitAttendance
getStudentHistory
```

Avoid vague names:

``` text
data
temp
thing
obj
x
```

for important business logic.

------------------------------------------------------------------------

# 79. File Responsibility Rule

Each backend file should have a clear responsibility.

Example:

``` text
attendance.controller.js
```

handles HTTP concerns.

``` text
attendance.service.js
```

handles attendance business logic.

``` text
attendance.repository.js
```

handles attendance SQL.

Do not put the entire application into one giant file unless the
implementation remains genuinely small and readable.

------------------------------------------------------------------------

# 80. API Response Rule

Responses should have a predictable structure.

Example success:

``` json
{
  "success": true,
  "data": {}
}
```

Example error:

``` json
{
  "success": false,
  "error": {
    "message": "Attendance already submitted."
  }
}
```

The exact structure may evolve, but consistency must be maintained.

------------------------------------------------------------------------

# 81. Attendance API Rule

The attendance API must not trust the frontend for:

``` text
Current date
Faculty authorization
Student membership
Duplicate prevention
Attendance integrity
```

The backend must determine and validate these.

------------------------------------------------------------------------

# 82. Historical API Rule

Historical attendance endpoints must verify that the requesting faculty
is authorized to view the requested practical.

Do not allow arbitrary session IDs to expose attendance to unauthorized
faculty.

------------------------------------------------------------------------

# 83. Student Snapshot Authorization Rule

Student snapshots must respect faculty access.

A faculty member should not gain unrestricted access to attendance data
outside their authorized practical context.

------------------------------------------------------------------------

# 84. Batch Snapshot Authorization Rule

Batch snapshots must verify:

``` text
Authenticated Faculty
+
Assigned Subject
+
Assigned Division
+
Assigned Batch
```

before returning attendance data.

------------------------------------------------------------------------

# 85. Practical Separation Rule

Never calculate one practical's attendance using another practical's
records.

For example:

``` text
DBMS attendance
```

must not include:

``` text
C-Skill 4
C-Skill 5
```

records.

------------------------------------------------------------------------

# 86. Historical Integrity Rule

Once attendance is submitted, its historical meaning must remain stable.

Do not allow ordinary workflows to silently:

``` text
Change session date
Change subject
Change division
Change batch
Change student
Change attendance status
```

for completed attendance.

------------------------------------------------------------------------

# 87. Student Identity Rule

BT ID is the student's unique academic identifier within the system.

It must be unique.

Do not use student name as the primary identifier.

------------------------------------------------------------------------

# 88. Batch Relationship Rule

A student belongs to a batch.

The batch belongs to a division.

Therefore:

``` text
Student
 → Batch
 → Division
```

must remain consistent.

The application must not allow contradictory relationships.

------------------------------------------------------------------------

# 89. Faculty Assignment Integrity Rule

A faculty assignment must reference valid:

``` text
Faculty
Subject
Division
Batch
```

The system should prevent invalid assignment combinations.

------------------------------------------------------------------------

# 90. Current Attendance Rule

For normal attendance creation:

``` text
One Faculty
+
One Assigned Practical
+
One Batch
+
Current Date
```

produces one attendance session.

------------------------------------------------------------------------

# 91. Out-of-Scope Rule

Do not implement the following in the MVP:

``` text
Theory Attendance
Student Login
Parent Login
Fees
Library
Exams
Marks
Payroll
Faculty Leave
Timetable
AI
Chatbot
Face Recognition
Biometric Attendance
GPS
QR Attendance
Mobile App
Advanced ERP
```

------------------------------------------------------------------------

# 92. Future Feature Rule

Future features may be considered later:

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

They must not interfere with the MVP.

------------------------------------------------------------------------

# 93. Change Management Rule

Before introducing a new feature, verify:

``` text
Does it solve a current project requirement?
Does it improve faculty workflow?
Does it require a new database entity?
Does it increase complexity unnecessarily?
Does it affect existing attendance integrity?
```

If a feature adds complexity without solving a real requirement, do not
add it.

------------------------------------------------------------------------

# 94. Scope Protection Rule

The project should remain a:

> Practical attendance productivity system.

Do not gradually transform it into a full college ERP.

------------------------------------------------------------------------

# 95. Final Mandatory Rules

The following rules are non-negotiable for the current MVP:

``` text
1. Practical attendance is the core feature.

2. PostgreSQL is the source of truth.

3. Use HTML + CSS + Vanilla JavaScript.

4. Use Node.js + Express.js.

5. Use PostgreSQL through pg.

6. Do not use Java.

7. Do not use Spring Boot.

8. Do not use React.

9. Do not use TypeScript.

10. Do not use Tailwind CSS.

11. Faculty can have multiple assignments.

12. Faculty can have multiple divisions/batches.

13. Backend authorization is mandatory.

14. Current subjects are DBMS, C-Skill 4, and C-Skill 5.

15. Current divisions are CS-B, CS-B, and CS-C.

16. Each division has three practical batches.

17. Course is not required.

18. Semester remains part of the model.

19. Attendance has only PRESENT and ABSENT.

20. All students default to ABSENT.

21. Faculty marks PRESENT students.

22. Backend determines the current attendance date.

23. Historical dates are for viewing previous attendance.

24. Session uniqueness is Subject + Division + Batch + Date.

25. Attendance uniqueness is Session + Student.

26. Attendance submission must use a database transaction.

27. Failed submission must roll back.

28. Completed attendance is read-only.

29. Temporary drafts may exist in browser storage.

30. PostgreSQL remains the official attendance source.

31. Student attendance percentage is derived from records.

32. Practical subjects remain separate.

33. Faculty does not have unrestricted student master-data CRUD.

34. SQL must be parameterized.

35. Passwords must be hashed.

36. Database constraints must enforce integrity.

37. Historical attendance must be retrievable.

38. Student attendance must be verifiable by date.

39. Batch attendance snapshots must remain practical-specific.

40. The project must remain simple and DBMS-focused.
```
