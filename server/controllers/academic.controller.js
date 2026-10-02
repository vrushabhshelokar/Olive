const academicRepo = require('../repositories/academic.repository');

class AcademicController {
  async getSubjects(req, res, next) {
    try {
      const subjects = await academicRepo.getAllSubjects();
      res.status(200).json({
        success: true,
        data: subjects
      });
    } catch (err) {
      next(err);
    }
  }

  async getDivisions(req, res, next) {
    try {
      const divisions = await academicRepo.getAllDivisions();
      res.status(200).json({
        success: true,
        data: divisions
      });
    } catch (err) {
      next(err);
    }
  }

  async getBatches(req, res, next) {
    try {
      const divisionId = req.params.divisionId;
      const batches = await academicRepo.getBatchesByDivisionId(divisionId);
      res.status(200).json({
        success: true,
        data: batches
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AcademicController();
