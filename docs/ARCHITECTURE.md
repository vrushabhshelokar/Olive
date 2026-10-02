# ARCHITECTURE.md

# Sipna Practical Attendance & Student Management System

## 1. Architecture Overview

The Sipna Practical Attendance & Student Management System is designed
as a simple **modular monolith**.

The architecture intentionally avoids unnecessary frameworks, enterprise
abstractions, microservices, and complex infrastructure.

### Technology Stack

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

### High-Level Architecture

``` text
┌─────────────────────────────────────────────┐
│                 Browser                     │
│                                             │
│       HTML + CSS + Vanilla JavaScript       │
└──────────────────────┬──────────────────────┘
                       │ HTTP / REST
                       ▼
┌─────────────────────────────────────────────┐
│              Node.js Server                 │
│                Express.js                   │
│                                             │
│  Routes → Controllers → Services → DB Layer │
│                                             │
│  Authentication / Authorization / Validation│
└──────────────────────┬──────────────────────┘
                       │ SQL
                       ▼
┌─────────────────────────────────────────────┐
│                 PostgreSQL                  │
│                                             │
│ Faculty                                     │
│ FacultyAssignment                           │
│ Subject                                     │
│ Division                                    │
│ Batch                                       │
│ Student                                     │
│ PracticalSession                            │
│ Attendance                                  │
└─────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 2. Architectural Principles

The project follows these principles:

1.  Keep the stack simple.
2.  Use PostgreSQL as the source of truth.
3.  Keep business logic on the backend.
4.  Enforce authorization on the backend.
5.  Use parameterized SQL.
6.  Use database constraints for data integrity.
7.  Use transactions for attendance submission.
8.  Keep completed attendance read-only.
9.  Avoid unnecessary abstraction.
10. Keep the project understandable for a DBMS academic demonstration.

------------------------------------------------------------------------

# 3. Why a Modular Monolith

The project is small and does not require microservices.

A single Node.js/Express application is sufficient.

``` text
One Application
      │
      ├── Authentication
      ├── Faculty
      ├── Assignments
      ├── Students
      ├── Attendance
      └── Snapshots
              │
              ▼
         PostgreSQL
```

Advantages:

-   Easy to run.
-   Easy to understand.
-   Easy to debug.
-   Easy to demonstrate.
-   Less deployment complexity.
-   Clear database interaction.
-   Suitable for a DBMS academic project.

------------------------------------------------------------------------

# 4. Request Flow

A normal frontend request follows:

``` text
Browser
   ↓
fetch()
   ↓
Express Route
   ↓
Authentication Middleware
   ↓
Controller
   ↓
Service
   ↓
Repository / SQL
   ↓
PostgreSQL
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
JSON Response
   ↓
Browser
```

Example:

``` text
Faculty clicks "Save Attendance"
             ↓
POST /api/attendance
             ↓
Authentication
             ↓
Authorization
             ↓
Attendance Controller
             ↓
Attendance Service
             ↓
PostgreSQL Transaction
             ↓
Session + Attendance Records
             ↓
COMMIT
             ↓
Success Response
```

------------------------------------------------------------------------

# 5. Frontend Architecture

The frontend uses:

``` text
HTML5
CSS3
Vanilla JavaScript
```

No frontend framework is required.

## 5.1 Frontend Responsibilities

The frontend is responsible for:

-   Rendering pages.
-   Collecting user input.
-   Calling REST APIs.
-   Displaying backend data.
-   Managing temporary attendance drafts.
-   Updating attendance counts.
-   Showing loading states.
-   Showing success/error states.
-   Navigating between views.

The frontend must not be responsible for authorization.

------------------------------------------------------------------------

# 6. Frontend Structure

Recommended structure:

``` text
public/
│
├── index.html
├── login.html
├── setup.html
├── dashboard.html
├── practicals.html
├── attendance.html
├── history.html
├── students.html
│
├── css/
│   ├── styles.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
│
└── js/
    ├── app.js
    ├── api.js
    ├── auth.js
    ├── dashboard.js
    ├── practicals.js
    ├── attendance.js
    ├── history.js
    ├── students.js
    ├── snapshots.js
    └── utils.js
```

The structure can be simplified if the implementation does not require
every file.

------------------------------------------------------------------------

# 7. Frontend Module Responsibilities

## `api.js`

Centralizes API calls.

Example:

``` javascript
async function getAssignments() {
    return fetch('/api/faculty/me/assignments');
}
```

It should handle common request behavior.

## `auth.js`

Handles:

-   Login.
-   Logout.
-   Session checking.
-   Authentication-related UI.

## `attendance.js`

Handles:

-   Loading students.
-   Attendance state.
-   Present/absent toggling.
-   Live summary.
-   Draft restoration.
-   Attendance submission.
-   Completed read-only state.

## `history.js`

Handles:

-   Loading attendance history.
-   Selecting dates.
-   Displaying historical attendance.

## `students.js`

Handles:

-   Student search.
-   Student list.
-   Student selection.

## `snapshots.js`

Handles:

-   Student snapshot.
-   Batch snapshot.
-   Attendance calculations returned by the backend.

## `utils.js`

Contains small reusable utilities only.

Avoid turning this into a large generic utility layer.

------------------------------------------------------------------------

# 8. Backend Architecture

The backend uses:

``` text
Node.js
+
Express.js
+
pg
```

The backend is responsible for:

-   Authentication.
-   Authorization.
-   Request validation.
-   Business rules.
-   Database access.
-   Attendance transactions.
-   Historical retrieval.
-   Snapshot calculations.

------------------------------------------------------------------------

# 9. Backend Structure

Recommended structure:

``` text
server/
│
├── server.js
│
├── config/
│   └── env.js
│
├── routes/
│   ├── auth.routes.js
│   ├── faculty.routes.js
│   ├── academic.routes.js
│   ├── student.routes.js
│   └── attendance.routes.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── faculty.controller.js
│   ├── academic.controller.js
│   ├── student.controller.js
│   └── attendance.controller.js
│
├── services/
│   ├── auth.service.js
│   ├── faculty.service.js
│   ├── assignment.service.js
│   ├── student.service.js
│   ├── attendance.service.js
│   └── snapshot.service.js
│
├── repositories/
│   ├── faculty.repository.js
│   ├── assignment.repository.js
│   ├── academic.repository.js
│   ├── student.repository.js
│   └── attendance.repository.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
│
└── db/
    ├── connection.js
    ├── schema.sql
    └── seed.sql
```

This structure is recommended rather than mandatory.

The implementation should not create files or layers that have no
meaningful responsibility.

------------------------------------------------------------------------

# 10. Route Layer

Routes define HTTP endpoints.

Example:

``` javascript
router.post(
    '/attendance',
    requireAuth,
    attendanceController.create
);
```

Routes should primarily define:

-   HTTP method.
-   URL.
-   Middleware.
-   Controller.

Business logic should not be placed directly inside route definitions.

------------------------------------------------------------------------

# 11. Controller Layer

Controllers handle HTTP concerns.

Responsibilities:

-   Read request.
-   Validate basic request shape.
-   Call service.
-   Return response.
-   Pass errors to error middleware.

Example conceptual flow:

``` text
Request
  ↓
Controller
  ↓
AttendanceService.createAttendance()
  ↓
Response
```

Controllers should remain thin.

------------------------------------------------------------------------

# 12. Service Layer

Services contain business rules.

Examples:

### Attendance Service

Responsible for:

-   Validating attendance context.
-   Checking faculty assignment.
-   Checking batch membership.
-   Determining current date.
-   Checking duplicate session.
-   Starting transaction.
-   Creating session.
-   Creating attendance records.
-   Committing or rolling back.

### Assignment Service

Responsible for:

-   Loading faculty assignments.
-   Checking whether a faculty member owns a practical assignment.

### Snapshot Service

Responsible for:

-   Student attendance calculations.
-   Batch attendance calculations.
-   Attendance percentages.

------------------------------------------------------------------------

# 13. Repository / Database Layer

Repositories contain PostgreSQL access.

Example:

``` javascript
const result = await pool.query(
    `
    SELECT *
    FROM students
    WHERE batch_id = $1
    `,
    [batchId]
);
```

The project should use parameterized queries.

Do not construct SQL using direct string concatenation of user input.

------------------------------------------------------------------------

# 14. Database Connection

Use the PostgreSQL `pg` package.

Conceptually:

``` text
Express Application
       ↓
pg Pool
       ↓
PostgreSQL
```

A connection pool should be used instead of opening a new database
connection for every query.

Example configuration values:

``` text
DATABASE_URL
or
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

Credentials must be stored in environment variables.

------------------------------------------------------------------------

# 15. Database Architecture

The database is relational and normalized around the main entities:

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

------------------------------------------------------------------------

# 16. Entity Relationship Overview

``` text
                     ┌──────────────┐
                     │   Faculty    │
                     └──────┬───────┘
                            │
                            │
                     ┌──────▼───────────┐
                     │ FacultyAssignment│
                     └───┬────┬────┬────┘
                         │    │    │
                         │    │    │
              ┌──────────┘    │    └──────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐    ┌──────────┐
        │ Subject  │   │ Division │    │  Batch   │
        └──────────┘   └────┬─────┘    └────┬─────┘
                             │               │
                             └───────┬───────┘
                                     ▼
                               ┌──────────┐
                               │ Student  │
                               └────┬─────┘
                                    │
                                    │
                         ┌──────────▼──────────┐
                         │ PracticalSession    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                             ┌───────────┐
                             │ Attendance│
                             └───────────┘
```

------------------------------------------------------------------------

# 17. Faculty Table

Conceptual schema:

``` text
faculty
--------------------------------
faculty_id       PK
faculty_code     UNIQUE
name
email            UNIQUE
department
designation
password_hash
created_at
```

Purpose:

Stores faculty authentication and profile information.

------------------------------------------------------------------------

# 18. FacultyAssignment Table

``` text
faculty_assignment
--------------------------------
assignment_id    PK
faculty_id       FK
subject_id       FK
division_id      FK
batch_id         FK
created_at
```

Purpose:

Defines exactly which practical batches a faculty member can access.

Recommended uniqueness:

``` text
(faculty_id, subject_id, division_id, batch_id)
```

------------------------------------------------------------------------

# 19. Subject Table

``` text
subject
--------------------------------
subject_id       PK
name
code
type
semester
```

Current practical subjects:

``` text
DBMS
C-Skill 4
C-Skill 5
```

------------------------------------------------------------------------

# 20. Division Table

``` text
division
--------------------------------
division_id      PK
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

# 21. Batch Table

``` text
batch
--------------------------------
batch_id         PK
name
division_id      FK
```

Examples:

``` text
A1
A2
A3
B1
B2
B3
C1
C2
C3
```

A batch belongs to one division.

------------------------------------------------------------------------

# 22. Student Table

``` text
student
--------------------------------
student_id       PK
bt_id            UNIQUE
name
semester
division_id      FK
batch_id         FK
created_at
```

The student table stores academic identity and current batch placement.

Attendance information must not be duplicated into the student table.

------------------------------------------------------------------------

# 23. PracticalSession Table

``` text
practical_session
--------------------------------
session_id       PK
subject_id       FK
division_id      FK
batch_id         FK
session_date
description
created_at
```

Required uniqueness:

``` text
(subject_id, division_id, batch_id, session_date)
```

This prevents duplicate practical attendance sessions.

------------------------------------------------------------------------

# 24. Attendance Table

``` text
attendance
--------------------------------
attendance_id    PK
session_id       FK
student_id       FK
status
marked_at
```

Constraints:

``` text
status IN ('PRESENT', 'ABSENT')
```

and:

``` text
(session_id, student_id) UNIQUE
```

This guarantees one attendance record per student per session.

------------------------------------------------------------------------

# 25. Relationship Rules

### Faculty → FacultyAssignment

One faculty can have many assignments.

``` text
Faculty 1 ──── N FacultyAssignment
```

### Subject → FacultyAssignment

One subject can be assigned to many faculty members.

``` text
Subject 1 ──── N FacultyAssignment
```

### Division → Batch

One division has many batches.

``` text
Division 1 ──── N Batch
```

### Batch → Student

One batch has many students.

``` text
Batch 1 ──── N Student
```

### Subject/Division/Batch → PracticalSession

One practical context can have many sessions over different dates.

``` text
Context 1 ──── N PracticalSession
```

### PracticalSession → Attendance

One session has many attendance records.

``` text
PracticalSession 1 ──── N Attendance
```

### Student → Attendance

One student can have many attendance records.

``` text
Student 1 ──── N Attendance
```

------------------------------------------------------------------------

# 26. Authorization Architecture

Authorization is based on:

``` text
Authenticated Faculty
        ↓
FacultyAssignment
        ↓
Subject + Division + Batch
```

Before attendance or historical data is accessed:

``` text
Is faculty authenticated?
        ↓
Yes
        ↓
Does faculty have this assignment?
        ↓
Yes
        ↓
Continue
```

Otherwise:

``` text
403 Forbidden
```

Frontend visibility is not a security boundary.

------------------------------------------------------------------------

# 27. Attendance Submission Architecture

Detailed flow:

``` text
POST /api/attendance
        │
        ▼
Authentication Middleware
        │
        ▼
Validate Request
        │
        ▼
Attendance Controller
        │
        ▼
Attendance Service
        │
        ├── Verify Faculty Assignment
        │
        ├── Verify Subject
        │
        ├── Verify Division
        │
        ├── Verify Batch
        │
        ├── Verify Student Membership
        │
        ├── Determine Current Date
        │
        └── Check Duplicate Session
                │
                ▼
          PostgreSQL BEGIN
                │
                ├── Create PracticalSession
                │
                ├── Insert Attendance Records
                │
                ▼
             COMMIT
                │
                ▼
          Success Response
```

------------------------------------------------------------------------

# 28. Transaction Architecture

Attendance submission must be atomic.

``` text
BEGIN
   │
   ├── INSERT practical_session
   │
   ├── INSERT attendance #1
   ├── INSERT attendance #2
   ├── INSERT attendance #3
   ├── ...
   │
   ▼
COMMIT
```

If any insert fails:

``` text
ROLLBACK
```

This ensures:

``` text
No Session Without Its Attendance
No Partial Attendance
```

------------------------------------------------------------------------

# 29. Duplicate Protection

There are two important database-level protections.

## Duplicate Session

``` text
UNIQUE(
    subject_id,
    division_id,
    batch_id,
    session_date
)
```

## Duplicate Student Attendance

``` text
UNIQUE(
    session_id,
    student_id
)
```

The application may perform friendly pre-checks, but the database
constraints remain the final protection.

------------------------------------------------------------------------

# 30. Historical Data Architecture

Historical attendance is stored permanently.

``` text
PracticalSession
       ↓
Attendance
       ↓
Student
```

History query:

``` text
Subject
  +
Division
  +
Batch
  +
Date
```

The backend returns the stored records.

The frontend only renders them.

------------------------------------------------------------------------

# 31. Student Snapshot Architecture

Conceptual flow:

``` text
Student ID
   ↓
Find Student
   ↓
Find Relevant Attendance Sessions
   ↓
Join Attendance
   ↓
Filter Practical Context
   ↓
Aggregate
   ↓
Calculate Percentage
   ↓
Return Snapshot
```

Example:

``` text
Student
   ↓
Attendance Records
   ↓
Present Count
   ↓
Total Sessions
   ↓
Percentage
```

Formula:

``` text
Present / Total × 100
```

------------------------------------------------------------------------

# 32. Batch Snapshot Architecture

Conceptual flow:

``` text
Subject
   ↓
Division
   ↓
Batch
   ↓
Students
   ↓
Practical Sessions
   ↓
Attendance
   ↓
Aggregations
   ↓
Batch Snapshot
```

The query must remain scoped to the selected practical.

------------------------------------------------------------------------

# 33. Authentication Architecture

Registration:

``` text
Faculty Form
     ↓
POST /api/auth/register
     ↓
Validate
     ↓
bcrypt.hash(password)
     ↓
INSERT Faculty
     ↓
Response
```

Login:

``` text
Email + Password
       ↓
POST /api/auth/login
       ↓
Find Faculty
       ↓
bcrypt.compare()
       ↓
Create Session
       ↓
Authenticated
```

Logout:

``` text
POST /api/auth/logout
       ↓
Destroy Session
```

------------------------------------------------------------------------

# 34. Session Architecture

The browser maintains an authenticated session.

Conceptually:

``` text
Browser
   │
   │ Session Cookie
   ▼
Express
   │
   ▼
Authenticated Faculty
```

The frontend should not store the faculty password.

The session should identify the authenticated faculty on protected
requests.

------------------------------------------------------------------------

# 35. Validation Architecture

Validation should happen at multiple levels.

## Frontend

Used for immediate feedback.

Examples:

``` text
Email required
Password required
Attendance status valid
```

## Backend

Used for security and correctness.

Examples:

``` text
Faculty authenticated
Subject exists
Division exists
Batch exists
Student exists
Student belongs to batch
Faculty owns assignment
```

## Database

Used for final integrity.

Examples:

``` text
PRIMARY KEY
FOREIGN KEY
UNIQUE
CHECK
```

------------------------------------------------------------------------

# 36. SQL Safety

All user-controlled values must be passed as SQL parameters.

Correct:

``` javascript
pool.query(
    'SELECT * FROM student WHERE bt_id = $1',
    [btId]
);
```

Avoid:

``` javascript
`SELECT * FROM student WHERE bt_id = '${btId}'`
```

This protects the application from SQL injection.

------------------------------------------------------------------------

# 37. API Architecture

API groups:

``` text
/api/auth
/api/faculty
/api/subjects
/api/divisions
/api/students
/api/attendance
/api/snapshots
```

The API returns JSON.

Example:

``` json
{
  "success": true,
  "data": {}
}
```

Errors should use suitable HTTP status codes.

Examples:

``` text
400 → Invalid request
401 → Not authenticated
403 → Not authorized
404 → Resource not found
409 → Duplicate/conflict
500 → Server/database error
```

------------------------------------------------------------------------

# 38. API Authorization Examples

## Allowed

``` text
Faculty A
DBMS
CS-B
B2
```

when assignment exists.

## Rejected

``` text
Faculty A
DBMS
CS-C
C1
```

when assignment does not exist.

Response:

``` text
403 Forbidden
```

------------------------------------------------------------------------

# 39. Static Frontend Serving

Express can serve the frontend:

``` text
Express
  ├── API routes
  └── Static public files
```

Example:

``` javascript
app.use(express.static('public'));
```

This keeps the project easy to run locally.

------------------------------------------------------------------------

# 40. Environment Configuration

Sensitive configuration must not be hardcoded.

Example:

``` text
.env

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sipna_attendance
DB_USER=postgres
DB_PASSWORD=********

SESSION_SECRET=********
```

`.env` must not be committed to Git.

A `.env.example` should be provided.

------------------------------------------------------------------------

# 41. Database Initialization

Recommended structure:

``` text
db/
├── schema.sql
└── seed.sql
```

### `schema.sql`

Creates:

-   Tables.
-   Primary keys.
-   Foreign keys.
-   Unique constraints.
-   Check constraints.
-   Indexes where required.

### `seed.sql`

Creates:

-   Divisions.
-   Batches.
-   Subjects.
-   Demo faculty.
-   Faculty assignments.
-   Demo students.

------------------------------------------------------------------------

# 42. Database Indexing

Indexes should be added only where useful.

Potential indexes:

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

The project should avoid excessive indexing.

------------------------------------------------------------------------

# 43. Data Flow: Login

``` text
Login Page
   ↓
Email + Password
   ↓
POST /api/auth/login
   ↓
Express
   ↓
Find Faculty
   ↓
bcrypt.compare()
   ↓
Create Session
   ↓
Return Success
   ↓
Dashboard
```

------------------------------------------------------------------------

# 44. Data Flow: My Practicals

``` text
Dashboard
   ↓
GET /api/faculty/me/assignments
   ↓
Authenticated Faculty
   ↓
FacultyAssignment Query
   ↓
JOIN Subject + Division + Batch
   ↓
Return Assignments
   ↓
Render My Practicals
```

The frontend does not need to download all college assignments.

------------------------------------------------------------------------

# 45. Data Flow: Student List

``` text
Selected Batch
   ↓
GET /api/batches/:batchId/students
   ↓
Authorization
   ↓
Batch Validation
   ↓
SELECT Students
   ↓
Return Student List
   ↓
Render Attendance Table
```

------------------------------------------------------------------------

# 46. Data Flow: Attendance

``` text
Attendance UI
   ↓
User marks Present/Absent
   ↓
Live summary updates
   ↓
Optional local draft
   ↓
Submit
   ↓
POST /api/attendance
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Transaction
   ↓
PostgreSQL
   ↓
COMMIT
   ↓
Completed
   ↓
Delete local draft
```

------------------------------------------------------------------------

# 47. Data Flow: History

``` text
History Page
   ↓
Select Subject / Division / Batch
   ↓
GET /api/attendance/history
   ↓
PostgreSQL
   ↓
Practical Sessions + Attendance Aggregation
   ↓
Return History
   ↓
Display Dates
```

------------------------------------------------------------------------

# 48. Data Flow: Student Snapshot

``` text
Search Student
   ↓
Select Student
   ↓
GET /api/snapshots/student/:studentId
   ↓
Authorization
   ↓
Student + Attendance Query
   ↓
Aggregate
   ↓
Calculate Percentage
   ↓
Return Snapshot
```

------------------------------------------------------------------------

# 49. Data Flow: Batch Snapshot

``` text
Selected Practical
   ↓
GET /api/snapshots/batch/:batchId
   ↓
Verify Faculty Assignment
   ↓
Student + Session + Attendance Queries
   ↓
Aggregation
   ↓
Return Batch Snapshot
```

------------------------------------------------------------------------

# 50. Error Architecture

Use centralized Express error handling.

Conceptually:

``` text
Route
 ↓
Controller
 ↓
Service
 ↓
Error
 ↓
next(error)
 ↓
Error Middleware
 ↓
JSON Response
```

The frontend converts API errors into readable UI messages.

------------------------------------------------------------------------

# 51. Logging

The server should log useful development information:

``` text
Server started
Database connected
Request errors
Database errors
Authentication failures where appropriate
```

Do not log:

``` text
Passwords
Session secrets
Database passwords
Sensitive authentication information
```

------------------------------------------------------------------------

# 52. Security Boundaries

## Browser

Untrusted.

## Frontend JavaScript

Untrusted.

## Express Backend

Trusted application layer.

## PostgreSQL

Data integrity layer.

Therefore:

``` text
Frontend validation
      ≠
Security
```

Security-critical validation must happen on the backend.

------------------------------------------------------------------------

# 53. Source of Truth

For each type of data:

  Data                   Source of Truth
  ---------------------- ---------------------------
  Faculty account        PostgreSQL
  Faculty assignment     PostgreSQL
  Subject                PostgreSQL
  Division               PostgreSQL
  Batch                  PostgreSQL
  Student                PostgreSQL
  Completed attendance   PostgreSQL
  Attendance history     PostgreSQL
  Attendance draft       Browser temporary storage

------------------------------------------------------------------------

# 54. Read-Only Historical Architecture

Historical attendance should be retrieved through GET requests.

Examples:

``` text
GET /api/attendance/history
GET /api/attendance/:sessionId
GET /api/attendance/student/:studentId
```

The MVP should not expose a normal historical attendance update
endpoint.

This preserves the integrity of submitted attendance.

------------------------------------------------------------------------

# 55. Frontend Draft Architecture

Draft key should identify the practical context.

Conceptually:

``` text
attendance-draft:
subjectId
divisionId
batchId
```

Stored information may include:

``` text
studentId
status
```

Example:

``` json
{
  "subjectId": 1,
  "divisionId": 2,
  "batchId": 5,
  "attendance": {
    "101": "PRESENT",
    "102": "ABSENT"
  }
}
```

After successful server submission:

``` text
localStorage.removeItem(...)
```

------------------------------------------------------------------------

# 56. Deployment Architecture

For the academic prototype, deployment can remain simple.

``` text
Browser
   ↓
Node.js + Express
   ↓
PostgreSQL
```

The application can be hosted on a suitable Node.js-compatible platform
and PostgreSQL-compatible database service if deployment is required.

No microservice deployment is required.

No Kubernetes is required.

No service mesh is required.

------------------------------------------------------------------------

# 57. Local Development Architecture

Recommended development environment:

``` text
Developer Laptop
│
├── Node.js
├── npm
├── Express
├── PostgreSQL
└── Browser
```

Run:

``` text
npm install
```

Then configure:

``` text
.env
```

Then initialize PostgreSQL:

``` text
schema.sql
seed.sql
```

Then start:

``` text
npm start
```

------------------------------------------------------------------------

# 58. Git Architecture

Recommended repository:

``` text
sipna-practical-attendance/
```

Suggested branches:

``` text
main
development
feature/*
```

Commits should represent meaningful changes.

Example:

``` text
feat: add faculty authentication
feat: add practical assignments
feat: add attendance submission
feat: add attendance history
fix: prevent duplicate attendance
```

------------------------------------------------------------------------

# 59. Explicitly Avoided Technologies

The architecture intentionally does not use:

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
Docker
GraphQL
Complex authentication frameworks
```

These technologies are unnecessary for the current project requirements.

If any technology is introduced later, it must solve a real project
requirement rather than add complexity.

------------------------------------------------------------------------

# 60. Explicitly Avoided Architecture

Do not create unnecessary enterprise chains such as:

``` text
Controller
 ↓
Service
 ↓
Manager
 ↓
Repository
 ↓
DAO
 ↓
Mapper
 ↓
DTO
 ↓
Factory
 ↓
Adapter
```

For this project, use only layers that provide clear value:

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

Even these layers should remain lightweight.

------------------------------------------------------------------------

# 61. Core Architecture Summary

The final architecture is:

``` text
                 SIPNA ATTENDANCE SYSTEM

┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│                                             │
│        HTML + CSS + Vanilla JavaScript      │
│                                             │
│ Login | Dashboard | Practicals | Attendance │
│ History | Students | Snapshots              │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP / JSON
                       ▼
┌─────────────────────────────────────────────┐
│                  BACKEND                    │
│                                             │
│                Node.js                      │
│                Express.js                   │
│                                             │
│ Routes                                      │
│   ↓                                         │
│ Controllers                                 │
│   ↓                                         │
│ Services                                    │
│   ↓                                         │
│ Repositories / SQL                          │
│                                             │
│ Auth + Authorization + Validation           │
└──────────────────────┬──────────────────────┘
                       │
                       │ SQL
                       ▼
┌─────────────────────────────────────────────┐
│                POSTGRESQL                   │
│                                             │
│ Faculty                                     │
│ FacultyAssignment                           │
│ Subject                                     │
│ Division                                    │
│ Batch                                       │
│ Student                                     │
│ PracticalSession                            │
│ Attendance                                  │
│                                             │
│ PK + FK + UNIQUE + CHECK + INDEX + TX       │
└─────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 62. Final Architecture Principle

The architecture must remain:

``` text
Simple
Understandable
Relational
Secure
Maintainable
Demo-friendly
```

The system should demonstrate that a well-designed PostgreSQL database
and a simple Node.js/Express backend are sufficient to build a useful
practical attendance application without introducing unnecessary
technical complexity.
