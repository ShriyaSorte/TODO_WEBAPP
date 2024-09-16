const express = require("express");
const { auth } = require("../middlewares/authorize");
const priorityController = require("../controllers/priorityController");
const router = express.Router();

router.post("/addPriority", auth, priorityController.addPriority);
router.get("/getPriorityById/:id", auth, priorityController.getPriorityById);
router.get("/getAllPriorities", auth, priorityController.getAllPriorities);
router.put("/updatePriority/:id", auth, priorityController.updatePriority);
router.delete("/deletePriority/:id", auth, priorityController.deletePriority);

module.exports = router;

// http://localhost:4001/api/priorities/addPriority
// http://localhost:4001/api/priorities/getAllPriorities
// http://localhost:4001/api/priorities/getPriorityById/66e71f6276d7875d87de5075
// http://localhost:4001/api/priorities/updatePriority/66e6dc4476d7875d87de5071