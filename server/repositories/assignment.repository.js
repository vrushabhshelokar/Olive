const db = require('../db/connection');

class AssignmentRepository {
  async findByFacultyId(facultyId) {
    const res = await db.query(
      `SELECT 
        fa.assignment_id,
        fa.faculty_id,
        fa.subject_id,
        s.name AS subject_name,
        s.code AS subject_code,
        s.type AS subject_type,
        s.semester AS subject_semester,
        fa.division_id,
        d.name AS division_name,
        fa.batch_id,
        b.name AS batch_name
       FROM faculty_assignment fa
       JOIN subject s ON fa.subject_id = s.subject_id
       JOIN division d ON fa.division_id = d.division_id
       JOIN batch b ON fa.batch_id = b.batch_id
       WHERE fa.faculty_id = $1
       ORDER BY s.name ASC, d.name ASC, b.name ASC`,
      [facultyId]
    );
    return res.rows;
  }

  async verifyAssignment({ facultyId, subjectId, divisionId, batchId }) {
    const res = await db.query(
      `SELECT assignment_id FROM faculty_assignment 
       WHERE faculty_id = $1 AND subject_id = $2 AND division_id = $3 AND batch_id = $4`,
      [facultyId, subjectId, divisionId, batchId]
    );
    return res.rows.length > 0;
  }
}

module.exports = new AssignmentRepository();
