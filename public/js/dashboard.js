/* Sipna Practical Attendance System - Faculty Dashboard Script */

document.addEventListener('DOMContentLoaded', async () => {
  const dateElem = document.getElementById('today-date');
  const greetingElem = document.getElementById('faculty-greeting');
  const practicalsListElem = document.getElementById('dashboard-practicals');

  if (dateElem) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElem.textContent = today.toLocaleDateString('en-US', options);
  }

  try {
    // 1. Get faculty profile
    const profileRes = await API.getProfile();
    const faculty = profileRes.data;
    if (greetingElem) {
      greetingElem.textContent = `Welcome, ${faculty.name}`;
    }

    // 2. Get faculty assignments
    const assignmentsRes = await API.getAssignments();
    const assignments = assignmentsRes.data;

    if (!practicalsListElem) return;

    if (!assignments || assignments.length === 0) {
      practicalsListElem.innerHTML = `
        <div class="state-container">
          <p>No practical assignments currently assigned to your account.</p>
        </div>
      `;
      return;
    }

    practicalsListElem.innerHTML = assignments.map(a => `
      <div class="card" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 4px;">
              ${a.subject_name} (${a.subject_code})
            </h3>
            <div style="display: flex; gap: 8px; margin-top: 6px;">
              <span class="badge badge-info">Division: ${a.division_name}</span>
              <span class="badge badge-info">Batch: ${a.batch_name}</span>
              <span class="badge badge-info">Sem ${a.subject_semester}</span>
            </div>
          </div>
          <div>
            <a href="/attendance.html?subjectId=${a.subject_id}&divisionId=${a.division_id}&batchId=${a.batch_id}" 
               class="btn btn-primary btn-sm">
              Take Attendance
            </a>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Failed loading dashboard data:', err);
    if (practicalsListElem) {
      practicalsListElem.innerHTML = `<div class="alert alert-danger">Error loading practical assignments.</div>`;
    }
  }
});
