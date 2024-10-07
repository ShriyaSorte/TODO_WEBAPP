const express = require("express");
const taskController = require("../controllers/taskController");
const { auth } = require("../middlewares/authorize");
const multer = require("multer");

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Change the 'uploads/' path as needed

const router = express.Router();

// POST
// Use multer to handle file uploads for createTask
router.post("/createTask", auth, upload.single('image'), taskController.createTask);
router.post("/addCollaborator", auth, taskController.addCollaborator);

// GET
router.get("/getAllTasks", auth, taskController.getAllTasks);
router.get("/getTaskById/:id", auth, taskController.getTaskById);
router.get("/getFilteredTasks", auth, taskController.getFilteredTasks);

// UPDATE
router.put("/updateTask/:id", auth, taskController.updateTask);

// DELETE
router.delete("/deleteTask/:id", auth, taskController.deleteTask);

// Additional endpoint for getting today's tasks
router.get("/getTodayTasks", auth, taskController.getTodayTasks);

module.exports = router;

// API Endpoint Examples
// POST: http://localhost:4001/api/tasks/createTask
// GET: http://localhost:4001/api/tasks/getAllTasks
// GET by ID: http://localhost:4001/api/tasks/getTaskById/66e68a8f30512a08e4e84d4c
