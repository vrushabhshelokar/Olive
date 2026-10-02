const db = require('../db/connection');

class AttendanceRepository {
  async findSessionByContextAndDate({ subjectId, divisionId, batchId, sessionDate }) {
    const res = await db.query(
      `SELECT session_id, subject_id, division_id, batch_id, session_date, description, created_at
       FROM practical_session
       WHERE subject_id = $1 AND division_id = $2 AND batch_id = $3 AND session_date = $4`,
      [subjectId, divisionId, batchId, sessionDate]
    );
    return res.rows[0] || null;
  }

  async findSessionById(sessionId) {
    const res = await db.query(
      `SELECT ps.session_id, ps.subject_id, s.name AS subject_name, s.code AS subject_code,
              ps.division_id, d.name AS division_name, ps.batch_id, b.name AS batch_name,
              ps.session_date, ps.description, ps.created_at
       FROM practical_session ps
       JOIN subject s ON ps.subject_id = s.subject_id
       JOIN division d ON ps.division_id = d.division_id
       JOIN batch b ON ps.batch_id = b.batch_id
       WHERE ps.session_id = $1`,
      [sessionId]
    );
    return res.rows[0] || null;
  }

  /**
   * PostgreSQL Transaction for creating a practical attendance session
   */
  async createSessionWithAttendance({ subjectId, divisionId, batchId, sessionDate, description, attendanceList }) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Calculate next Session ID to prevent sequence collision on pre-seeded rows
      const nextIdRes = await client.query('SELECT COALESCE(MAX(session_id), 0) + 1 AS next_id FROM practical_session');
      const nextSessionId = parseInt(nextIdRes.rows[0].next_id, 10);

      // 1. Insert Practical Session
      const sessionRes = await client.query(
        `INSERT INTO practical_session (session_id, subject_id, division_id, batch_id, session_date, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING session_id, subject_id, division_id, batch_id, session_date, created_at`,
        [nextSessionId, subjectId, divisionId, batchId, sessionDate, description || null]
      );
      const session = sessionRes.rows[0];
      const sessionId = session.session_id;

      // Calculate next Attendance ID base
      const nextAttRes = await client.query('SELECT COALESCE(MAX(attendance_id), 0) AS max_id FROM attendance');
      let currentAttId = parseInt(nextAttRes.rows[0].max_id, 10);

      // 2. Insert Attendance records
      for (const record of attendanceList) {
        currentAttId++;
        await client.query(
          `INSERT INTO attendance (attendance_id, session_id, student_id, status)
           VALUES ($1, $2, $3, $4)`,
          [currentAttId, sessionId, record.studentId, record.status]
        );
      }

      await client.query('COMMIT');
      return session;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getHistoryByContext({ subjectId, divisionId, batchId }) {
    const res = await db.query(
      `SELECT 
        ps.session_id,
        ps.session_date,
        ps.description,
        ps.created_at,
        COUNT(a.attendance_id)::int AS total_students,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END)::int AS present_count,
        SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END)::int AS absent_count
       FROM practical_session ps
       JOIN attendance a ON ps.session_id = a.session_id
       WHERE ps.subject_id = $1 AND ps.division_id = $2 AND ps.batch_id = $3
       GROUP BY ps.session_id, ps.session_date, ps.description, ps.created_at
       ORDER BY ps.session_date DESC, ps.session_id DESC`,
      [subjectId, divisionId, batchId]
    );
    return res.rows;
  }

  async getSessionAttendanceDetails(sessionId) {
    const session = await this.findSessionById(sessionId);
    if (!session) return null;

    const attendanceRes = await db.query(
      `SELECT 
        a.attendance_id,
        a.session_id,
        a.student_id,
        st.bt_id,
        st.name AS student_name,
        a.status,
        a.marked_at
       FROM attendance a
       JOIN student st ON a.student_id = st.student_id
       WHERE a.session_id = $1
       ORDER BY st.bt_id ASC`,
      [sessionId]
    );

    const records = attendanceRes.rows;
    const presentCount = records.filter(r => r.status === 'PRESENT').length;
    const absentCount = records.filter(r => r.status === 'ABSENT').length;

    return {
      session,
      totalStudents: records.length,
      presentCount,
      absentCount,
      status: 'COMPLETED',
      attendance: records
    };
  }

  async getStudentAttendanceHistory(studentId, subjectId) {
    let sql = `
      SELECT 
        a.attendance_id,
        ps.session_id,
        ps.session_date,
        ps.description,
        s.name AS subject_name,
        s.code AS subject_code,
        a.status,
        a.marked_at
      FROM attendance a
      JOIN practical_session ps ON a.session_id = ps.session_id
      JOIN subject s ON ps.subject_id = s.subject_id
      WHERE a.student_id = $1
    `;
    const params = [studentId];

    if (subjectId) {
      sql += ` AND ps.subject_id = $2`;
      params.push(subjectId);
    }

    sql += ` ORDER BY ps.session_date DESC, ps.session_id DESC`;

    const res = await db.query(sql, params);
    return res.rows;
  }

  async getBatchAttendanceStats(batchId, subjectId) {
    // 1. Get total sessions for this batch and subject
    const sessionsRes = await db.query(
      `SELECT session_id, session_date, description 
       FROM practical_session 
       WHERE batch_id = $1 AND subject_id = $2
       ORDER BY session_date DESC`,
      [batchId, subjectId]
    );
    const totalSessions = sessionsRes.rows.length;

    // 2. Get student-wise attendance counts for this batch and subject
    const studentStatsRes = await db.query(
      `SELECT 
        st.student_id,
        st.bt_id,
        st.name AS student_name,
        COUNT(a.attendance_id)::int AS total_sessions_recorded,
        SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END)::int AS present_count,
        SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END)::int AS absent_count
       FROM student st
       LEFT JOIN attendance a ON st.student_id = a.student_id
       LEFT JOIN practical_session ps ON a.session_id = ps.session_id AND ps.subject_id = $2
       WHERE st.batch_id = $1
       GROUP BY st.student_id, st.bt_id, st.name
       ORDER BY st.bt_id ASC`,
      [batchId, subjectId]
    );

    const students = studentStatsRes.rows.map(st => {
      const present = st.present_count || 0;
      const absent = st.absent_count || 0;
      const percentage = totalSessions > 0 ? parseFloat(((present / totalSessions) * 100).toFixed(2)) : 0;
      return {
        studentId: st.student_id,
        btId: st.bt_id,
        name: st.student_name,
        totalSessions,
        present,
        absent,
        percentage
      };
    });

    const avgPercentage = students.length > 0
      ? parseFloat((students.reduce((acc, curr) => acc + curr.percentage, 0) / students.length).toFixed(2))
      : 0;

    return {
      totalSessions,
      totalStudents: students.length,
      averagePercentage: avgPercentage,
      students
    };
  }
}

module.exports = new AttendanceRepository();
