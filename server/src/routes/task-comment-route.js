const express = require("express");
const router = express.Router();
const TaskCommentController = require("../controllers/task-comment-controller");

router.get("/:taskCode", TaskCommentController.findTaskAllComments);
router.post("/", TaskCommentController.createTaskComment);
router.put("/", TaskCommentController.updateTaskComment);
router.delete("/", TaskCommentController.deleteTaskComment);

module.exports = router;
