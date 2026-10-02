const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/me', requireAuth, (req, res, next) => facultyController.getMe(req, res, next));
router.get('/me/assignments', requireAuth, (req, res, next) => facultyController.getAssignments(req, res, next));

module.exports = router;
