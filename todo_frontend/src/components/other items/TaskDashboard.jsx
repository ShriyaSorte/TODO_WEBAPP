import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import AddTaskModal from "./AddTaskModal";

function TaskDashboard() {
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  // Get today's date
  const todayDate = new Date().toLocaleDateString();

  useEffect(() => {
    async function getUserInfo() {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/users/getUserInfo",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
    getUserInfo();
  }, []);

  useEffect(() => {
    async function getAllTasks() {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/tasks/getAllTasks",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (response.data && Array.isArray(response.data.modifiedtask)) {
          setTasks(response.data.modifiedtask);
        } else {
          setTasks([]); // In case modifiedtask is not an array or doesn't exist
        }
      } catch (error) {
        console.log("Error fetching tasks:", error);
        setTasks([]); // Set tasks to empty array in case of error
      }
    }
    getAllTasks();
  }, []);

  useEffect(() => {
    async function getTodayTasks() {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/tasks/getTodayTasks",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]); // No tasks found
        }
      } catch (error) {
        console.log("Error fetching today's tasks:", error);
        setTasks([]); // Handle error
      }
    }
    getTodayTasks();
  }, []);

  const handleAddTask = async (newTask) => {
    console.log("New Task Added:", newTask); 
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setModalShow(false);
  };

  const getStatusPercentage = (status) => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;
    const statusCount = tasks.filter((task) => task.status === status).length;
    return Math.round((statusCount / totalTasks) * 100);
  };

  const handleReadMore = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <div
      className="dashboard-container"
      style={{ marginTop: "1px", border: "2px solid black" }}
    >
      <Container>
        <Row className="align-items-center">
          <Col>
            <h3>Welcome back, {user.firstName} 👋🏻</h3>
            <Button
              variant="primary"
              onClick={() => setModalShow(true)}
              className="mb-3"
            >
              Add Task
            </Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={8} className="task-column">
            {/* Display Today's Date */}
            <div className="mb-3">
              <h6>{todayDate}</h6>
            </div>

            <div className="task-section">
              <h5>To-Do</h5>
              <Row>
                {tasks
                  .filter((task) => task.status !== "Completed")
                  .map((task) => (
                    <Col md={12} key={task._id}>
                      <Link
                        to={`taskdetails/${task._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Card className="mb-4 task-card shadow-sm">
                          <Card.Body>
                            <Row>
                              <Col xs={8}>
                                <Card.Title>{task.title}</Card.Title>
                                <Card.Text>
                                  {expandedTask === task._id
                                    ? task.description ||
                                      "No description available"
                                    : `${(
                                        task.description ||
                                        "No description available"
                                      ).substring(0, 100)}...`}
                                  {task.description &&
                                    task.description.length > 100 && (
                                      <Button
                                        variant="link"
                                        className="read-more-link"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleReadMore(task._id);
                                        }}
                                      >
                                        {expandedTask === task._id
                                          ? "Read Less"
                                          : "Read More"}
                                      </Button>
                                    )}
                                  <br />
                                  Priority:{" "}
                                  <span className="priority-text">
                                    {task.priority}
                                  </span>
                                  {" | "}
                                  Status:{" "}
                                  <span className="status-text">
                                    {task.status}
                                  </span>
                                </Card.Text>
                              </Col>

                              <Col xs={4} className="text-center">
                                <Image
                                  src={
                                    task.image
                                      ? task.image
                                      : "https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                                  }
                                  rounded
                                  fluid
                                  style={{ width: "100px", height: "100px" }}
                                />
                              </Col>
                            </Row>
                            <hr />
                            <Row className="mt-2">
                              <Col xs={12} className="text-end">
                                <small className="text-muted">
                                  Created on:{" "}
                                  {new Date(
                                    task.createdAt
                                  ).toLocaleDateString()}
                                </small>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  ))}
              </Row>
            </div>
          </Col>

          <Col md={4}>
            <div className="task-section">
              <h5>Task Status</h5>
              <div className="circle-container d-flex justify-content-between">
                <div className="circular-bar-container">
                  <CircularProgressbar
                    value={getStatusPercentage("Completed")}
                    text={`${getStatusPercentage("Completed")}%`}
                    styles={buildStyles({
                      pathColor: "green",
                      textColor: "green",
                      trailColor: "#d6d6d6",
                    })}
                  />
                  <p className="text-center mt-2">Completed</p>
                </div>

                <div className="circular-bar-container">
                  <CircularProgressbar
                    value={getStatusPercentage("In Progress")}
                    text={`${getStatusPercentage("In Progress")}%`}
                    styles={buildStyles({
                      pathColor: "blue",
                      textColor: "blue",
                      trailColor: "#d6d6d6",
                    })}
                  />
                  <p className="text-center mt-2">In Progress</p>
                </div>

                <div className="circular-bar-container">
                  <CircularProgressbar
                    value={getStatusPercentage("Not started")}
                    text={`${getStatusPercentage("Not started")}%`}
                    styles={buildStyles({
                      pathColor: "red",
                      textColor: "red",
                      trailColor: "#d6d6d6",
                    })}
                  />
                  <p className="text-center mt-2">Not Started</p>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="task-section mt-4">
              <h5>Completed Tasks</h5>
              <Row>
                {tasks
                  .filter((task) => task.status === "Completed")
                  .map((task) => (
                    <Col key={task._id}>
                      <Card className="mb-4 task-card shadow-sm">
                        <Card.Body>
                          <Row>
                            <Col xs={8}>
                              <Card.Title>{task.title}</Card.Title>
                              <Card.Text>
                                {task.description.length > 100
                                  ? `${task.description.substring(0, 100)}...`
                                  : task.description}
                                <br />
                                Status:{" "}
                                <span className="status-text">
                                  {task.status}
                                </span>
                              </Card.Text>
                            </Col>
                            <Col xs={4} className="text-center">
                              <Image
                                src={
                                  task.image
                                    ? task.image
                                    : "https://cdn-icons-png.flaticon.com/512/4345/4345800.png"
                                }
                                rounded
                                fluid
                                style={{ width: "100px", height: "100px" }}
                              />
                            </Col>
                          </Row>
                          <hr />
                          <Row className="mt-2">
                            <Col xs={12} className="text-end">
                              <small className="text-muted">
                                Created on:{" "}
                                {new Date(task.createdAt).toLocaleDateString()}
                              </small>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <AddTaskModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}

export default TaskDashboard;
