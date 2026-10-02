# Sipna Practical Attendance & Student Management System

A faculty-facing practical attendance management web application built for Sipna College of Engineering and Technology, backed by a relational PostgreSQL database.

## Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0+ (v22.20.0 recommended)
- **PostgreSQL**: v14.0+ (Optional: Embedded `pg-mem` fallback activates automatically if local PostgreSQL service is inactive)

### 2. Installation
```bash
# Clone repository & install dependencies
git clone https://github.com/sipna/practical-attendance.git
cd sipna-practical-attendance
npm install
```

### 3. Database Setup (Persistent PostgreSQL)
```bash
# Start PostgreSQL service and create database
createdb -U postgres sipna_attendance

# Execute schema and seed data
psql -U postgres -d sipna_attendance -f server/db/schema.sql
psql -U postgres -d sipna_attendance -f server/db/seed.sql
```
*(Note: `server/server.js` automatically executes `schema.sql` and `seed.sql` on startup).*

### 4. Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sipna_attendance
DB_USER=postgres
DB_PASSWORD=postgres

SESSION_SECRET=sipna_practical_attendance_secret_key_2026
```

### 5. Start Application
```bash
npm start
```
Open **`http://localhost:3000`** in your browser.

### 6. Test Credentials
- **Faculty Email:** `abc@sipna.ac.in`
- **Password:** `Demo@123`
- **Assigned Practical:** DBMS → Division CS-B → Batch B2
