/* Sipna Practical Attendance System - History Controller Script */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const subjectId = params.get('subjectId');
  const divisionId = params.get('divisionId');
  const batchId = params.get('batchId');

  const container = document.getElementById('history-container');
  const breadcrumbsElem = document.getElementById('breadcrumbs-area');
  const headerElem = document.getElementById('context-header-area');

  if (!subjectId || !divisionId || !batchId) {
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger">
          Please select a practical batch from <a href="/practicals.html">My Practicals</a> to view attendance history.
        </div>
      `;
    }
    return;
  }

  try {
    // 1. Verify access & get context metadata
    const assignmentsRes = await API.getAssignments();
    const assignment = assignmentsRes.data.find(a =>
      a.subject_id == subjectId && a.division_id == divisionId && a.batch_id == batchId
    );

    if (!assignment) {
      container.innerHTML = `<div class="alert alert-danger">Unauthorized access to history.</div>`;
      return;
    }

    if (breadcrumbsElem) {
      breadcrumbsElem.innerHTML = `
        <a href="/dashboard.html">Dashboard</a> <span class="sep">/</span>
        <a href="/practicals.html">My Practicals</a> <span class="sep">/</span>
        <span>${assignment.subject_code}</span> <span class="sep">/</span>
        <span>${assignment.division_name}</span> <span class="sep">/</span>
        <span>${assignment.batch_name}</span> <span class="sep">/</span>
        <span>Attendance History</span>
      `;
    }

    if (headerElem) {
      headerElem.innerHTML = `
        <div class="context-header">
          <div class="context-title">${assignment.subject_name} - Attendance History</div>
          <div class="context-tags">
            <span class="context-tag">Subject: ${assignment.subject_code}</span>
            <span class="context-tag">Division: ${assignment.division_name}</span>
            <span class="context-tag">Batch: ${assignment.batch_name}</span>
          </div>
        </div>
      `;
    }

    // 2. Fetch History list from Backend
    const historyRes = await API.getHistory(subjectId, divisionId, batchId);
    const sessions = historyRes.data;

    if (!sessions || sessions.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="state-container">
            <div class="icon">📅</div>
            <h3>No Attendance History Found</h3>
            <p>No practical attendance sessions have been submitted yet for ${assignment.subject_code} (${assignment.division_name} - ${assignment.batch_name}).</p>
            <div style="margin-top: 16px;">
              <a href="/attendance.html?subjectId=${subjectId}&divisionId=${divisionId}&batchId=${batchId}" class="btn btn-primary">
                Take Today's Attendance
              </a>
            </div>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3>Past Practical Sessions (${sessions.length})</h3>
          <a href="/attendance.html?subjectId=${subjectId}&divisionId=${divisionId}&batchId=${batchId}" class="btn btn-primary btn-sm">
            Take Today's Attendance
          </a>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Session Date</th>
                <th>Description / Topic</th>
                <th>Total Students</th>
                <th>Present</th>
                <th>Absent</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${sessions.map(s => {
                const fDate = new Date(s.session_date).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                });
                return `
                  <tr>
                    <td style="font-weight: 700;">${fDate}</td>
                    <td>${s.description || 'Regular Practical Session'}</td>
                    <td>${s.total_students}</td>
                    <td><span class="badge badge-present">${s.present_count} Present</span></td>
                    <td><span class="badge badge-absent">${s.absent_count} Absent</span></td>
                    <td style="text-align: right;">
                      <button class="btn btn-secondary btn-sm view-session-btn" data-id="${s.session_id}">
                        👁️ View Snapshot
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div id="session-modal-area"></div>
    `;

    // Attach click listeners for View Snapshot
    document.querySelectorAll('.view-session-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const sId = e.target.getAttribute('data-id');
        await showSessionDetailsModal(sId);
      });
    });

  } catch (err) {
    console.error('Error loading history:', err);
    container.innerHTML = `<div class="alert alert-danger">Error loading history: ${err.message}</div>`;
  }
});

async function showSessionDetailsModal(sessionId) {
  const modalArea = document.getElementById('session-modal-area');
  if (!modalArea) return;

  try {
    const detailsRes = await API.getSessionDetails(sessionId);
    const details = detailsRes.data;

    const fDate = new Date(details.session.session_date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    modalArea.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;">
        <div style="background: #ffffff; width: 100%; max-width: 700px; max-height: 90vh; border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden; box-shadow: var(--shadow-lg);">
          
          <div style="padding: 20px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background-color: #f8fafc;">
            <div>
              <h3 style="margin-bottom: 2px;">Session Attendance Snapshot</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted);">${details.session.subject_name} (${details.session.division_name} - ${details.session.batch_name}) | ${fDate}</p>
            </div>
            <button id="close-modal-btn" class="btn btn-secondary btn-sm" style="font-size: 1.1rem; padding: 4px 10px;">✕</button>
          </div>

          <div style="padding: 20px 24px; overflow-y: auto;">
            <div style="display: flex; gap: 12px; margin-bottom: 20px;">
              <span class="badge badge-info">Total: ${details.totalStudents}</span>
              <span class="badge badge-present">Present: ${details.presentCount}</span>
              <span class="badge badge-absent">Absent: ${details.absentCount}</span>
            </div>

            ${details.session.description ? `<p style="font-size: 0.9rem; margin-bottom: 16px; padding: 10px; background: #f1f5f9; border-radius: 6px;"><strong>Topic:</strong> ${details.session.description}</p>` : ''}

            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>BT ID</th>
                  <th>Student Name</th>
                  <th style="text-align: right;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${details.attendance.map((st, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td style="font-weight: 700;">${st.bt_id}</td>
                    <td>${st.student_name}</td>
                    <td style="text-align: right;">
                      <span class="badge ${st.status === 'PRESENT' ? 'badge-present' : 'badge-absent'}">
                        ${st.status === 'PRESENT' ? '✓ PRESENT' : '✕ ABSENT'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="padding: 16px 24px; border-top: 1px solid var(--border-color); text-align: right; background-color: #f8fafc;">
            <button id="close-modal-bottom" class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    `;

    const closeModal = () => { modalArea.innerHTML = ''; };
    document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
    document.getElementById('close-modal-bottom')?.addEventListener('click', closeModal);

  } catch (err) {
    alert('Failed to load session snapshot: ' + err.message);
  }
}
