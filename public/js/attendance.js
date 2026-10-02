/* Sipna Practical Attendance System - Attendance Controller Script */

let attendanceState = {
  subjectId: null,
  divisionId: null,
  batchId: null,
  facultyId: null,
  subject: null,
  division: null,
  batch: null,
  students: [],
  attendanceMap: {}, // studentId -> 'PRESENT' | 'ABSENT'
  isCompleted: false,
  draftKey: ''
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  attendanceState.subjectId = params.get('subjectId');
  attendanceState.divisionId = params.get('divisionId');
  attendanceState.batchId = params.get('batchId');

  const container = document.getElementById('attendance-container');

  if (!attendanceState.subjectId || !attendanceState.divisionId || !attendanceState.batchId) {
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger">
          Invalid practical selection. Please select a practical from <a href="/practicals.html">My Practicals</a>.
        </div>
      `;
    }
    return;
  }

  try {
    // 1. Check faculty session
    const sessionRes = await API.getSession();
    if (!sessionRes.authenticated) {
      window.location.href = '/login.html';
      return;
    }
    attendanceState.facultyId = sessionRes.data.faculty_id;
    attendanceState.draftKey = `draft_${attendanceState.facultyId}_${attendanceState.subjectId}_${attendanceState.divisionId}_${attendanceState.batchId}`;

    // 2. Fetch Faculty Assignments to verify & get context names
    const assignmentsRes = await API.getAssignments();
    const assignment = assignmentsRes.data.find(a =>
      a.subject_id == attendanceState.subjectId &&
      a.division_id == attendanceState.divisionId &&
      a.batch_id == attendanceState.batchId
    );

    if (!assignment) {
      container.innerHTML = `
        <div class="alert alert-danger">
          Unauthorized: You are not assigned to this practical context.
        </div>
      `;
      return;
    }

    attendanceState.subject = { id: assignment.subject_id, name: assignment.subject_name, code: assignment.subject_code };
    attendanceState.division = { id: assignment.division_id, name: assignment.division_name };
    attendanceState.batch = { id: assignment.batch_id, name: assignment.batch_name };

    // 3. Render Breadcrumbs & Context Header
    renderContextHeader();

    // 4. Check if today's attendance has already been submitted
    const todayStr = new Date().toISOString().split('T')[0];
    const historyRes = await API.getHistory(attendanceState.subjectId, attendanceState.divisionId, attendanceState.batchId);
    const existingTodaySession = historyRes.data.find(h => {
      const hDate = new Date(h.session_date).toISOString().split('T')[0];
      return hDate === todayStr;
    });

    if (existingTodaySession) {
      // Session already submitted for today! Render completed read-only view
      attendanceState.isCompleted = true;
      const detailsRes = await API.getSessionDetails(existingTodaySession.session_id);
      renderCompletedView(detailsRes.data);
      return;
    }

    // 5. Fetch Batch Students
    const studentsRes = await API.getBatchStudents(attendanceState.batchId);
    attendanceState.students = studentsRes.data;

    // 6. Default all students to ABSENT
    attendanceState.students.forEach(st => {
      attendanceState.attendanceMap[st.student_id] = 'ABSENT';
    });

    // 7. Check if a local draft exists in localStorage
    const savedDraft = localStorage.getItem(attendanceState.draftKey);
    let draftData = null;
    if (savedDraft) {
      try {
        draftData = JSON.parse(savedDraft);
      } catch (e) { draftData = null; }
    }

    // 8. Render Main Attendance UI
    renderAttendanceForm();

    if (draftData && draftData.attendanceMap) {
      showDraftBanner(draftData);
    }

  } catch (err) {
    console.error('Failed initializing attendance page:', err);
    if (container) {
      container.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
    }
  }
});

function renderContextHeader() {
  const headerElem = document.getElementById('context-header-area');
  const breadcrumbElem = document.getElementById('breadcrumbs-area');
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (breadcrumbElem) {
    breadcrumbElem.innerHTML = `
      <a href="/dashboard.html">Dashboard</a> <span class="sep">/</span>
      <a href="/practicals.html">My Practicals</a> <span class="sep">/</span>
      <a href="/practicals.html?subjectId=${attendanceState.subject.id}">${attendanceState.subject.code}</a> <span class="sep">/</span>
      <span>${attendanceState.batch.name}</span> <span class="sep">/</span>
      <span>Take Attendance</span>
    `;
  }

  if (headerElem) {
    headerElem.innerHTML = `
      <div class="context-header" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; padding: 20px 24px; border-radius: var(--radius-lg); margin-bottom: 24px;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; color:white; ">${attendanceState.subject.name}</h2>
        <div style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 12px;">Date: <strong>${todayStr}</strong></div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <span class="badge" style="background: #3b82f6; color: #fff;">Division: ${attendanceState.division.name}</span>
          <span class="badge" style="background: #10b981; color: #fff;">Batch: ${attendanceState.batch.name}</span>
          <span class="badge" style="background: #6366f1; color: #fff;">Subject: ${attendanceState.subject.code}</span>
        </div>
      </div>
    `;
  }
}

function renderAttendanceForm() {
  const container = document.getElementById('attendance-container');
  if (!container) return;

  container.innerHTML = `
    <div id="draft-banner-area"></div>

    <div class="summary-grid">
      <div class="summary-card total">
        <span class="label">Total Students</span>
        <span class="value" id="count-total">${attendanceState.students.length}</span>
      </div>
      <div class="summary-card present">
        <span class="label">Present</span>
        <span class="value" id="count-present">0</span>
      </div>
      <div class="summary-card absent">
        <span class="label">Absent</span>
        <span class="value" id="count-absent">${attendanceState.students.length}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div style="display: flex; gap: 12px; align-items: center; width: 100%; max-width: 400px;">
          <input type="text" id="search-student" class="form-control" placeholder="Search by BT ID or Name...">
        </div>
        <div style="display: flex; gap: 12px;">
          <button id="mark-all-present" class="btn btn-secondary btn-sm">Mark All Present</button>
          <button id="mark-all-absent" class="btn btn-secondary btn-sm">Mark All Absent</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 60px;">#</th>
              <th style="width: 140px;">BT ID</th>
              <th>Student Name</th>
              <th style="text-align: right; padding-right: 24px;">Attendance Status</th>
            </tr>
          </thead>
          <tbody id="student-table-body">
            ${attendanceState.students.map((st, idx) => `
              <tr data-search="${st.bt_id.toLowerCase()} ${st.name.toLowerCase()}">
                <td>${idx + 1}</td>
                <td style="font-weight: 700; color: var(--primary-color);">${st.bt_id}</td>
                <td style="font-weight: 500; color: var(--text-primary);">${st.name}</td>
                <td style="text-align: right;">
                  <button class="status-toggle absent" data-id="${st.student_id}">
                    ✗ ABSENT
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <div style="width: 100%; max-width: 400px;">
          <input type="text" id="session-description" class="form-control" placeholder="Optional session topic (e.g. DBMS Lab Experiment 1)">
        </div>
        <button id="save-attendance-btn" class="btn btn-primary" style="padding: 12px 28px; font-size: 1rem; font-weight: 700;">
          💾 Save Practical Attendance
        </button>
      </div>
    </div>
  `;

  // Attach Event Listeners
  attachFormEvents();
  updateSummaryCounts();
}

function attachFormEvents() {
  const tbody = document.getElementById('student-table-body');
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.status-toggle');
      if (toggleBtn) {
        const studentId = toggleBtn.getAttribute('data-id');
        toggleStudentStatus(studentId, toggleBtn);
      }
    });
  }

  // Search filter
  const searchInput = document.getElementById('search-student');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#student-table-body tr');
      rows.forEach(row => {
        const searchText = row.getAttribute('data-search');
        if (searchText.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Mark All Present / Absent
  document.getElementById('mark-all-present')?.addEventListener('click', () => {
    attendanceState.students.forEach(st => {
      attendanceState.attendanceMap[st.student_id] = 'PRESENT';
    });
    updateAllToggleButtons();
    updateSummaryCounts();
    autoSaveDraft();
  });

  document.getElementById('mark-all-absent')?.addEventListener('click', () => {
    attendanceState.students.forEach(st => {
      attendanceState.attendanceMap[st.student_id] = 'ABSENT';
    });
    updateAllToggleButtons();
    updateSummaryCounts();
    autoSaveDraft();
  });

  // Save Attendance Button
  document.getElementById('save-attendance-btn')?.addEventListener('click', submitAttendance);
}

function toggleStudentStatus(studentId, buttonElem) {
  const current = attendanceState.attendanceMap[studentId] || 'ABSENT';
  const next = current === 'ABSENT' ? 'PRESENT' : 'ABSENT';
  attendanceState.attendanceMap[studentId] = next;

  if (next === 'PRESENT') {
    buttonElem.className = 'status-toggle present';
    buttonElem.innerHTML = '✓ PRESENT';
  } else {
    buttonElem.className = 'status-toggle absent';
    buttonElem.innerHTML = '✗ ABSENT';
  }

  updateSummaryCounts();
  autoSaveDraft();
}

function updateAllToggleButtons() {
  const buttons = document.querySelectorAll('.status-toggle');
  buttons.forEach(btn => {
    const sId = btn.getAttribute('data-id');
    const status = attendanceState.attendanceMap[sId] || 'ABSENT';
    if (status === 'PRESENT') {
      btn.className = 'status-toggle present';
      btn.innerHTML = '✓ PRESENT';
    } else {
      btn.className = 'status-toggle absent';
      btn.innerHTML = '✗ ABSENT';
    }
  });
}

function updateSummaryCounts() {
  const total = attendanceState.students.length;
  let present = 0;
  Object.values(attendanceState.attendanceMap).forEach(val => {
    if (val === 'PRESENT') present++;
  });
  const absent = total - present;

  document.getElementById('count-total').textContent = total;
  document.getElementById('count-present').textContent = present;
  document.getElementById('count-absent').textContent = absent;
}

function autoSaveDraft() {
  const draft = {
    timestamp: new Date().toISOString(),
    attendanceMap: attendanceState.attendanceMap,
    description: document.getElementById('session-description')?.value || ''
  };
  localStorage.setItem(attendanceState.draftKey, JSON.stringify(draft));
}

function showDraftBanner(draftData) {
  const bannerArea = document.getElementById('draft-banner-area');
  if (!bannerArea) return;

  const savedTime = new Date(draftData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  bannerArea.innerHTML = `
    <div class="draft-banner">
      <div>
        <strong>Unsaved Draft Found:</strong> You have an unsaved attendance draft from ${savedTime}.
      </div>
      <div class="draft-actions">
        <button id="restore-draft-btn" class="btn btn-primary btn-sm">Restore Draft</button>
        <button id="discard-draft-btn" class="btn btn-secondary btn-sm">Discard Draft</button>
      </div>
    </div>
  `;

  document.getElementById('restore-draft-btn')?.addEventListener('click', () => {
    attendanceState.attendanceMap = draftData.attendanceMap;
    const descInput = document.getElementById('session-description');
    if (descInput && draftData.description) descInput.value = draftData.description;
    updateAllToggleButtons();
    updateSummaryCounts();
    bannerArea.innerHTML = `<div class="alert alert-success">Draft restored successfully!</div>`;
    setTimeout(() => { bannerArea.innerHTML = ''; }, 2000);
  });

  document.getElementById('discard-draft-btn')?.addEventListener('click', () => {
    localStorage.removeItem(attendanceState.draftKey);
    bannerArea.innerHTML = '';
  });
}

async function submitAttendance() {
  const saveBtn = document.getElementById('save-attendance-btn');
  const descInput = document.getElementById('session-description');
  
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span class="spinner" style="width: 16px; height: 16px;"></span> Saving...`;

  const attendancePayload = Object.entries(attendanceState.attendanceMap).map(([studentId, status]) => ({
    studentId: parseInt(studentId, 10),
    status
  }));

  try {
    const res = await API.submitAttendance({
      subjectId: parseInt(attendanceState.subjectId, 10),
      divisionId: parseInt(attendanceState.divisionId, 10),
      batchId: parseInt(attendanceState.batchId, 10),
      attendance: attendancePayload,
      description: descInput ? descInput.value.trim() : ''
    });

    // Success! Clear draft
    localStorage.removeItem(attendanceState.draftKey);
    attendanceState.isCompleted = true;

    // Fetch complete session details to render read-only state
    const detailsRes = await API.getSessionDetails(res.data.sessionId);
    renderCompletedView(detailsRes.data);

  } catch (err) {
    console.error('Submission failed:', err);
    saveBtn.disabled = false;
    saveBtn.innerHTML = `💾 Save Practical Attendance`;

    if (err.status === 409) {
      alert(`Attendance Already Submitted: ${err.message}`);
      window.location.reload();
    } else {
      alert(`Submission failed: ${err.message}. Your draft has been safely preserved.`);
    }
  }
}

function renderCompletedView(sessionDetails) {
  const container = document.getElementById('attendance-container');
  if (!container) return;

  const formattedDate = new Date(sessionDetails.session.session_date).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  container.innerHTML = `
    <div class="alert alert-success" style="padding: 16px 20px; font-weight: 600;">
      ✓ Practical Attendance Completed and Saved to PostgreSQL (Read-Only)
    </div>

    <div class="summary-grid">
      <div class="summary-card total">
        <span class="label">Total Students</span>
        <span class="value">${sessionDetails.totalStudents}</span>
      </div>
      <div class="summary-card present">
        <span class="label">Present</span>
        <span class="value">${sessionDetails.presentCount}</span>
      </div>
      <div class="summary-card absent">
        <span class="label">Absent</span>
        <span class="value">${sessionDetails.absentCount}</span>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div>
          <h3>Attendance Record for ${formattedDate}</h3>
          ${sessionDetails.session.description ? `<p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">Topic: ${sessionDetails.session.description}</p>` : ''}
        </div>
        <div style="display: flex; gap: 10px;">
          <a href="/history.html?subjectId=${attendanceState.subjectId}&divisionId=${attendanceState.divisionId}&batchId=${attendanceState.batchId}" class="btn btn-secondary btn-sm">
            View History
          </a>
          <a href="/batch-snapshot.html?batchId=${attendanceState.batchId}&subjectId=${attendanceState.subjectId}" class="btn btn-secondary btn-sm">
            Batch Snapshot
          </a>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th style="width: 80px;">#</th>
              <th>BT ID</th>
              <th>Student Name</th>
              <th style="text-align: right; padding-right: 24px;">Recorded Status</th>
            </tr>
          </thead>
          <tbody>
            ${sessionDetails.attendance.map((st, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td style="font-weight: 700;">${st.bt_id}</td>
                <td>${st.student_name}</td>
                <td style="text-align: right;">
                  <span class="badge ${st.status === 'PRESENT' ? 'badge-present' : 'badge-absent'}">
                    ${st.status === 'PRESENT' ? '✓ PRESENT' : '✗ ABSENT'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
