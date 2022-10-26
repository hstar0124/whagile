const express = require("express");
const router = express.Router();

const TasksController = require("../controllers/tasks-controller");

router.get("/", TasksController.findAllTasks);
router.get("/onTask", TasksController.findTasksOnGoingSprint);
router.get("/sprint", TasksController.findSprint);
router.get("/history", TasksController.findAllTaskHistory);
router.get("/:taskCode", TasksController.findTaskByTaskCode);
router.post("/", TasksController.registNewTask);
router.put("/", TasksController.editTask);
router.put("/date", TasksController.editTaskDate);
router.delete("/", TasksController.removeTask);

module.exports = router;
