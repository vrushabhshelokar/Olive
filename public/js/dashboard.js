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

    // Group assignments by Subject
    const subjectsMap = {};
    assignments.forEach(a => {
      if (!subjectsMap[a.subject_id]) {
        subjectsMap[a.subject_id] = {
          subject_id: a.subject_id,
          subject_name: a.subject_name,
          subject_code: a.subject_code,
          division_name: a.division_name,
          semester: a.subject_semester,
          batches: []
        };
      }
      subjectsMap[a.subject_id].batches.push({
        batch_id: a.batch_id,
        batch_name: a.batch_name,
        division_id: a.division_id,
        student_count: a.student_count || 10
      });
    });

    const subjects = Object.values(subjectsMap);

    practicalsListElem.innerHTML = subjects.map(s => `
      <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--primary-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
          <div>
            <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 2px;">
              ${s.subject_name} (${s.subject_code})
            </h3>
            <span style="color: var(--text-muted); font-size: 0.85rem;">
              Division: <strong>${s.division_name}</strong> • Semester ${s.semester}
            </span>
          </div>
          <a href="/practicals.html?subjectId=${s.subject_id}" class="btn btn-secondary btn-sm">
            View All Batches →
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          ${s.batches.map(b => `
            <div style="background-color: var(--bg-color); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">Batch ${b.batch_name}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">${b.student_count} Students</div>
              </div>
              <a href="/attendance.html?subjectId=${s.subject_id}&divisionId=${b.division_id}&batchId=${b.batch_id}" 
                 class="btn btn-primary btn-sm" style="width: 100%; font-weight: 600;">
                Take Attendance
              </a>
            </div>
          `).join('')}
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
