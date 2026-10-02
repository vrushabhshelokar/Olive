/* Sipna Practical Attendance System - Student Search & Directory Script */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('student-search-input');
  const resultsContainer = document.getElementById('students-results');

  if (searchInput) {
    // Initial search with empty or '24BT' to show demo students
    performSearch('');

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(e.target.value.trim());
      }, 250);
    });
  }

  async function performSearch(query) {
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `
      <div class="state-container">
        <div class="spinner"></div>
        <p style="margin-top: 10px;">Searching student records...</p>
      </div>
    `;

    try {
      const res = await API.searchStudents(query);
      const students = res.data;

      if (!students || students.length === 0) {
        resultsContainer.innerHTML = `
          <div class="card">
            <div class="state-container">
              <div class="icon">🔍</div>
              <h3>No Students Found</h3>
              <p>No student matching "${query}" was found in your assigned practical batches.</p>
            </div>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = `
        <div class="card">
          <div class="card-header">
            <h3>Matching Students (${students.length})</h3>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>BT ID</th>
                  <th>Student Name</th>
                  <th>Semester</th>
                  <th>Division</th>
                  <th>Batch</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(st => `
                  <tr>
                    <td style="font-weight: 700; color: var(--primary-color);">${st.bt_id}</td>
                    <td style="font-weight: 600;">${st.name}</td>
                    <td>Sem ${st.semester}</td>
                    <td><span class="badge badge-info">${st.division_name}</span></td>
                    <td><span class="badge badge-info">${st.batch_name}</span></td>
                    <td style="text-align: right;">
                      <a href="/student-snapshot.html?studentId=${st.student_id}" class="btn btn-secondary btn-sm">
                        📊 Student Snapshot
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
      console.error('Search failed:', err);
      resultsContainer.innerHTML = `<div class="alert alert-danger">Error searching students: ${err.message}</div>`;
    }
  }
});
