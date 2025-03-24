const express = require('express');
const sessionController = require('../controllers/sessionController');
const router = express.Router();

router.post('/create', sessionController.createSession);
router.get('/:id', sessionController.getSessionById);
router.put('/:id', sessionController.updateSession);
router.delete('/:id', sessionController.deleteSession);
router.patch('/:id', sessionController.patchSession);

module.exports = router; 