const db = require('../db/connection');

class FacultyRepository {
  async findByEmail(email) {
    const res = await db.query(
      'SELECT * FROM faculty WHERE email = $1',
      [email]
    );
    return res.rows[0] || null;
  }

  async findByCode(code) {
    const res = await db.query(
      'SELECT * FROM faculty WHERE faculty_code = $1',
      [code]
    );
    return res.rows[0] || null;
  }

  async findById(id) {
    const res = await db.query(
      'SELECT faculty_id, faculty_code, name, email, department, designation, created_at FROM faculty WHERE faculty_id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async create({ facultyCode, name, email, department, designation, passwordHash }) {
    const res = await db.query(
      `INSERT INTO faculty (faculty_code, name, email, department, designation, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING faculty_id, faculty_code, name, email, department, designation, created_at`,
      [facultyCode, name, email, department, designation, passwordHash]
    );
    return res.rows[0];
  }
}

module.exports = new FacultyRepository();
