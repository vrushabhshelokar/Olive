const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('./config/env');
const { initDbConnection } = require('./db/connection');

const authRoutes = require('./routes/auth.routes');
const facultyRoutes = require('./routes/faculty.routes');
const academicRoutes = require('./routes/academic.routes');
const studentRoutes = require('./routes/student.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const snapshotRoutes = require('./routes/snapshot.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sipna Practical Attendance System API is healthy.',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api', academicRoutes); // Handles /api/subjects, /api/divisions, /api/divisions/:divisionId/batches
app.use('/api/academic', academicRoutes); // Also handles /api/academic/subjects, etc.
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/snapshots', snapshotRoutes);

// Fallback to index.html for SPA/Browser routing if applicable
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Centralized Error Middleware
app.use(errorHandler);

// Initialize DB and start server
async function startServer() {
  try {
    await initDbConnection();
    app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(` Sipna Practical Attendance & Student Management System `);
      console.log(` Server running on http://localhost:${config.port}     `);
      console.log(` Environment: ${config.nodeEnv}                        `);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
