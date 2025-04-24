const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/me', userController.getUserProfile);
router.patch('/me', userController.updateUserProfile);
router.get('/all', userController.getAllUsers);
router.patch('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);
router.post('/forgot-password-request', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router; 