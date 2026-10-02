const express = require('express');
const router = express.Router();
const snapshotController = require('../controllers/snapshot.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/student/:studentId', requireAuth, (req, res, next) => snapshotController.getStudentSnapshot(req, res, next));
router.get('/batch/:batchId', requireAuth, (req, res, next) => snapshotController.getBatchSnapshot(req, res, next));

module.exports = router;
