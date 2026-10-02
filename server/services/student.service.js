const studentRepo = require('../repositories/student.repository');
const academicRepo = require('../repositories/academic.repository');

class StudentService {
  async getBatchStudents(batchId) {
    const batch = await academicRepo.getBatchById(batchId);
    if (!batch) {
      const err = new Error('Batch not found.');
      err.statusCode = 404;
      throw err;
    }

    return await studentRepo.getStudentsByBatchId(batchId);
  }

  async getStudentById(studentId) {
    const student = await studentRepo.getStudentById(studentId);
    if (!student) {
      const err = new Error('Student not found.');
      err.statusCode = 404;
      throw err;
    }
    return student;
  }

  async searchStudents(queryStr) {
    if (!queryStr || queryStr.trim().length === 0) {
      return [];
    }
    return await studentRepo.searchStudents(queryStr);
  }
}

module.exports = new StudentService();
