# DESIGN.md

# Sipna Practical Attendance & Student Management System

## 1. Design Overview

The system is a **faculty-focused internal web application** for
managing practical attendance at Sipna College of Engineering and
Technology.

The design prioritizes:

1.  Speed
2.  Clarity
3.  Minimal interaction
4.  Easy navigation
5.  Strong context visibility
6.  Reliable feedback
7.  Professional appearance
8.  Practical usability

The interface should feel like a focused academic productivity tool
rather than a large college ERP.

------------------------------------------------------------------------

# 2. Design Goals

The UI should make the following workflow extremely easy:

``` text
Login
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
Mark Attendance
  ↓
Save
  ↓
View History
```

The faculty should not need to navigate through unnecessary screens or
forms.

------------------------------------------------------------------------

# 3. Design Philosophy

## Primary Principle

> Make practical attendance fast and reliable for faculty.

The interface should communicate:

``` text
What am I doing?
Where am I?
Which subject?
Which division?
Which batch?
Which date?
What has been marked?
What happens when I save?
```

These answers should always be visually clear.

------------------------------------------------------------------------

# 4. Visual Direction

The visual style should be:

-   Modern
-   Professional
-   Minimal
-   Clean
-   Academic
-   Light
-   Spacious
-   SaaS-inspired
-   Desktop-first
-   Responsive

Avoid:

-   Excessive decoration
-   Large hero sections
-   Unnecessary illustrations
-   Heavy animations
-   Excessive gradients
-   Huge analytics dashboards
-   Decorative cards without useful information

------------------------------------------------------------------------

# 5. Color System

Use a restrained interface palette.

## Primary

``` text
Primary: #2563EB
Primary Hover: #1D4ED8
```

Used for:

-   Primary buttons
-   Links
-   Active navigation
-   Important interactive elements

## Background

``` text
Page Background: #F8FAFC
Card Background: #FFFFFF
```

## Text

``` text
Primary Text: #0F172A
Secondary Text: #475569
Muted Text: #64748B
```

## Borders

``` text
Border: #E2E8F0
```

## Attendance Status

Present:

``` text
Green
```

Absent:

``` text
Red
```

Status must use text as well as color.

Example:

``` text
✓ PRESENT
✕ ABSENT
```

Do not communicate attendance status using color alone.

------------------------------------------------------------------------

# 6. Typography

Use a clean sans-serif typeface.

Recommended hierarchy:

``` text
Page Title:
24–32px
Semibold

Section Title:
18–22px
Semibold

Card Title:
16–18px
Semibold

Body:
14–16px

Secondary:
12–14px
```

Text should have sufficient contrast and line spacing.

------------------------------------------------------------------------

# 7. Application Layout

The primary application layout is:

``` text
┌─────────────────────────────────────────────────────┐
│ Header                                               │
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│   Sidebar     │           Main Content               │
│               │                                     │
│ Dashboard     │                                     │
│ My Practicals │                                     │
│ Students      │                                     │
│               │                                     │
│ Profile       │                                     │
│ Logout        │                                     │
│               │                                     │
└───────────────┴─────────────────────────────────────┘
```

The sidebar should remain compact.

------------------------------------------------------------------------

# 8. Header

The header should provide:

-   Application identity
-   Current faculty identity
-   Optional profile menu
-   Logout access

Example:

``` text
┌─────────────────────────────────────────────────────┐
│ SIPNA Attendance              Prof. ABC       Logout │
└─────────────────────────────────────────────────────┘
```

The header should not contain unnecessary controls.

------------------------------------------------------------------------

# 9. Sidebar

Required navigation:

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

Avoid adding:

``` text
Reports
Analytics
Settings
Fees
Exams
Library
Timetable
```

unless those features actually exist.

------------------------------------------------------------------------

# 10. Navigation State

The current navigation item should be clearly highlighted.

Example:

``` text
Dashboard
> My Practicals
Students
```

The active state should be distinguishable through:

-   Background
-   Text weight
-   Primary color
-   Optional indicator

Do not rely on color alone.

------------------------------------------------------------------------

# 11. Breadcrumbs

Practical-related pages should use breadcrumbs.

Example:

``` text
My Practicals / DBMS / CS-B / B2 / Attendance
```

This provides context and allows easy navigation backward.

------------------------------------------------------------------------

# 12. Practical Context Header

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

Practical Attendance
27 September 2026
```

This is one of the most important design elements.

The faculty should never be uncertain about which batch they are
marking.

------------------------------------------------------------------------

# 13. Login Page

The login page should be simple.

``` text
┌──────────────────────────────────────┐
│                                      │
│       SIPNA ATTENDANCE               │
│                                      │
│       Faculty Login                  │
│                                      │
│       Email                          │
│       [____________________]         │
│                                      │
│       Password                       │
│       [____________________]         │
│                                      │
│       [       Login       ]          │
│                                      │
│       Create Faculty Account         │
│                                      │
└──────────────────────────────────────┘
```

Do not add unnecessary content.

------------------------------------------------------------------------

# 14. Faculty Setup Page

Faculty setup should contain:

``` text
Faculty ID
Faculty Code
Name
Email
Department
Designation
Password
```

The form should clearly indicate required fields.

Example:

``` text
Faculty Setup

Faculty ID       [____________]
Faculty Code     [____________]
Name             [____________]
Email            [____________]
Department       [____________]
Designation      [____________]
Password         [____________]

              [Create Account]
```

------------------------------------------------------------------------

# 15. Dashboard Design

The dashboard is an entry point, not a college-wide analytics dashboard.

It may show:

``` text
Good morning, Prof. ABC

Today's Date
27 September 2026

My Practicals
[ DBMS ] [ CS-B ] [ B2 ]

Recent Attendance
[ DBMS · CS-B · B2 · 25 Sep ]
```

Avoid large KPI dashboards.

Do not show:

``` text
College-wide attendance
Total college students
Department performance
Large charts
Unrelated analytics
```

------------------------------------------------------------------------

# 16. My Practicals

This is the primary working area.

Only practical assignments belonging to the authenticated faculty should
appear.

Example:

``` text
My Practicals

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

Each assignment should be easy to identify and select.

------------------------------------------------------------------------

# 17. Practical Selection Flow

The interface may present practical context progressively:

``` text
Subject
   ↓
Division
   ↓
Batch
```

Example:

``` text
Select Subject

[ DBMS ]
[ C-Skill 4 ]
[ C-Skill 5 ]
```

Then:

``` text
Select Division

[ CS-B ]
[ CS-B ]
[ CS-C ]
```

Then:

``` text
Select Batch

[ B1 ]
[ B2 ]
[ B3 ]
```

Only valid faculty assignments should be displayed.

------------------------------------------------------------------------

# 18. Practical Selection Cards

A practical assignment can be displayed as a compact card:

``` text
┌─────────────────────────────┐
│ DBMS                        │
│ CS-B · B2                   │
│ Practical                   │
│                             │
│ [ Open Practical ]          │
└─────────────────────────────┘
```

Cards should remain compact.

Avoid decorative images.

------------------------------------------------------------------------

# 19. Attendance Page

The attendance page is the most important screen.

Recommended structure:

``` text
Breadcrumbs

DBMS · CS-B · B2
Practical Attendance
27 September 2026

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Total 30 │ │ Present26│ │ Absent 4 │
└──────────┘ └──────────┘ └──────────┘

Search students...

┌────────────────────────────────────────────┐
│ BT ID       Name             Status        │
├────────────────────────────────────────────┤
│ 24BT0001    Student 1        ABSENT        │
│ 24BT0002    Student 2        PRESENT       │
│ 24BT0003    Student 3        PRESENT       │
│ 24BT0004    Student 4        ABSENT        │
└────────────────────────────────────────────┘

                         [ Save Attendance ]
```

------------------------------------------------------------------------

# 20. Attendance Defaults

When the attendance page loads:

``` text
All students = ABSENT
```

The faculty marks present students.

This reduces unnecessary clicks.

------------------------------------------------------------------------

# 21. Attendance Interaction

A student status should be directly interactive.

Example:

``` text
[ ABSENT ]
```

Click:

``` text
[ PRESENT ]
```

Click again:

``` text
[ ABSENT ]
```

The change should be immediate.

The summary should update without a page reload.

------------------------------------------------------------------------

# 22. Student Attendance Row

Recommended row:

``` text
┌──────────────────────────────────────────────────┐
│ 24BT0014     Rahul Sharma        [ PRESENT ]    │
└──────────────────────────────────────────────────┘
```

Columns:

``` text
BT ID
Name
Status
```

Do not include unnecessary columns.

------------------------------------------------------------------------

# 23. Attendance Search

A search input should appear above the student list.

``` text
Search by BT ID or student name
[____________________________]
```

Search applies only to the current batch.

Example:

``` text
Search: 24BT0014
```

Result:

``` text
24BT0014
Student Name
PRESENT
```

------------------------------------------------------------------------

# 24. Attendance Summary

Use compact summary cards.

``` text
┌──────────────┐
│ Total        │
│ 30           │
└──────────────┘

┌──────────────┐
│ Present      │
│ 26           │
└──────────────┘

┌──────────────┐
│ Absent       │
│ 4            │
└──────────────┘
```

The values must update as the faculty marks attendance.

------------------------------------------------------------------------

# 25. Save Button

The save button must be prominent.

Normal state:

``` text
[ Save Attendance ]
```

Submitting:

``` text
[ Saving Attendance... ]
```

Success:

``` text
Attendance Submitted
```

The button must be disabled while submission is in progress.

------------------------------------------------------------------------

# 26. Attendance Submission Feedback

Successful submission should provide clear confirmation.

Example:

``` text
✓ Attendance Submitted

DBMS · CS-B · B2
27 September 2026

30 students
26 Present
4 Absent
```

The interface should make it clear that the attendance is now permanent.

------------------------------------------------------------------------

# 27. Completed Attendance

After successful submission:

``` text
Attendance Submitted
```

The student list becomes read-only.

Do not show:

``` text
Edit
Save Changes
Update Attendance
```

Normal completed attendance is immutable.

------------------------------------------------------------------------

# 28. Already Submitted State

If attendance already exists for the current practical:

``` text
┌─────────────────────────────────────────────┐
│ Attendance Already Submitted               │
│                                             │
│ DBMS · CS-B · B2                            │
│ 27 September 2026                           │
│                                             │
│ This practical attendance has already      │
│ been submitted.                             │
│                                             │
│ [ View Attendance ]                         │
└─────────────────────────────────────────────┘
```

Do not present a second submission form.

------------------------------------------------------------------------

# 29. Draft State

If an incomplete attendance draft exists:

``` text
Draft Found

An unsaved attendance draft was found.

[ Restore Draft ]
[ Discard Draft ]
```

The draft should clearly be labeled as temporary.

------------------------------------------------------------------------

# 30. Draft Saving

The UI should not constantly interrupt the faculty with notifications.

Draft storage should be silent or minimally indicated.

Optional:

``` text
Draft saved locally
```

The official database record exists only after successful submission.

------------------------------------------------------------------------

# 31. History Page

History should be context-specific.

Example:

``` text
DBMS · CS-B · B2

Attendance History

┌──────────────────────────────────────────────┐
│ Date           Present    Absent    Action   │
├──────────────────────────────────────────────┤
│ 25 Sep 2026      26         4      [View]    │
│ 23 Sep 2026      24         6      [View]    │
│ 21 Sep 2026      28         2      [View]    │
└──────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 32. Historical Attendance View

Selecting a historical date opens a read-only snapshot.

``` text
DBMS · CS-B · B2
23 September 2026

Total: 30
Present: 24
Absent: 6

BT ID       Name             Status
---------------------------------------
24BT0001    Student 1       PRESENT
24BT0002    Student 2       ABSENT
...
```

No edit controls should be displayed.

------------------------------------------------------------------------

# 33. Student Search Page

Student search should be simple.

``` text
Students

Search by BT ID or Name
[________________________]

Results

24BT0014
Student Name
CS-B · B2
```

Selecting a student opens the student snapshot.

------------------------------------------------------------------------

# 34. Student Snapshot

Recommended layout:

``` text
Student Snapshot

24BT0014
Student Name

Semester 5
CS-B
B2

DBMS

┌────────────┐ ┌────────────┐ ┌────────────┐
│ Sessions10 │ │ Present 8  │ │ Absent 2   │
└────────────┘ └────────────┘ └────────────┘

Attendance: 80%

Date           Status
-------------------------
25 Sep 2026    PRESENT
23 Sep 2026    ABSENT
21 Sep 2026    PRESENT
```

The snapshot must clearly identify the practical context.

------------------------------------------------------------------------

# 35. Student Snapshot Context

Because a student may have multiple practical subjects, the snapshot
should not mix:

``` text
DBMS
C-Skill 4
C-Skill 5
```

Attendance should be viewed separately by practical.

Example:

``` text
Student: 24BT0014

Practical:
[ DBMS ▼ ]

Division: CS-B
Batch: B2
```

------------------------------------------------------------------------

# 36. Batch Snapshot

Recommended layout:

``` text
Batch Snapshot

DBMS · CS-B · B2

Total Students: 30
Total Sessions: 10
Average Attendance: 78%

Student       Present   Total   Attendance
-------------------------------------------
Student 1       8        10       80%
Student 2       9        10       90%
Student 3       6        10       60%
```

The table should be readable and compact.

------------------------------------------------------------------------

# 37. Empty State

Every major page should have an appropriate empty state.

Example:

``` text
No Practical Assignments

No practical assignments are currently
assigned to your faculty account.
```

Avoid displaying empty tables without explanation.

------------------------------------------------------------------------

# 38. Loading State

Use simple loading indicators.

Example:

``` text
Loading students...
```

For larger content:

``` text
Skeleton rows
```

Avoid unnecessary animated loading effects.

------------------------------------------------------------------------

# 39. Error State

Example:

``` text
Unable to load students.

Please try again.
```

For attendance submission:

``` text
Attendance could not be submitted.

Your current draft has been preserved.

[ Try Again ]
```

Error messages should explain what the user can do next.

------------------------------------------------------------------------

# 40. Success State

Success feedback should be brief.

Example:

``` text
✓ Attendance submitted successfully.
```

Do not use large modal dialogs for ordinary successful actions.

------------------------------------------------------------------------

# 41. Confirmation Dialogs

Avoid unnecessary confirmation dialogs.

Do not ask:

``` text
Are you sure?
```

for every small action.

Confirmation may be appropriate for destructive actions such as:

``` text
Discard Attendance Draft
```

Normal attendance submission should use clear validation and a prominent
action instead of unnecessary confirmation.

------------------------------------------------------------------------

# 42. Responsive Design

The system is desktop-first but should remain usable on:

``` text
Desktop
Tablet
Mobile
```

Desktop:

``` text
Sidebar + Main Content
```

Tablet:

``` text
Compact Sidebar
```

Mobile:

``` text
Collapsed Navigation
Full-width Content
Stacked Summary Cards
```

Attendance tables should remain readable on smaller screens.

------------------------------------------------------------------------

# 43. Responsive Attendance Layout

Desktop:

``` text
BT ID | Name | Status
```

Mobile may use:

``` text
24BT0014
Student Name

[ PRESENT ]
```

The interaction should remain easy to tap.

------------------------------------------------------------------------

# 44. Accessibility

The interface should provide:

-   Adequate color contrast.
-   Visible keyboard focus.
-   Semantic buttons.
-   Proper form labels.
-   Accessible input fields.
-   Keyboard-friendly attendance controls.
-   Status text in addition to status colors.
-   Meaningful error messages.

Example:

Do not use only:

``` text
Green circle
```

Use:

``` text
✓ PRESENT
```

------------------------------------------------------------------------

# 45. Button Design

Primary actions:

``` text
[ Save Attendance ]
[ Login ]
[ Create Account ]
```

Secondary actions:

``` text
[ View ]
[ Back ]
[ Restore Draft ]
```

Destructive actions:

``` text
[ Discard Draft ]
```

Buttons should have clear labels describing the action.

Avoid ambiguous labels such as:

``` text
Go
Submit
Action
Continue
```

when a more specific label is possible.

------------------------------------------------------------------------

# 46. Form Design

Forms should:

-   Use visible labels.
-   Keep related fields together.
-   Avoid unnecessary fields.
-   Show validation errors near the relevant input.
-   Preserve entered values after validation failures.
-   Clearly distinguish required fields.

Example:

``` text
Email
[________________________]
Please enter a valid email.
```

------------------------------------------------------------------------

# 47. Table Design

Tables should be:

-   Clean.
-   Compact.
-   Easy to scan.
-   Properly aligned.
-   Responsive where possible.

Attendance table:

``` text
BT ID       Name             Status
-------------------------------------
24BT0014    Student Name     PRESENT
24BT0015    Student Name     ABSENT
```

Avoid excessive borders and decorative elements.

------------------------------------------------------------------------

# 48. Card Design

Cards should be used only when they improve information grouping.

Good uses:

``` text
Practical Assignment
Attendance Summary
Student Summary
```

Avoid creating cards for every piece of text.

------------------------------------------------------------------------

# 49. Spacing

Use consistent spacing.

Suggested scale:

``` text
4px
8px
12px
16px
24px
32px
48px
```

Use larger spacing between major sections and smaller spacing within
related content.

------------------------------------------------------------------------

# 50. Border Radius

Use moderate rounding.

Recommended:

``` text
Buttons: 6–8px
Cards: 8–12px
Inputs: 6–8px
```

Avoid excessively rounded UI that makes the application look playful
rather than academic/professional.

------------------------------------------------------------------------

# 51. Shadows

Use subtle shadows only where useful.

Cards may use a light shadow or border.

Avoid heavy shadows.

The design should rely primarily on:

``` text
Spacing
Typography
Borders
Hierarchy
```

rather than visual effects.

------------------------------------------------------------------------

# 52. Icons

Icons may be used for:

``` text
Dashboard
Students
Attendance
History
Search
Logout
```

Icons should support text, not replace important labels.

Avoid decorative icon overload.

------------------------------------------------------------------------

# 53. Navigation Behavior

Navigation should preserve context.

Example:

``` text
My Practicals
   ↓
DBMS / CS-B / B2
   ↓
Attendance
```

Returning to `My Practicals` should not require repeatedly entering the
same context.

------------------------------------------------------------------------

# 54. Attendance Context Persistence

While moving between:

``` text
Attendance
History
Historical Snapshot
```

the interface should retain:

``` text
Subject
Division
Batch
```

This prevents accidental context switching.

------------------------------------------------------------------------

# 55. Search Behavior

Search should feel immediate.

Recommended:

``` text
User types
   ↓
Filter/search
   ↓
Results update
```

For the expected dataset, client-side filtering may be sufficient after
loading the current batch.

For broader student search, use the backend API.

------------------------------------------------------------------------

# 56. Notification Strategy

Use small inline notifications or toast messages for:

``` text
Saved
Submitted
Error
Draft restored
```

Avoid modal dialogs for routine notifications.

Notifications should not block the faculty's workflow.

------------------------------------------------------------------------

# 57. Page Hierarchy

The overall hierarchy should be:

``` text
Application
│
├── Dashboard
│
├── My Practicals
│   │
│   ├── Subject
│   ├── Division
│   ├── Batch
│   │
│   ├── Attendance
│   └── History
│
└── Students
    │
    ├── Search
    ├── Student Snapshot
    └── Batch Snapshot
```

------------------------------------------------------------------------

# 58. Primary User Journey

The primary journey is:

``` text
Login
 ↓
Dashboard
 ↓
My Practicals
 ↓
Select DBMS
 ↓
Select CS-B
 ↓
Select B2
 ↓
Attendance
 ↓
30 students loaded
 ↓
All absent
 ↓
Mark 26 present
 ↓
Review summary
 ↓
Save Attendance
 ↓
Completed
```

The interface should make this path obvious.

------------------------------------------------------------------------

# 59. Secondary User Journey: History

``` text
My Practicals
 ↓
DBMS
 ↓
CS-B
 ↓
B2
 ↓
History
 ↓
23 Sep 2026
 ↓
View Attendance
```

The complete historical student list is displayed read-only.

------------------------------------------------------------------------

# 60. Secondary User Journey: Student Verification

``` text
Students
 ↓
Search 24BT0014
 ↓
Student Snapshot
 ↓
Select DBMS
 ↓
Attendance History
 ↓
Select Date
 ↓
View PRESENT / ABSENT
```

This should answer the faculty's question without requiring manual
database searching.

------------------------------------------------------------------------

# 61. Design Anti-Patterns

Do not implement:

### Complex ERP Dashboard

Avoid dozens of metrics and modules.

### Excessive Sidebar Items

Only expose useful current features.

### Large Analytics Charts

The project is an attendance productivity tool, not an analytics
platform.

### Unnecessary Popups

Do not interrupt normal attendance marking.

### Manual Attendance Date

Faculty should not enter the current date manually.

### Manual Student Selection

Students should load from the selected batch.

### Faculty Master Data Editing

Faculty should not modify academic master data freely.

### Post-Submission Editing

Completed attendance should be read-only.

### Excessive Animations

Use only subtle transitions when they improve usability.

### Decorative Hero Sections

The application should get faculty to their work quickly.

------------------------------------------------------------------------

# 62. Component Philosophy

The frontend should use reusable UI patterns without creating
unnecessary abstraction.

Useful reusable patterns include:

``` text
Header
Sidebar
Breadcrumbs
Button
Input
Card
Table
Status Badge
Summary Card
Toast
Modal
```

Do not create dozens of tiny components for simple markup.

The goal is maintainability, not abstraction for its own sake.

------------------------------------------------------------------------

# 63. Vanilla JavaScript Design

Since the project uses Vanilla JavaScript, UI behavior should be
organized into focused modules.

Example:

``` text
attendance.js
```

handles:

``` text
loadStudents()
toggleAttendance()
updateSummary()
saveDraft()
restoreDraft()
submitAttendance()
```

Example:

``` text
history.js
```

handles:

``` text
loadHistory()
viewSession()
```

Example:

``` text
students.js
```

handles:

``` text
searchStudents()
loadStudentSnapshot()
loadBatchSnapshot()
```

------------------------------------------------------------------------

# 64. API/UI Separation

The frontend should not contain SQL.

Correct:

``` text
Frontend
   ↓
REST API
   ↓
Backend
   ↓
PostgreSQL
```

Incorrect:

``` text
Frontend
   ↓
Direct PostgreSQL connection
```

Database credentials must never be exposed to browser JavaScript.

------------------------------------------------------------------------

# 65. Data Display Rules

The UI should display backend data rather than hardcoded values.

Examples:

``` text
Faculty name
Assignments
Student list
Attendance counts
History
Attendance percentage
```

All should come from the backend/database.

Hardcoded values are acceptable only for static labels or initial
demonstration configuration where explicitly intended.

------------------------------------------------------------------------

# 66. Design for DBMS Demonstration

The interface should make database-backed functionality visible through
the workflow.

For example:

``` text
Select Batch
     ↓
Students retrieved from PostgreSQL
```

and:

``` text
Save Attendance
     ↓
Transaction
     ↓
PostgreSQL
```

and:

``` text
Open History
     ↓
Historical records retrieved
```

The UI should demonstrate that the application is not merely a static
frontend.

------------------------------------------------------------------------

# 67. Final Visual Structure

``` text
┌─────────────────────────────────────────────────────────┐
│ SIPNA ATTENDANCE                         Faculty | Logout│
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│ Dashboard     │  Breadcrumbs                            │
│               │                                         │
│ My Practicals │  DBMS · CS-B · B2                       │
│               │  Practical Attendance                   │
│ Students      │  27 September 2026                      │
│               │                                         │
│               │  ┌───────┐ ┌───────┐ ┌───────┐         │
│ Profile       │  │Total30│ │Present│ │Absent │         │
│ Logout        │  └───────┘ └───────┘ └───────┘         │
│               │                                         │
│               │  Search students...                     │
│               │                                         │
│               │  BT ID | Name | Status                  │
│               │  ─────────────────────────────          │
│               │  24BT1 | Student | PRESENT              │
│               │  24BT2 | Student | ABSENT               │
│               │                                         │
│               │                     [Save Attendance]    │
└───────────────┴─────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 68. Final Design Principles

The completed application must follow these principles:

``` text
Faculty-first
        ↓
Context-first
        ↓
Minimal interaction
        ↓
Clear status
        ↓
Reliable feedback
        ↓
Persistent history
        ↓
Professional UI
```

The design exists to make practical attendance faster and safer for
faculty, not to make the project visually complex.

------------------------------------------------------------------------

# 69. Final Design Definition

The final interface should feel like a focused internal academic
productivity application:

``` text
Simple
Clean
Fast
Professional
Responsive
Context-aware
Database-backed
Faculty-focused
```

The most important screen is the attendance screen.

The most important navigation is:

``` text
My Practicals
→ Subject
→ Division
→ Batch
→ Attendance
```

The most important secondary capabilities are:

``` text
Attendance History
Student Snapshot
Batch Snapshot
```

Every design decision should support these workflows.
