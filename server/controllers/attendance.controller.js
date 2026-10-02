const attendanceService = require('../services/attendance.service');

class AttendanceController {
  async create(req, res, next) {
    try {
      const facultyId = req.session.faculty.faculty_id;
      const { subjectId, divisionId, batchId, attendance, description } = req.body;

      const result = await attendanceService.submitAttendance({
        facultyId,
        subjectId,
        divisionId,
        batchId,
        attendance,
        description
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req, res, next) {
    try {
      const facultyId = req.session.faculty.faculty_id;
      const { subjectId, divisionId, batchId } = req.query;

      if (!subjectId || !divisionId || !batchId) {
        const err = new Error('subjectId, divisionId, and batchId are required query parameters.');
        err.statusCode = 400;
        throw err;
      }

      const history = await attendanceService.getHistory({
        facultyId,
        subjectId,
        divisionId,
        batchId
      });

      res.status(200).json({
        success: true,
        data: history
      });
    } catch (err) {
      next(err);
    }
  }

  async getSessionDetails(req, res, next) {
    try {
      const facultyId = req.session.faculty.faculty_id;
      const sessionId = req.params.sessionId;

      const details = await attendanceService.getSessionDetails({
        facultyId,
        sessionId
      });

      res.status(200).json({
        success: true,
        data: details
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AttendanceController();
