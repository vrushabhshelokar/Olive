const snapshotService = require('../services/snapshot.service');

class SnapshotController {
  async getStudentSnapshot(req, res, next) {
    try {
      const facultyId = req.session.faculty.faculty_id;
      const studentId = req.params.studentId;
      const subjectId = req.query.subjectId;

      const snapshot = await snapshotService.getStudentSnapshot({
        facultyId,
        studentId,
        subjectId
      });

      res.status(200).json({
        success: true,
        data: snapshot
      });
    } catch (err) {
      next(err);
    }
  }

  async getBatchSnapshot(req, res, next) {
    try {
      const facultyId = req.session.faculty.faculty_id;
      const batchId = req.params.batchId;
      const subjectId = req.query.subjectId;

      if (!subjectId) {
        const err = new Error('subjectId is required to generate batch snapshot.');
        err.statusCode = 400;
        throw err;
      }

      const snapshot = await snapshotService.getBatchSnapshot({
        facultyId,
        batchId,
        subjectId
      });

      res.status(200).json({
        success: true,
        data: snapshot
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SnapshotController();
