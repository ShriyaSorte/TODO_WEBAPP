const express = require("express");
const taskController = require("../controllers/taskController");
const { auth } = require("../middlewares/authorize");
const router = express.Router();

router.post("/createTask", auth, taskController.createTask);

router.get("/getUserTasks", auth, taskController.getUserTasks);

module.exports = router;

// http://localhost:4001/api/tasks/createTask
// http://localhost:4001/api/tasks/getUserTasks