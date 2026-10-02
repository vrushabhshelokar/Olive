const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/', requireAuth, (req, res, next) => attendanceController.create(req, res, next));
router.get('/history', requireAuth, (req, res, next) => attendanceController.getHistory(req, res, next));
router.get('/sessions/:sessionId', requireAuth, (req, res, next) => attendanceController.getSessionDetails(req, res, next));

module.exports = router;
