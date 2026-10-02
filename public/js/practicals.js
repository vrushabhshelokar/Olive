/* Sipna Practical Attendance System - My Practicals Script */

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('practicals-container');
  const breadcrumbSub = document.getElementById('breadcrumb-subject');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const selectedSubjectId = urlParams.get('subjectId');

  try {
    const res = await API.getAssignments();
    const assignments = res.data;

    if (!assignments || assignments.length === 0) {
      container.innerHTML = `
        <div class="card">
          <div class="state-container">
            <div class="icon">📋</div>
            <h3>No Practical Assignments</h3>
            <p>You have not been assigned any practical lab batches yet.</p>
          </div>
        </div>
      `;
      return;
    }

    // Group assignments by Subject ID
    const subjectsMap = {};
    assignments.forEach(a => {
      if (!subjectsMap[a.subject_id]) {
        subjectsMap[a.subject_id] = {
          subject_id: a.subject_id,
          subject_name: a.subject_name,
          subject_code: a.subject_code,
          subject_type: a.subject_type,
          subject_semester: a.subject_semester,
          division_id: a.division_id,
          division_name: a.division_name,
          batches: []
        };
      }
      subjectsMap[a.subject_id].batches.push({
        batch_id: a.batch_id,
        batch_name: a.batch_name,
        student_count: a.student_count || 10
      });
    });

    const subjects = Object.values(subjectsMap);

    // If a specific subject ID is selected in URL or clicked
    if (selectedSubjectId && subjectsMap[selectedSubjectId]) {
      const selectedSubject = subjectsMap[selectedSubjectId];
      
      if (breadcrumbSub) {
        breadcrumbSub.style.display = 'inline';
        breadcrumbSub.innerHTML = ` <span class="sep">/</span> <span>${selectedSubject.subject_name}</span>`;
      }

      renderBatchSelectionView(container, selectedSubject, subjects);
    } else {
      // Top Level View: 3 Practical Lab Cards
      if (breadcrumbSub) {
        breadcrumbSub.style.display = 'none';
      }
      renderPracticalsOverview(container, subjects);
    }

  } catch (err) {
    console.error('Error loading practical assignments:', err);
    container.innerHTML = `<div class="alert alert-danger">Failed to load practical assignments: ${err.message}</div>`;
  }
});

/**
 * Render Top-Level Overview showing the 3 Practical Labs
 */
function renderPracticalsOverview(container, subjects) {
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
      ${subjects.map(s => `
        <div class="card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--primary-color);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <span class="badge badge-info">${s.subject_type}</span>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted);">Sem ${s.subject_semester}</span>
            </div>
            <h3 style="font-size: 1.25rem; margin-bottom: 6px; color: var(--text-primary);">${s.subject_name}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Code: <strong>${s.subject_code}</strong> | Division: <strong>${s.division_name}</strong></p>
            
            <div style="background-color: var(--bg-color); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px;">Available Batches:</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${s.batches.map(b => `
                  <span class="badge" style="background: #e2e8f0; color: #1e293b; font-weight: 600; padding: 4px 10px;">
                    ${b.batch_name} (${b.student_count} Students)
                  </span>
                `).join('')}
              </div>
            </div>
          </div>

          <div>
            <a href="/practicals.html?subjectId=${s.subject_id}" 
               class="btn btn-primary" style="width: 100%; font-size: 0.95rem; font-weight: 600;">
               Open Practical Batches →
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render Selected Practical Lab View showing its 3 Batch cards (B1, B2, B3)
 */
function renderBatchSelectionView(container, subject, allSubjects) {
  container.innerHTML = `
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
      <div>
        <a href="/practicals.html" class="btn btn-secondary btn-sm" style="margin-bottom: 8px;">
          ← Back to All Practicals
        </a>
        <h2 style="font-size: 1.4rem; color: var(--text-primary); margin-top: 4px;">
          ${subject.subject_name} (${subject.subject_code})
        </h2>
        <p style="color: var(--text-muted); font-size: 0.88rem;">
          Division: <strong>${subject.division_name}</strong> • Semester ${subject.subject_semester}
        </p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
      ${subject.batches.map(b => `
        <div class="card" style="margin-bottom: 0; border: 1px solid var(--border-color); text-align: center; padding: 28px 20px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="width: 56px; height: 56px; border-radius: 50%; background: #eff6ff; color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800; margin: 0 auto 12px auto;">
              ${b.batch_name}
            </div>
            <h3 style="font-size: 1.3rem; margin-bottom: 4px;">Batch ${b.batch_name}</h3>
            <p style="color: var(--text-muted); font-weight: 600; font-size: 0.95rem; margin-bottom: 20px;">
              ${b.student_count} Students
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <a href="/attendance.html?subjectId=${subject.subject_id}&divisionId=${subject.division_id}&batchId=${b.batch_id}" 
               class="btn btn-primary" style="width: 100%; padding: 11px; font-weight: 700;">
               Take Attendance
            </a>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <a href="/history.html?subjectId=${subject.subject_id}&divisionId=${subject.division_id}&batchId=${b.batch_id}" 
                 class="btn btn-secondary btn-sm">
                 History
              </a>
              <a href="/batch-snapshot.html?batchId=${b.batch_id}&subjectId=${subject.subject_id}" 
                 class="btn btn-secondary btn-sm">
                 Snapshot
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
