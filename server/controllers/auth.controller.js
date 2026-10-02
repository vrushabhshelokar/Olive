const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const faculty = await authService.registerFaculty(req.body);
      res.status(201).json({
        success: true,
        data: faculty
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const faculty = await authService.loginFaculty(req.body);
      req.session.faculty = faculty;
      res.status(200).json({
        success: true,
        data: faculty
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully.' }
      });
    });
  }

  async getSession(req, res) {
    if (req.session && req.session.faculty) {
      return res.status(200).json({
        success: true,
        authenticated: true,
        data: req.session.faculty
      });
    }
    return res.status(200).json({
      success: true,
      authenticated: false,
      data: null
    });
  }
}

module.exports = new AuthController();
