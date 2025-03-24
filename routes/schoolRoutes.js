const express = require('express');
const schoolController = require('../controllers/schoolController');
const router = express.Router();

router.post('/create', schoolController.createSchool);
router.get('/:id', schoolController.getSchoolById);
router.put('/:id', schoolController.updateSchool);
router.delete('/:id', schoolController.deleteSchool);
router.post('/connect', schoolController.connectUserToSchool);
router.get('/generate-qr/:id', schoolController.generateQrCode);

module.exports = router; 