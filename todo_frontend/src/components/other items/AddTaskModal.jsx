import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

function AddTaskModal({ show, onHide, onAddTask }) {
  const [title, setTitle] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("Not started");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setTitle("");
    setTaskDate("");
    setPriority("Medium");
    setDescription("");
    setImage(null);
    setStatus("Not started");
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Capture the file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    if (!title) {
      setError("Title is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title); // Append title
    formData.append("dueDate", taskDate); // Append due date
    formData.append("priority", priority); // Append priority
    formData.append("description", description); // Append description
    formData.append("status", status); // Append status
    if (image) {
      formData.append("image", image); // Append the file if available
    }

    try {
      const response = await axios.post(
        "http://localhost:4001/api/tasks/createTask",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Required for sending files
          },
        }
      );
      console.log(response.data);
      setSuccess("Task added successfully!");

      // Return the entire task object including the image URL
      if (onAddTask) {
        onAddTask(response.data);
      }

      resetForm(); // Reset form fields after successful submission
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error adding task. Please try again.";
      console.error("Error adding task:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="taskDate" className="mt-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="taskPriority" className="mt-3">
            <Form.Label>Priority</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                name="priority"
                label="High"
                value="High"
                checked={priority === "High"}
                onChange={(e) => setPriority(e.target.value)}
              />
              <Form.Check
                inline
                type="radio"
                name="priority"
                label="Medium"
                value="Medium"
                checked={priority === "Medium"}
                onChange={(e) => setPriority(e.target.value)}
              />
              <Form.Check
                inline
                type="radio"
                name="priority"
                label="Low"
                value="Low"
                checked={priority === "Low"}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
          </Form.Group>

          <Form.Group controlId="taskDescription" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="taskImage" className="mt-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>

          <Form.Group controlId="taskStatus" className="mt-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Not started">Not started</option>
              <option value="In Progress">In progress</option>
              <option value="Completed">Completed</option>
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4">
            Add Task
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddTaskModal;
