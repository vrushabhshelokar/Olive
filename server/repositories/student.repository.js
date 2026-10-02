const db = require('../db/connection');

class StudentRepository {
  async getStudentsByBatchId(batchId) {
    const res = await db.query(
      `SELECT 
        s.student_id,
        s.bt_id,
        s.name,
        s.semester,
        s.division_id,
        d.name AS division_name,
        s.batch_id,
        b.name AS batch_name
       FROM student s
       JOIN division d ON s.division_id = d.division_id
       JOIN batch b ON s.batch_id = b.batch_id
       WHERE s.batch_id = $1
       ORDER BY s.bt_id ASC`,
      [batchId]
    );
    return res.rows;
  }

  async getStudentById(studentId) {
    const res = await db.query(
      `SELECT 
        s.student_id,
        s.bt_id,
        s.name,
        s.semester,
        s.division_id,
        d.name AS division_name,
        s.batch_id,
        b.name AS batch_name
       FROM student s
       JOIN division d ON s.division_id = d.division_id
       JOIN batch b ON s.batch_id = b.batch_id
       WHERE s.student_id = $1`,
      [studentId]
    );
    return res.rows[0] || null;
  }

  async searchStudents(queryStr) {
    const pattern = `%${queryStr.trim()}%`;
    const res = await db.query(
      `SELECT 
        s.student_id,
        s.bt_id,
        s.name,
        s.semester,
        s.division_id,
        d.name AS division_name,
        s.batch_id,
        b.name AS batch_name
       FROM student s
       JOIN division d ON s.division_id = d.division_id
       JOIN batch b ON s.batch_id = b.batch_id
       WHERE s.bt_id ILIKE $1 OR s.name ILIKE $1
       ORDER BY s.bt_id ASC
       LIMIT 50`,
      [pattern]
    );
    return res.rows;
  }
}

module.exports = new StudentRepository();
