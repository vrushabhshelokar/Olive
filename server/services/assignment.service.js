const assignmentRepo = require('../repositories/assignment.repository');

class AssignmentService {
  async getFacultyAssignments(facultyId) {
    return await assignmentRepo.findByFacultyId(facultyId);
  }

  async verifyFacultyAssignment(facultyId, subjectId, divisionId, batchId) {
    const isAuthorized = await assignmentRepo.verifyAssignment({
      facultyId,
      subjectId: parseInt(subjectId, 10),
      divisionId: parseInt(divisionId, 10),
      batchId: parseInt(batchId, 10)
    });

    if (!isAuthorized) {
      const err = new Error('Unauthorized: You are not assigned to this practical context.');
      err.statusCode = 403;
      throw err;
    }

    return true;
  }
}

module.exports = new AssignmentService();
