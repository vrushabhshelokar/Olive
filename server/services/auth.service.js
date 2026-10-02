const bcrypt = require('bcrypt');
const facultyRepo = require('../repositories/faculty.repository');

class AuthService {
  async registerFaculty({ facultyCode, name, email, department, designation, password }) {
    if (!facultyCode || !name || !email || !department || !designation || !password) {
      const err = new Error('All fields are required for faculty registration.');
      err.statusCode = 400;
      throw err;
    }

    const existingEmail = await facultyRepo.findByEmail(email);
    if (existingEmail) {
      const err = new Error('Email address is already registered.');
      err.statusCode = 409;
      throw err;
    }

    const existingCode = await facultyRepo.findByCode(facultyCode);
    if (existingCode) {
      const err = new Error('Faculty code is already registered.');
      err.statusCode = 409;
      throw err;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const faculty = await facultyRepo.create({
      facultyCode,
      name,
      email,
      department,
      designation,
      passwordHash
    });

    return faculty;
  }

  async loginFaculty({ email, password }) {
    if (!email || !password) {
      const err = new Error('Email and password are required.');
      err.statusCode = 400;
      throw err;
    }

    const faculty = await facultyRepo.findByEmail(email);
    if (!faculty) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, faculty.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    return {
      faculty_id: faculty.faculty_id,
      faculty_code: faculty.faculty_code,
      name: faculty.name,
      email: faculty.email,
      department: faculty.department,
      designation: faculty.designation
    };
  }
}

module.exports = new AuthService();
