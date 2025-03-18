const express = require('express');
const verificationController = require('../controllers/verificationController');
const router = express.Router();

router.get('/verify-email', verificationController.verifyEmail);

module.exports = router; 