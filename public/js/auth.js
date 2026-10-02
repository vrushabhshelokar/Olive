/* Sipna Practical Attendance System - Authentication & Registration Script */

document.addEventListener('DOMContentLoaded', () => {
  // Login Form Handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errorAlert = document.getElementById('login-error');
      const submitBtn = document.getElementById('login-submit');

      errorAlert.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Logging in...';

      try {
        await API.login(email, password);
        window.location.href = '/dashboard.html';
      } catch (err) {
        errorAlert.textContent = err.message || 'Invalid email or password.';
        errorAlert.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login to System';
      }
    });
  }

  // Setup Form Handler
  const setupForm = document.getElementById('setup-form');
  if (setupForm) {
    setupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const facultyCode = document.getElementById('facultyCode').value.trim();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const department = document.getElementById('department').value.trim();
      const designation = document.getElementById('designation').value.trim();
      const password = document.getElementById('password').value;

      const errorAlert = document.getElementById('setup-error');
      const successAlert = document.getElementById('setup-success');
      const submitBtn = document.getElementById('setup-submit');

      errorAlert.style.display = 'none';
      successAlert.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      try {
        await API.register({
          facultyCode,
          name,
          email,
          department,
          designation,
          password
        });

        successAlert.textContent = 'Faculty account created successfully! Redirecting to login...';
        successAlert.style.display = 'block';
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
      } catch (err) {
        errorAlert.textContent = err.message || 'Account registration failed.';
        errorAlert.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Faculty Account';
      }
    });
  }
});
