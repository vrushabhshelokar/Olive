const facultyService = require('../services/faculty.service');
const assignmentService = require('../services/assignment.service');

class FacultyController {
  async getMe(req, res, next) {
    try {
      const facultyId = req.session.faculty.faculty_id;
      const profile = await facultyService.getFacultyProfile(facultyId);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      next(err);
    }
  }

  async getAssignments(req, res, next) {
    try {
      const facultyId = req.session.faculty.faculty_id;
      const assignments = await assignmentService.getFacultyAssignments(facultyId);
      res.status(200).json({
        success: true,
        data: assignments
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new FacultyController();
