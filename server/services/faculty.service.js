const facultyRepo = require('../repositories/faculty.repository');

class FacultyService {
  async getFacultyProfile(facultyId) {
    const faculty = await facultyRepo.findById(facultyId);
    if (!faculty) {
      const err = new Error('Faculty profile not found.');
      err.statusCode = 404;
      throw err;
    }
    return faculty;
  }
}

module.exports = new FacultyService();
