const taskmodel = require("../models/taskModel");

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, collaborators } =
      req.body;

    // Get the image path from the uploaded file
    const imagePath = req.file ? req.file.path : null; // Retrieves the uploaded image path

    // Create a new task with the provided details and the image path
    const task = new taskmodel({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user.id,
      status,
      collaborators,
      image: imagePath, // Save the image path in the task
    });

    // Save the task to the database
    const createdTask = await task.save();

    // Return the created task as a response
    return res.status(201).send(createdTask);
  } catch (error) {
    // Handle any errors that occur during task creation
    return res.status(500).send({ message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskmodel.find({ createdBy: req.user.id });
    return res.status(200).send(tasks);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const addCollaborator = async (req, res) => {
  try {
    const { id: taskId } = req.params;
    const { collaboratername, status, createdAt } = req.body;

    const task = await taskmodel.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .send({ message: "Task not found", success: false });
    }

    const user = await usermodel.findById(collaboratername);
    if (!user) {
      return res
        .status(404)
        .send({ message: "Collaborator not found", success: false });
    }

    task.collaboraters.push({
      collaboratername,
      status: status || "Not started",
      createdAt: Date.now(),
    });

    await task.save();

    res.status(201).send({
      message: "Collaborator added successfully",
      task,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

async function getTaskById(req, res) {
  console.log(req.body);
  const { id } = req.params;
  try {
    const task = await taskmodel.findById(id);
    console.log(id);
    if (!task) {
      return res
        .status(404)
        .send({ msg: "task id is not found", success: false });
    }
    return res.status(201).send({ msg: "This is task", task, success: true });
  } catch (error) {
    console.error("Error fetching task by ID:", error.message); // Log the error for debugging
    res.status(500).send({
      error: error.message || "Internal Server Error",
      success: false,
    });
  }
}

const getFilteredTasks = async (req, res) => {
  try {
    const tasks = await taskmodel.find({
      createdBy: req.user.id, // Filter tasks by the logged-in user's ID
      priority: { $in: ["Medium", "High", "Low"] }, // Example filter based on priority
    });

    res.status(201).send({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Unable to retrieve tasks",
    });
  }
};

async function updateTask(req, res) {
  const { id: taskid } = req.params;
  const {
    title,
    description,
    category,
    priority,
    createdBy,
    collaboraters,
    status,
  } = req.body;
  try {
    const task = await taskmodel.findByIdAndUpdate(
      taskid,
      {
        title,
        description,
        category,
        priority,
        createdBy,
        collaboraters,
        status,
      },
      { new: true } // This ensures the updated document is returned
    );

    if (!task) {
      return res.status(404).send({ msg: "Task id is not found" });
    }

    res
      .status(200)
      .send({ message: "Task Updated successfully", success: true });
  } catch (error) {
    console.error("Error updating task:", error); // Log the error for debugging
    res.status(500).send({ error: "Server error", success: false });
  }
}

async function deleteTask(req, res) {
  console.log(req.body);
  const { id: taskid } = req.params;
  try {
    const task = await taskmodel.findByIdAndDelete(taskid);
    if (!task) {
      return res.status(404).send({ msg: "Task id not found", success: false });
    }
    res.status(200).send({ msg: "Task Deleted Successfully", success: true });
  } catch (error) {
    res.status(500).send({ error: "Server Error", success: false });
  }
}

const getTodayTasks = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const tasks = await taskmodel.find({
      createdBy: req.user.id,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
    });

    return res.status(200).send(tasks);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  getFilteredTasks,
  updateTask,
  deleteTask,
  getTodayTasks,
  addCollaborator,
};
