const express = require('express');
const router = express.Router();

const BacklogController = require('../controllers/backlog-controller');

router.get('/', BacklogController.findAllBacklogs);
router.get('/histories', BacklogController.findBacklogHistories);
router.get('/:backlogCode', BacklogController.findBacklogsByBacklogCode);
router.post('/', BacklogController.registNewBacklog);
router.put('/', BacklogController.editBacklog);
router.delete('/', BacklogController.removeBacklog);

module.exports = router;