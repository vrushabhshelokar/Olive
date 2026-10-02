const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academic.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/subjects', requireAuth, (req, res, next) => academicController.getSubjects(req, res, next));
router.get('/divisions', requireAuth, (req, res, next) => academicController.getDivisions(req, res, next));
router.get('/divisions/:divisionId/batches', requireAuth, (req, res, next) => academicController.getBatches(req, res, next));

module.exports = router;
