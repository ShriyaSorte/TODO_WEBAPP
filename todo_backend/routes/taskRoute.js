const express = require("express");
const taskController = require("../controllers/taskController");
const { auth } = require("../middlewares/authorize");
const router = express.Router();

// POST
router.post("/createTask", auth, taskController.createTask);
router.post("/addCollaborator", auth, taskController.addCollaborator);
// GET
router.get("/getAllTasks", auth, taskController.getAllTasks);
router.get("/getTaskById/:id", auth, taskController.getTaskById);
router.get("/getFilteredTasks", auth, taskController.getFilteredTasks);
// UPDATE
router.put("/updateTask/:id", auth, taskController.updateTask);
// DELETE
router.delete("/deleteTask/:id", auth, taskController.deleteTask);

module.exports = router;

// http://localhost:4001/api/tasks/createTask
// http://localhost:4001/api/tasks/getAllTasks
// http://localhost:4001/api/tasks/getTaskById/66e68a8f30512a08e4e84d4c