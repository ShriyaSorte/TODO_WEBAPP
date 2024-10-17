import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Badge,
  Modal,
  Button,
  Form,
  Image,
} from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  useEffect(() => {
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
  }, []);

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
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateTask = () => {
    axios
      .put(
        `http://localhost:4001/api/tasks/updateTask/${selectedTask._id}`,
        {
          title: updatedTitle,
          description: updatedDescription,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === selectedTask._id ? response.data.task : task
          )
        );
        setSelectedTask(response.data.task);
        handleCloseModal();
        window.location.reload();
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

  return (
    <div>
      <Container fluid className="mt-3">
        <Row>
          <Col md={5}>
            <div
              style={{
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h4 className="mb-4">My Tasks</h4>
              <ListGroup>
                {tasks.map((task) => (
                  <ListGroup.Item
                    key={task._id}
                    action
                    onClick={() => handleTaskClick(task)}
                    className="d-flex align-items-start mb-3 p-3"
                    style={{
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      height: "auto", // Adjusted height
                      borderRadius: "8px",
                      backgroundColor:
                        selectedTask?._id === task._id ? "#f9f9f9" : "#ffffff", // Highlight selected task
                    }}
                  >
                    <Form.Check
                      type="radio"
                      name="taskSelect"
                      id={`task-${task._id}`}
                      checked={selectedTask?._id === task._id}
                      onChange={() => handleTaskClick(task)}
                      style={{ marginRight: "10px" }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-bold mb-2">{task.title}</div>
                      <div className="text-truncate mb-1">
                        {task.description}
                      </div>
                      <div className="mb-2">
                        <div className="d-flex align-items-center mb-1">
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
                    <Image
                      src={
                        task.image
                          ? `http://localhost:4001/${task.image}`
                          : "https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                      }
                      rounded
                      style={{ width: "90px", height: "90px" }}
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col md={7}>
            <div
              style={{
                border: "2px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              {selectedTask && (
                <Card
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "12px",
                    position: "relative",
                  }}
                >
                  <Card.Body>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <Image
                        src={
                          selectedTask.image
                            ? `http://localhost:4001/${selectedTask.image}`
                            : "https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                        }
                        rounded
                        style={{
                          width: "120px",
                          height: "120px",
                          marginRight: "15px",
                        }}
                      />
                      <div style={{ flex: "1" }}>
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
                        <Card.Text className="mt-2">
                          {selectedTask.description}
                        </Card.Text>
                      </div>
                    </div>
                  </Card.Body>
                  <div
                    className="d-flex justify-content-end"
                    style={{ gap: "10px", marginBottom: "10px", marginRight: "10px" }}
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
            </div>
          </Col>
        </Row>
      </Container>

      {/* Update Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={handleCloseModal}
            style={{ backgroundColor: "#ff6767", borderColor: "#ff6767" }}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={handleUpdateTask}
            style={{ backgroundColor: "#ff6767", borderColor: "#ff6767" }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyTasks;
