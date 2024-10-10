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
        // Update the tasks state if needed
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === selectedTask._id ? response.data.task : task
          )
        );
        setSelectedTask(response.data.task); // Update the selected task
        handleCloseModal();

        // Refresh the page to get updated data
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
    <div
      className="container"
      style={{
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#f0f2f5",
        borderRadius: "12px",
      }}
    >
      <Container fluid className="mt-3">
        <Row>
          <Col md={4}>
            <div
              style={{
                border: "2px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4 className="mb-4">My Tasks</h4>
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
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        height: "180px",
                        borderRadius: "8px",
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
                          <div className="mt-2">
                            <Badge
                              style={{
                                backgroundColor: getPriorityColor(),
                                marginRight: "5px",
                              }}
                            >
                              {task.priority}
                            </Badge>
                            <Badge
                              style={{
                                backgroundColor: getStatusColor(),
                              }}
                            >
                              {task.status}
                            </Badge>
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <Card.Title>{selectedTask.title}</Card.Title>

                        <div className="mt-3">
                          <p>
                            <Badge
                              style={{
                                backgroundColor: getPriorityColor(),
                                marginRight: "10px",
                              }}
                            >
                              Priority: {selectedTask.priority}
                            </Badge>
                            <Badge
                              style={{
                                backgroundColor: getStatusColor(),
                              }}
                            >
                              Status: {selectedTask.status}
                            </Badge>
                          </p>
                        </div>
                        <Card.Text className="mt-2">
                          {selectedTask.description}
                        </Card.Text>
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
