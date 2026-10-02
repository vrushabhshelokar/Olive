const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/search', requireAuth, (req, res, next) => studentController.searchStudents(req, res, next));
router.get('/batch/:batchId', requireAuth, (req, res, next) => studentController.getBatchStudents(req, res, next));
router.get('/:id', requireAuth, (req, res, next) => studentController.getStudentById(req, res, next));

module.exports = router;
