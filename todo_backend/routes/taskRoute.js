const express = require("express");
const taskController = require("../controllers/taskController");
const { auth } = require("../middlewares/authorize");
const upload = require("../middlewares/multer");
const router = express.Router();

router.post(
  "/createTask",
  auth,
  upload.single("image"),
  taskController.createTask
);

router.post("/addCollaborator", auth, taskController.addCollaborator);

router.get("/getAllTasks", auth, taskController.getAllTasks);

router.get("/getTaskById/:id", auth, taskController.getTaskById);

router.get("/getFilteredTasks", auth, taskController.getFilteredTasks);

router.put("/updateTask/:id", auth, taskController.updateTask);

router.delete("/deleteTask/:id", auth, taskController.deleteTask);

router.get("/getTodayTasks", auth, taskController.getTodayTasks);

module.exports = router;

// API Endpoint Examples
// POST: http://localhost:4001/api/tasks/createTask
// GET: http://localhost:4001/api/tasks/getAllTasks
// GET by ID: http://localhost:4001/api/tasks/getTaskById/66e68a8f30512a08e4e84d4c
