/* Sipna Practical Attendance System - My Practicals Script */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('practicals-container');
  if (!container) return;

  try {
    const res = await API.getAssignments();
    const assignments = res.data;

    if (!assignments || assignments.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="state-container">
            <div class="icon">📚</div>
            <h3>No Practical Assignments</h3>
            <p>You have not been assigned any practical lab batches yet.</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        ${assignments.map(a => `
          <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="badge badge-info">${a.subject_type}</span>
                <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Semester ${a.subject_semester}</span>
              </div>
              <h3 style="font-size: 1.15rem; margin-bottom: 6px;">${a.subject_name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Subject Code: ${a.subject_code}</p>
              
              <div style="background-color: var(--bg-color); padding: 12px; border-radius: var(--radius-md); display: flex; justify-content: space-around; text-align: center; margin-bottom: 18px;">
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Division</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${a.division_name}</div>
                </div>
                <div style="border-left: 1px solid var(--border-color);"></div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Batch</div>
                  <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color);">${a.batch_name}</div>
                </div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="/attendance.html?subjectId=${a.subject_id}&divisionId=${a.division_id}&batchId=${a.batch_id}" 
                 class="btn btn-primary" style="width: 100%;">
                 ⚡ Mark Practical Attendance
              </a>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <a href="/history.html?subjectId=${a.subject_id}&divisionId=${a.division_id}&batchId=${a.batch_id}" 
                   class="btn btn-secondary btn-sm">
                   📅 History
                </a>
                <a href="/batch-snapshot.html?batchId=${a.batch_id}&subjectId=${a.subject_id}" 
                   class="btn btn-secondary btn-sm">
                   📊 Snapshot
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } catch (err) {
    console.error('Error loading practical assignments:', err);
    container.innerHTML = `<div class="alert alert-danger">Failed to load practical assignments: ${err.message}</div>`;
  }
});
