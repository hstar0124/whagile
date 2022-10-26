const express = require('express');
const router = express.Router();
const AdminStatisticsController = require('../controllers/admin-statistics-controller');

router.get('/', AdminStatisticsController.viewCounts);
router.get('/chart', AdminStatisticsController.viewChartCounts);

module.exports = router;