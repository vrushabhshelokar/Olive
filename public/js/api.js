/* Sipna Practical Attendance System - Centralized API Client */

const API = {
  async request(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(endpoint, config);
      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = (data.error && data.error.message) ? data.error.message : 'An error occurred while communicating with the server.';
        const err = new Error(errorMsg);
        err.status = response.status;
        err.payload = data.error || {};
        throw err;
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
      throw err;
    }
  },

  // Auth endpoints
  login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register(facultyData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(facultyData)
    });
  },

  logout() {
    return this.request('/api/auth/logout', {
      method: 'POST'
    });
  },

  getSession() {
    return this.request('/api/auth/session');
  },

  // Faculty endpoints
  getProfile() {
    return this.request('/api/faculty/me');
  },

  getAssignments() {
    return this.request('/api/faculty/me/assignments');
  },

  // Academic endpoints
  getSubjects() {
    return this.request('/api/subjects');
  },

  getDivisions() {
    return this.request('/api/divisions');
  },

  getBatches(divisionId) {
    return this.request(`/api/divisions/${divisionId}/batches`);
  },

  // Student endpoints
  getBatchStudents(batchId) {
    return this.request(`/api/students/batch/${batchId}`);
  },

  searchStudents(queryStr) {
    return this.request(`/api/students/search?q=${encodeURIComponent(queryStr)}`);
  },

  getStudentById(id) {
    return this.request(`/api/students/${id}`);
  },

  // Attendance endpoints
  submitAttendance(payload) {
    return this.request('/api/attendance', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getHistory(subjectId, divisionId, batchId) {
    return this.request(`/api/attendance/history?subjectId=${subjectId}&divisionId=${divisionId}&batchId=${batchId}`);
  },

  getSessionDetails(sessionId) {
    return this.request(`/api/attendance/sessions/${sessionId}`);
  },

  // Snapshot endpoints
  getStudentSnapshot(studentId, subjectId) {
    const url = subjectId 
      ? `/api/snapshots/student/${studentId}?subjectId=${subjectId}`
      : `/api/snapshots/student/${studentId}`;
    return this.request(url);
  },

  getBatchSnapshot(batchId, subjectId) {
    return this.request(`/api/snapshots/batch/${batchId}?subjectId=${subjectId}`);
  }
};
