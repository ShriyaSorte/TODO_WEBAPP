const Task = require('../models/taskModel');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, collaborators } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      createdBy: req.user.id,
      status,
      collaborators
    });

    const createdTask = await task.save();
    return res.status(201).send(createdTask);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    return res.status(200).send(tasks);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = { createTask, getUserTasks };
