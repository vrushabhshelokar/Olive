const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', (req, res, next) => authController.register(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.get('/session', (req, res, next) => authController.getSession(req, res, next));

module.exports = router;
