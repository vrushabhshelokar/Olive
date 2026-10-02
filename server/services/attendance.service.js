const attendanceRepo = require('../repositories/attendance.repository');
const assignmentService = require('./assignment.service');
const academicRepo = require('../repositories/academic.repository');
const studentRepo = require('../repositories/student.repository');

class AttendanceService {
  async submitAttendance({ facultyId, subjectId, divisionId, batchId, attendance, description }) {
    // 1. Basic Validation
    if (!subjectId || !divisionId || !batchId || !Array.isArray(attendance)) {
      const err = new Error('Subject, Division, Batch, and Attendance records are required.');
      err.statusCode = 400;
      throw err;
    }

    const subId = parseInt(subjectId, 10);
    const divId = parseInt(divisionId, 10);
    const batId = parseInt(batchId, 10);

    // 2. Verify Backend Authorization (Faculty Assignment)
    await assignmentService.verifyFacultyAssignment(facultyId, subId, divId, batId);

    // 3. Verify Batch belongs to Division
    const batch = await academicRepo.getBatchById(batId);
    if (!batch || batch.division_id !== divId) {
      const err = new Error('Selected batch does not belong to the selected division.');
      err.statusCode = 400;
      throw err;
    }

    // 4. Validate Batch Student Membership & Statuses
    const validStudents = await studentRepo.getStudentsByBatchId(batId);
    const validStudentIdMap = new Map(validStudents.map(s => [s.student_id, s]));

    if (attendance.length === 0) {
      const err = new Error('Attendance list cannot be empty.');
      err.statusCode = 400;
      throw err;
    }

    const attendanceRecords = [];
    for (const item of attendance) {
      const studentId = parseInt(item.studentId, 10);
      const status = item.status ? item.status.toUpperCase() : 'ABSENT';

      if (!validStudentIdMap.has(studentId)) {
        const err = new Error(`Student ID ${studentId} does not belong to the selected batch.`);
        err.statusCode = 400;
        throw err;
      }

      if (status !== 'PRESENT' && status !== 'ABSENT') {
        const err = new Error(`Invalid status '${status}'. Attendance status must be PRESENT or ABSENT.`);
        err.statusCode = 400;
        throw err;
      }

      attendanceRecords.push({ studentId, status });
    }

    // 5. Authoritative Current Date determined by Backend
    const sessionDate = new Date().toISOString().split('T')[0];

    // 6. Check Duplicate Session
    const existingSession = await attendanceRepo.findSessionByContextAndDate({
      subjectId: subId,
      divisionId: divId,
      batchId: batId,
      sessionDate
    });

    if (existingSession) {
      const err = new Error(`Today's attendance (${sessionDate}) has already been submitted for this practical.`);
      err.statusCode = 409;
      err.existingSessionId = existingSession.session_id;
      throw err;
    }

    // 7. Execute PostgreSQL Transaction
    const createdSession = await attendanceRepo.createSessionWithAttendance({
      subjectId: subId,
      divisionId: divId,
      batchId: batId,
      sessionDate,
      description,
      attendanceList: attendanceRecords
    });

    const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length;

    return {
      sessionId: createdSession.session_id,
      subjectId: subId,
      divisionId: divId,
      batchId: batId,
      sessionDate,
      totalStudents: attendanceRecords.length,
      presentCount,
      absentCount,
      status: 'COMPLETED'
    };
  }

  async getHistory({ facultyId, subjectId, divisionId, batchId }) {
    const subId = parseInt(subjectId, 10);
    const divId = parseInt(divisionId, 10);
    const batId = parseInt(batchId, 10);

    // Verify Authorization
    await assignmentService.verifyFacultyAssignment(facultyId, subId, divId, batId);

    return await attendanceRepo.getHistoryByContext({
      subjectId: subId,
      divisionId: divId,
      batchId: batId
    });
  }

  async getSessionDetails({ facultyId, sessionId }) {
    const sId = parseInt(sessionId, 10);
    const details = await attendanceRepo.getSessionAttendanceDetails(sId);
    if (!details) {
      const err = new Error('Attendance session not found.');
      err.statusCode = 404;
      throw err;
    }

    // Verify faculty authorization for the session's practical context
    await assignmentService.verifyFacultyAssignment(
      facultyId,
      details.session.subject_id,
      details.session.division_id,
      details.session.batch_id
    );

    return details;
  }
}

module.exports = new AttendanceService();
