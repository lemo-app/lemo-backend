const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

router.get('/card-metrics', dashboardController.getCardMetrics);
router.get('/trends', dashboardController.getTrends);
router.get('/violations', dashboardController.getViolations);

module.exports = router;
