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
        return "#4caf50";
      case "In Progress":
        return "#ffeb3b";
      case "Not yet Started":
        return "#f44336";
      default:
        return "#ff6767";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#e91e63";
      case "Medium":
        return "#ff9800";
      case "Low":
        return "#03a9f4";
      default:
        return "#ff6767";
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
        // Update the selected task to the response data
        setSelectedTask(response.data.updatedTask); // Assuming your API returns the updated task
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

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={4}>
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
                      padding: "15px",
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="d-flex flex-column w-100">
                      <div className="fw-bold mb-2">{task.title}</div>
                      <div className="mb-2">
                        <span className="me-2">Priority:</span>
                        <Badge
                          style={{
                            backgroundColor: getPriorityColor(task.priority),
                          }}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <div>
                        <span className="me-2">Status:</span>
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(task.status),
                          }}
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>
        </Col>

        <Col md={8}>
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
                <Card.Title>{selectedTask.title}</Card.Title>
                <p>
                  Priority:{" "}
                  <Badge
                    style={{
                      backgroundColor: getPriorityColor(selectedTask.priority),
                    }}
                  >
                    {selectedTask.priority}
                  </Badge>
                </p>
                <p>
                  Status:{" "}
                  <Badge
                    style={{
                      backgroundColor: getStatusColor(selectedTask.status),
                    }}
                  >
                    {selectedTask.status}
                  </Badge>
                </p>
                <Card.Text>{selectedTask.description}</Card.Text>
              </Card.Body>
              <div
                className="d-flex justify-content-end"
                style={{ gap: "10px", marginBottom: "10px" }}
              >
                <Button variant="outline-primary" onClick={handleShowModal}>
                  <FaEdit /> Edit
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDeleteTask(selectedTask._id)}
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal for Editing Task */}
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
            <Form.Group controlId="formDescription" className="mt-3">
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Vitaltask;
