import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Modal,
  Button,
  Form,
  Image,
} from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

function Vitaltask() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedDate, setUpdatedDate] = useState(""); // New state for date
  const [updatedPriority, setUpdatedPriority] = useState(""); // New state for priority
  const [updatedImage, setUpdatedImage] = useState(null); // New state for image

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:4001/api/tasks/getFilteredTasks", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setTasks(response.data.tasks);
        if (response.data.tasks.length > 0) {
          setSelectedTask(response.data.tasks[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks", error);
      });
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4caf50"; // Green
      case "In Progress":
        return "#03a9f4"; // Blue
      case "Not yet Started":
        return "#f44336"; // Red
      default:
        return "#ff6767"; // Default color
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ff6767"; // Red
      case "Medium":
        return "#03a9f4"; // Blue
      case "Low":
        return "#03a9f4"; // Blue
      default:
        return "#ff6767"; // Default color
    }
  };

  const handleShowModal = () => {
    if (selectedTask) {
      setUpdatedTitle(selectedTask.title);
      setUpdatedDescription(selectedTask.description);
      setUpdatedDate(selectedTask.date); // Set the current date for the selected task
      setUpdatedPriority(selectedTask.priority); // Set the current priority
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateTask = () => {
    // Create form data for image upload
    const formData = new FormData();
    formData.append("title", updatedTitle);
    formData.append("description", updatedDescription);
    formData.append("date", updatedDate);
    formData.append("priority", updatedPriority);
    if (updatedImage) {
      formData.append("image", updatedImage); // Append image only if a file is selected
    }

    axios
      .put(
        `http://localhost:4001/api/tasks/updateTask/${selectedTask._id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "multipart/form-data", // Ensure the correct content type
          },
        }
      )
      .then((response) => {
        setSelectedTask(response.data.updatedTask);
        fetchTasks(); // Optionally refetch tasks if needed
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error updating task", error);
      });
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`http://localhost:4001/api/tasks/deleteTask/${taskId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== taskId));
        setSelectedTask(null);
      })
      .catch((error) => {
        console.error("Error deleting task", error);
      });
  };

  const handleImageUpload = (e) => {
    setUpdatedImage(e.target.files[0]); // Save the selected image
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={5}>
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#ffffff",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h4 className="mb-4">Vital Tasks</h4>
            <ListGroup>
              {tasks
                .filter(
                  (task) =>
                    task.priority === "High" || task.priority === "Medium"
                )
                .map((task) => (
                  <ListGroup.Item
                    key={task._id}
                    action
                    onClick={() => handleTaskClick(task)}
                    className="d-flex align-items-start mb-3"
                    style={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      height: "200px",
                      padding: "15px",
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Form.Check
                      type="radio"
                      name="taskSelect"
                      id={`task-${task._id}`}
                      style={{ marginRight: "10px" }}
                      checked={selectedTask?._id === task._id}
                      onChange={() => handleTaskClick(task)}
                    />

                    <div className="d-flex flex-column w-100">
                      <div
                        className="fw-bold mb-2"
                        style={{ fontSize: "20px" }}
                      >
                        {task.title}
                      </div>

                      <div
                        className="d-flex align-items-center mb-2"
                        style={{ fontSize: "14px", color: "#555" }}
                      >
                        <div className="me-2" style={{ flex: 1 }}>
                          {task.description}
                        </div>

                        <Image
                          src={
                            task.image
                              ? `http://localhost:4001/${task.image}`
                              : "https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                          }
                          rounded
                          fluid
                          style={{ width: "90px", height: "90px" }}
                        />
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <div className="d-flex align-items-center me-3">
                          <h6 className="mb-0 me-2">Priority:</h6>
                          <div
                            style={{ color: getPriorityColor(task.priority) }}
                          >
                            {task.priority}
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <h6 className="mb-0 me-2">Status:</h6>
                          <div style={{ color: getStatusColor(task.status) }}>
                            {task.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>
        </Col>

        <Col md={7}>
          {selectedTask && (
            <Card
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                padding: "15px",
              }}
            >
              <Card.Body>
                <div className="d-flex align-items-start mb-3">
                  <Image
                    src={
                      selectedTask.image
                        ? `http://localhost:4001/${selectedTask.image}`
                        : "https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                    }
                    rounded
                    fluid
                    style={{
                      width: "120px",
                      height: "120px",
                      marginRight: "15px",
                    }}
                  />

                  <div className="flex-grow-1">
                    <Card.Title>{selectedTask.title}</Card.Title>

                    <div className=" justify-content-between mb-2">
                      <div className="me-3 mb-3">
                        <strong>Priority:</strong>{" "}
                        <span
                          style={{
                            color: getPriorityColor(selectedTask.priority),
                          }}
                        >
                          {selectedTask.priority}
                        </span>
                      </div>
                      <div className="mb-3">
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            color: getStatusColor(selectedTask.status),
                          }}
                        >
                          {selectedTask.status}
                        </span>
                      </div>
                    </div>

                    <Card.Text>{selectedTask.description}</Card.Text>
                  </div>
                </div>
              </Card.Body>
              <div
                className="d-flex justify-content-end"
                style={{ gap: "10px", marginBottom: "10px" }}
              >
                <Button
                  onClick={() => handleDeleteTask(selectedTask._id)}
                  style={{
                    color: "white",
                    backgroundColor: "#ff6767",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <FaTrash />
                </Button>
                <Button
                  onClick={handleShowModal}
                  style={{
                    color: "white",
                    backgroundColor: "#ff6767",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <FaEdit />
                </Button>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formDate" className="mt-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={updatedDate}
                onChange={(e) => setUpdatedDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formPriority" className="mt-2">
              <Form.Label>Priority</Form.Label>
              <div className="d-flex gap-5">
                <Form.Check
                  type="radio"
                  id="priorityHigh"
                  label="High"
                  name="priority"
                  value="High"
                  checked={updatedPriority === "High"}
                  onChange={(e) => setUpdatedPriority(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  id="priorityMedium"
                  label="Medium"
                  name="priority"
                  value="Medium"
                  checked={updatedPriority === "Medium"}
                  onChange={(e) => setUpdatedPriority(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  id="priorityLow"
                  label="Low"
                  name="priority"
                  value="Low"
                  checked={updatedPriority === "Low"}
                  onChange={(e) => setUpdatedPriority(e.target.value)}
                />
              </div>
            </Form.Group>

            <Row className="mt-2">
              <Col md={8}>
                <Form.Group controlId="formDescription">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                    placeholder="Start writing here..."
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group controlId="formImage">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleImageUpload} // Handle image upload
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={handleUpdateTask}
            style={{ color: "white", backgroundColor: "#ff6767" }}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Vitaltask;
