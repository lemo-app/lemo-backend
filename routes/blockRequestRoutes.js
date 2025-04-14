const express = require('express');
const blockRequestController = require('../controllers/blockRequestController');
const router = express.Router();

router.post('/', blockRequestController.createBlockRequest);
router.get('/:id', blockRequestController.getBlockRequestById);
router.put('/:id', blockRequestController.updateBlockRequest);
router.delete('/:id', blockRequestController.deleteBlockRequest);
router.get('/', blockRequestController.getAllBlockRequests);

module.exports = router;
