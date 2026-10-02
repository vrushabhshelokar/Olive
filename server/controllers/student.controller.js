const studentService = require('../services/student.service');

class StudentController {
  async getBatchStudents(req, res, next) {
    try {
      const batchId = req.params.batchId;
      const students = await studentService.getBatchStudents(batchId);
      res.status(200).json({
        success: true,
        data: students
      });
    } catch (err) {
      next(err);
    }
  }

  async searchStudents(req, res, next) {
    try {
      const q = req.query.q || '';
      const students = await studentService.searchStudents(q);
      res.status(200).json({
        success: true,
        data: students
      });
    } catch (err) {
      next(err);
    }
  }

  async getStudentById(req, res, next) {
    try {
      const id = req.params.id;
      const student = await studentService.getStudentById(id);
      res.status(200).json({
        success: true,
        data: student
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentController();
