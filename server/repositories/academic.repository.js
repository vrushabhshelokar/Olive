const db = require('../db/connection');

class AcademicRepository {
  async getAllSubjects() {
    const res = await db.query(
      'SELECT * FROM subject ORDER BY name ASC'
    );
    return res.rows;
  }

  async getSubjectById(subjectId) {
    const res = await db.query(
      'SELECT * FROM subject WHERE subject_id = $1',
      [subjectId]
    );
    return res.rows[0] || null;
  }

  async getAllDivisions() {
    const res = await db.query(
      'SELECT * FROM division ORDER BY name ASC'
    );
    return res.rows;
  }

  async getDivisionById(divisionId) {
    const res = await db.query(
      'SELECT * FROM division WHERE division_id = $1',
      [divisionId]
    );
    return res.rows[0] || null;
  }

  async getBatchesByDivisionId(divisionId) {
    const res = await db.query(
      'SELECT * FROM batch WHERE division_id = $1 ORDER BY name ASC',
      [divisionId]
    );
    return res.rows;
  }

  async getBatchById(batchId) {
    const res = await db.query(
      `SELECT b.batch_id, b.name AS batch_name, b.division_id, d.name AS division_name
       FROM batch b
       JOIN division d ON b.division_id = d.division_id
       WHERE b.batch_id = $1`,
      [batchId]
    );
    return res.rows[0] || null;
  }
}

module.exports = new AcademicRepository();
