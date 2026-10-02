/* Sipna Practical Attendance System - App Layout & Session Script */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Check session state unless on login or setup page
  const currentPath = window.location.pathname;
  const isPublicPage = currentPath.endsWith('login.html') || currentPath.endsWith('setup.html');

  try {
    const sessionRes = await API.getSession();
    
    if (!sessionRes.authenticated) {
      if (!isPublicPage) {
        window.location.href = '/login.html';
        return;
      }
    } else {
      // User is logged in
      const faculty = sessionRes.data;
      
      // Update header faculty profile display
      const userNameElem = document.getElementById('header-user-name');
      const userRoleElem = document.getElementById('header-user-role');
      if (userNameElem) userNameElem.textContent = faculty.name;
      if (userRoleElem) userRoleElem.textContent = `${faculty.designation} (${faculty.faculty_code})`;

      if (isPublicPage) {
        window.location.href = '/dashboard.html';
        return;
      }
    }
  } catch (err) {
    console.error('Session check failed:', err);
    if (!isPublicPage) {
      window.location.href = '/login.html';
    }
  }

  // 2. Setup Logout Button event listener
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await API.logout();
        window.location.href = '/login.html';
      } catch (err) {
        alert('Logout failed: ' + err.message);
      }
    });
  }

  // 3. Highlight current active navigation item
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });
});
