const express = require('express');
const fileController = require('../controllers/fileController');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post('/upload', upload.single('file'), fileController.uploadFile);

module.exports = router;
