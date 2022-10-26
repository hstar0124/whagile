const express = require('express');
const router = express.Router();
const BacklogCommentController = require('../controllers/backlog-comment-controller');

router.get('/:backlogCode', BacklogCommentController.findBacklogComments);
router.post('/', BacklogCommentController.registComment);
router.put('/', BacklogCommentController.editComment);
router.delete('/', BacklogCommentController.removeComment);

module.exports = router;