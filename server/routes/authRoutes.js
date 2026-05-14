const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// URL akan menjadi: /api/auth/register dan /api/auth/login
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;