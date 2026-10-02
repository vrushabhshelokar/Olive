/* Sipna Practical Attendance System - Snapshots Script (Student & Batch) */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  
  // 1. Check if on Student Snapshot Page
  const studentSnapshotContainer = document.getElementById('student-snapshot-container');
  if (studentSnapshotContainer) {
    const studentId = params.get('studentId');
    const subjectId = params.get('subjectId');
    if (!studentId) {
      studentSnapshotContainer.innerHTML = `<div class="alert alert-danger">No student selected.</div>`;
      return;
    }
    await loadStudentSnapshot(studentId, subjectId);
  }

  // 2. Check if on Batch Snapshot Page
  const batchSnapshotContainer = document.getElementById('batch-snapshot-container');
  if (batchSnapshotContainer) {
    const batchId = params.get('batchId');
    const subjectId = params.get('subjectId');
    if (!batchId || !subjectId) {
      batchSnapshotContainer.innerHTML = `<div class="alert alert-danger">Please select a valid batch and subject.</div>`;
      return;
    }
    await loadBatchSnapshot(batchId, subjectId);
  }
});

async function loadStudentSnapshot(studentId, selectedSubjectId) {
  const container = document.getElementById('student-snapshot-container');
  try {
    const snapshotRes = await API.getStudentSnapshot(studentId, selectedSubjectId);
    const data = snapshotRes.data;
    const student = data.student;
    const summary = data.summary;
    const history = data.history;

    // Load available subjects for subject selector dropdown
    const subjectsRes = await API.getSubjects();
    const subjects = subjectsRes.data;

    container.innerHTML = `
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 4px;">${student.name}</h2>
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary-color); margin-bottom: 8px;">BT ID: ${student.bt_id}</div>
            <div style="display: flex; gap: 8px;">
              <span class="badge badge-info">Semester ${student.semester}</span>
              <span class="badge badge-info">Division: ${student.division_name}</span>
              <span class="badge badge-info">Batch: ${student.batch_name}</span>
            </div>
          </div>
          
          <div style="min-width: 220px;">
            <label class="form-label" for="subject-filter">Filter Practical Subject:</label>
            <select id="subject-filter" class="form-control">
              <option value="">-- All Practical Subjects --</option>
              ${subjects.map(s => `
                <option value="${s.subject_id}" ${selectedSubjectId == s.subject_id ? 'selected' : ''}>
                  ${s.name} (${s.code})
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card total">
          <span class="label">Total Practical Sessions</span>
          <span class="value">${summary.totalSessions}</span>
        </div>
        <div class="summary-card present">
          <span class="label">Present</span>
          <span class="value">${summary.presentCount}</span>
        </div>
        <div class="summary-card absent">
          <span class="label">Absent</span>
          <span class="value">${summary.absentCount}</span>
        </div>
        <div class="summary-card info">
          <span class="label">Attendance Rate</span>
          <span class="value">${summary.percentage}%</span>
          <div class="progress-bar">
            <div class="progress-fill ${summary.percentage >= 75 ? 'high' : 'low'}" style="width: ${Math.min(summary.percentage, 100)}%;"></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Date-Specific Practical Attendance Verification</h3>
        </div>
        
        ${history.length === 0 ? `
          <div class="state-container">
            <p>No attendance records recorded for this student in the selected practical subject.</p>
          </div>
        ` : `
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Session Date</th>
                  <th>Subject</th>
                  <th>Topic / Description</th>
                  <th style="text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(h => {
                  const fDate = new Date(h.session_date).toLocaleDateString('en-US', {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                  });
                  return `
                    <tr>
                      <td style="font-weight: 700;">${fDate}</td>
                      <td>${h.subject_name} (${h.subject_code})</td>
                      <td>${h.description || 'Regular Practical Session'}</td>
                      <td style="text-align: right;">
                        <span class="badge ${h.status === 'PRESENT' ? 'badge-present' : 'badge-absent'}">
                          ${h.status === 'PRESENT' ? '✓ PRESENT' : '✕ ABSENT'}
                        </span>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    // Dropdown filter listener
    document.getElementById('subject-filter')?.addEventListener('change', (e) => {
      const val = e.target.value;
      window.location.href = `/student-snapshot.html?studentId=${studentId}${val ? `&subjectId=${val}` : ''}`;
    });

  } catch (err) {
    console.error('Error loading student snapshot:', err);
    container.innerHTML = `<div class="alert alert-danger">Failed to load student snapshot: ${err.message}</div>`;
  }
}

async function loadBatchSnapshot(batchId, subjectId) {
  const container = document.getElementById('batch-snapshot-container');
  try {
    const res = await API.getBatchSnapshot(batchId, subjectId);
    const data = res.data;
    const batch = data.batch;
    const subject = data.subject;
    const stats = data.stats;

    container.innerHTML = `
      <div class="card" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
          <div>
            <h2 style="font-size: 1.3rem; margin-bottom: 4px;">${subject.name} - Batch Attendance Snapshot</h2>
            <div style="display: flex; gap: 8px; margin-top: 6px;">
              <span class="badge badge-info">Subject: ${subject.code}</span>
              <span class="badge badge-info">Division: ${batch.division_name}</span>
              <span class="badge badge-info">Batch: ${batch.batch_name}</span>
            </div>
          </div>
          <div>
            <a href="/attendance.html?subjectId=${subject.subject_id}&divisionId=${batch.division_id}&batchId=${batch.batch_id}" 
               class="btn btn-primary btn-sm">
              Take Today's Attendance
            </a>
          </div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card total">
          <span class="label">Total Students in Batch</span>
          <span class="value">${stats.totalStudents}</span>
        </div>
        <div class="summary-card total">
          <span class="label">Sessions Conducted</span>
          <span class="value">${stats.totalSessions}</span>
        </div>
        <div class="summary-card info">
          <span class="label">Batch Average Attendance</span>
          <span class="value">${stats.averagePercentage}%</span>
          <div class="progress-bar">
            <div class="progress-fill ${stats.averagePercentage >= 75 ? 'high' : 'low'}" style="width: ${Math.min(stats.averagePercentage, 100)}%;"></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Student-Wise Practical Attendance</h3>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th style="width: 60px;">#</th>
                <th>BT ID</th>
                <th>Student Name</th>
                <th>Present / Conducted</th>
                <th style="width: 200px;">Attendance %</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${stats.students.map((st, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td style="font-weight: 700; color: var(--primary-color);">${st.btId}</td>
                  <td style="font-weight: 600;">${st.name}</td>
                  <td>${st.present} / ${st.totalSessions} Sessions</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-weight: 700; width: 45px;">${st.percentage}%</span>
                      <div class="progress-bar" style="flex: 1; margin-top: 0;">
                        <div class="progress-fill ${st.percentage >= 75 ? 'high' : 'low'}" style="width: ${Math.min(st.percentage, 100)}%;"></div>
                      </div>
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <a href="/student-snapshot.html?studentId=${st.studentId}&subjectId=${subject.subject_id}" class="btn btn-secondary btn-sm">
                      View Student
                    </a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

  } catch (err) {
    console.error('Error loading batch snapshot:', err);
    container.innerHTML = `<div class="alert alert-danger">Failed to load batch snapshot: ${err.message}</div>`;
  }
}
