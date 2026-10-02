const attendanceRepo = require('../repositories/attendance.repository');
const studentRepo = require('../repositories/student.repository');
const assignmentRepo = require('../repositories/assignment.repository');
const academicRepo = require('../repositories/academic.repository');

class SnapshotService {
  async getStudentSnapshot({ facultyId, studentId, subjectId }) {
    const stId = parseInt(studentId, 10);
    const subId = subjectId ? parseInt(subjectId, 10) : null;

    const student = await studentRepo.getStudentById(stId);
    if (!student) {
      const err = new Error('Student not found.');
      err.statusCode = 404;
      throw err;
    }

    // Verify faculty has assignment for the student's division & batch
    const facultyAssignments = await assignmentRepo.findByFacultyId(facultyId);
    const hasAccess = facultyAssignments.some(fa =>
      fa.division_id === student.division_id && fa.batch_id === student.batch_id && (!subId || fa.subject_id === subId)
    );

    if (!hasAccess) {
      const err = new Error('Unauthorized: Student belongs to a practical batch you are not assigned to.');
      err.statusCode = 403;
      throw err;
    }

    const history = await attendanceRepo.getStudentAttendanceHistory(stId, subId);

    const totalSessions = history.length;
    const presentCount = history.filter(h => h.status === 'PRESENT').length;
    const absentCount = history.filter(h => h.status === 'ABSENT').length;
    const percentage = totalSessions > 0 ? parseFloat(((presentCount / totalSessions) * 100).toFixed(2)) : 0;

    let subjectInfo = null;
    if (subId) {
      subjectInfo = await academicRepo.getSubjectById(subId);
    }

    return {
      student,
      subject: subjectInfo,
      summary: {
        totalSessions,
        presentCount,
        absentCount,
        percentage
      },
      history
    };
  }

  async getBatchSnapshot({ facultyId, batchId, subjectId }) {
    const batId = parseInt(batchId, 10);
    const subId = parseInt(subjectId, 10);

    const batch = await academicRepo.getBatchById(batId);
    if (!batch) {
      const err = new Error('Batch not found.');
      err.statusCode = 404;
      throw err;
    }

    const subject = await academicRepo.getSubjectById(subId);
    if (!subject) {
      const err = new Error('Subject not found.');
      err.statusCode = 404;
      throw err;
    }

    // Verify Faculty Assignment
    const isAuthorized = await assignmentRepo.verifyAssignment({
      facultyId,
      subjectId: subId,
      divisionId: batch.division_id,
      batchId: batId
    });

    if (!isAuthorized) {
      const err = new Error('Unauthorized: You are not assigned to this practical batch.');
      err.statusCode = 403;
      throw err;
    }

    const stats = await attendanceRepo.getBatchAttendanceStats(batId, subId);

    return {
      batch,
      subject,
      stats
    };
  }
}

module.exports = new SnapshotService();
