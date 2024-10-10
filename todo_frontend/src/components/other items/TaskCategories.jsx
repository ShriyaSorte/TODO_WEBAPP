import React, { useState } from "react";
import { Button, Table, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskCategories = () => {
  const navigate = useNavigate();
  const [taskStatus, setTaskStatus] = useState([
    { id: 1, name: "Completed" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Not Started" },
  ]);

  const [taskPriority, setTaskPriority] = useState([
    { id: 1, name: "High" },
    { id: 2, name: "Medium" },
    { id: 3, name: "Low" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4001/api/category/createCategory",
        { categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      setShowModal(false);
    } catch (error) {
      console.error("Error adding category", error);
      alert("Failed to add category");
    }
  };

  const handleEdit = (statusId) => {
    const statusToEdit = taskStatus.find((status) => status.id === statusId);
    if (statusToEdit) {
      setSelectedStatus(statusToEdit);
      setNewStatusName(statusToEdit.name);
      setShowEditModal(true);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    console.log("Updating status ID:", selectedStatus.id);
    console.log("New status name:", newStatusName);
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4001/api/tasks/updateTask/${selectedStatus.id}`,
        { status: newStatusName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response from server:", response.data);
      alert("Task status updated successfully");
      fetchTasks(); 
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
  };
  

  const handleDelete = async (statusId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4001/api/task/delete/${statusId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Task status deleted successfully");
      // Refresh task status if needed
    } catch (error) {
      console.error("Error deleting task status", error);
      alert("Failed to delete task status");
    }
  };

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center">Task Categories</h2>
        <Link to={"/dashboard/taskDashboard"}>
          <Button variant="outline-dark">Go Back</Button>
        </Link>
      </div>

      {/* Add Category Button */}
      <Button
        variant="warning"
        className="mb-4"
        onClick={() => setShowModal(true)}
      >
        + Add New Category
      </Button>

      {/* Modal for adding a new category */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Status Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateStatus}>
            <Form.Group className="mb-3">
              <Form.Label>Status Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new status name"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Status
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Row>
        {/* Task Status Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header
              as="h4"
              className="text-center text-white"
              style={{ backgroundColor: "#ff6767" }}
            >
              Task Status
            </Card.Header>
            <Card.Body>
              <Button variant="outline-primary" className="mb-3 w-100">
                + Add Task Status
              </Button>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>S.N.</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskStatus.map((status, index) => (
                    <tr key={status.id}>
                      <td>{index + 1}</td>
                      <td>{status.name}</td>
                      <td>
                        <Button
                          variant="outline-warning"
                          onClick={() => handleEdit(status.id)}
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete(status.id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Task Priority Section */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header
              as="h4"
              className="text-center text-white"
              style={{ backgroundColor: "#ff6767" }}
            >
              Task Priority
            </Card.Header>
            <Card.Body>
              <Button variant="outline-primary" className="mb-3 w-100">
                + Add New Priority
              </Button>
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>S.N.</th>
                    <th>Priority</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taskPriority.map((priority, index) => (
                    <tr key={priority.id}>
                      <td>{index + 1}</td>
                      <td>{priority.name}</td>
                      <td>
                        <Button
                          variant="outline-warning"
                          onClick={() => handleEdit("priority", priority.id)}
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete("priority", priority.id)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskCategories;
