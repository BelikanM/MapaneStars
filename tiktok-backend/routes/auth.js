const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/google-auth', authController.googleAuth);

module.exports = router;
