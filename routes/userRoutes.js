const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/me', userController.getUserProfile);
router.patch('/me', userController.updateUserProfile);
router.get('/all', userController.getAllUsers);
router.patch('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);

module.exports = router; 