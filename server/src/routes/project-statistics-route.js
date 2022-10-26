const express = require('express');
const router = express.Router();
const ProjectStatisticsController = require('../controllers/project-statistics-controller');

router.get('/:projectCode/counting-tasks', ProjectStatisticsController.findCountingTaskByProgressStatus);

module.exports = router;