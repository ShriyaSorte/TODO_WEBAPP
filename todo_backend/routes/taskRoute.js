const express = require("express");
const taskController = require("../controllers/taskController");
const { auth } = require("../middlewares/authorize");
const multer = require("multer");
const path = require("path");

// Set up multer storage configuration
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only certain file types
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true); // Accept file
    } else {
      cb(new Error("Error: File type not supported!")); // Reject file
    }
  },
});

const router = express.Router();

// Create Task Route
router.post(
  "/createTask",
  auth,
  upload.single("image"),
  taskController.createTask
);

// Add Collaborator Route
router.post("/addCollaborator", auth, taskController.addCollaborator);

// Get All Tasks Route
router.get("/getAllTasks", auth, taskController.getAllTasks);

// Get Task by ID Route
router.get("/getTaskById/:id", auth, taskController.getTaskById);

// Get Filtered Tasks Route
router.get("/getFilteredTasks", auth, taskController.getFilteredTasks);

// Update Task Route
router.put("/updateTask/:id", auth, taskController.updateTask);

// Delete Task Route
router.delete("/deleteTask/:id", auth, taskController.deleteTask);

// Get Today's Tasks Route
router.get("/getTodayTasks", auth, taskController.getTodayTasks);

module.exports = router;

// API Endpoint Examples
// POST: http://localhost:4001/api/tasks/createTask
// GET: http://localhost:4001/api/tasks/getAllTasks
// GET by ID: http://localhost:4001/api/tasks/getTaskById/66e68a8f30512a08e4e84d4c
