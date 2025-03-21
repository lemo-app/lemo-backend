const express = require('express');
const verificationController = require('../controllers/verificationController');
const router = express.Router();

router.post('/verify-email', verificationController.verifyEmail);

module.exports = router; 