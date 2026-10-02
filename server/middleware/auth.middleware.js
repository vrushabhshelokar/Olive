function requireAuth(req, res, next) {
  if (!req.session || !req.session.faculty || !req.session.faculty.faculty_id) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required. Please log in.'
      }
    });
  }
  next();
}

module.exports = {
  requireAuth
};
