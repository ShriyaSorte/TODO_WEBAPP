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
} from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

function Vitaltask() {
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

  const getStatusColor = () => "#ff6767";
  const getPriorityColor = () => "#ff6767";

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
        setTasks(
          tasks.map((task) =>
            task._id === selectedTask._id ? response.data.task : task
          )
        );
        setSelectedTask(response.data.task);
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

  return (
    <div
      className="container"
      style={{
        marginTop: "10px",
        padding: "20px",
      }}
    >
      <Container fluid className="mt-3">
        <Row>
          <Col md={4}>
            <div
              style={{
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#fff",
              }}
            >
              <h4>Vital Task</h4>
              <ListGroup>
                {tasks.map((task) =>
                  task ? (
                    <ListGroup.Item
                      key={task._id}
                      action
                      onClick={() => handleTaskClick(task)}
                      className="d-flex align-items-start mb-3 p-3"
                      style={{
                        cursor: "pointer",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        height: "180px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <div className="d-flex flex-column justify-content-between">
                        <div>
                          <div className="fw-bold mb-1">{task.title}</div>
                          <div
                            className="text-truncate mb-1"
                            style={{ maxWidth: "200px" }}
                          >
                            {task.description}
                          </div>
                          <div className="mb-2">
                            <p className="mb-0">
                              Priority:{" "}
                              <Badge
                                style={{
                                  backgroundColor: getPriorityColor(),
                                }}
                              >
                                {task.priority}
                              </Badge>
                            </p>
                            <p className="mb-0">
                              Status:{" "}
                              <Badge
                                style={{
                                  backgroundColor: getStatusColor(),
                                }}
                              >
                                {task.status}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ) : null
                )}
              </ListGroup>
            </div>
          </Col>

          <Col md={8}>
            <div
              style={{
                border: "2px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#fff",
              }}
            >
              {selectedTask && (
                <Card
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    position: "relative",
                  }}
                >
                  <Card.Body>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <Card.Title>{selectedTask.title}</Card.Title>

                        <p>
                          Priority:{" "}
                          <Badge
                            style={{
                              backgroundColor: getPriorityColor(),
                            }}
                          >
                            {selectedTask.priority}
                          </Badge>
                        </p>
                        <p>
                          Status:{" "}
                          <Badge
                            style={{
                              backgroundColor: getStatusColor(),
                            }}
                          >
                            {selectedTask.status}
                          </Badge>
                        </p>

                        <Card.Text>{selectedTask.description}</Card.Text>
                      </div>
                    </div>
                  </Card.Body>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <Button
                        variant="link"
                        onClick={handleShowModal}
                        style={{ fontSize: "20px", color: "#ff6767" }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => handleDeleteTask(selectedTask._id)}
                        style={{ fontSize: "20px", color: "#ff6767" }}
                      >
                        <FaTrash />
                      </Button>
                    </div>
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

export default Vitaltask;
