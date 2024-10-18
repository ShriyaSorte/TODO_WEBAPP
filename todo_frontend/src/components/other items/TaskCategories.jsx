import React, { useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap"; // Import Modal
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
  const [showEditStatusModal, setShowEditStatusModal] = useState(false); // For edit status modal
  const [showEditPriorityModal, setShowEditPriorityModal] = useState(false); // For edit priority modal
  const [categoryName, setCategoryName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null); // Store the status being edited
  const [newStatusName, setNewStatusName] = useState(""); // Store the new name for the status
  const [selectedPriority, setSelectedPriority] = useState(null); // Store the priority being edited
  const [newPriorityName, setNewPriorityName] = useState(""); // Store the new name for the priority

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

  // Open the edit status modal and set the current status to edit
  const handleEditStatus = (statusId) => {
    const statusToEdit = taskStatus.find((status) => status.id === statusId);
    if (statusToEdit) {
      setSelectedStatus(statusToEdit);
      setNewStatusName(statusToEdit.name);
      setShowEditStatusModal(true); // Open edit status modal
    }
  };

  // Handle the submission of the edited status
  const handleEditStatusSubmit = async (e) => {
    e.preventDefault();
    if (selectedStatus) {
      const updatedStatus = {
        ...selectedStatus,
        name: newStatusName,
      };
      setTaskStatus((prev) =>
        prev.map((status) =>
          status.id === updatedStatus.id ? updatedStatus : status
        )
      );

      // Optionally, make an API call to update the status on the server
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:4001/api/tasks/updateTask/${updatedStatus.id}`,
          updatedStatus,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Task status updated successfully");
      } catch (error) {
        console.error("Error updating task status", error);
        alert("Failed to update task status");
      }

      setShowEditStatusModal(false); // Close the edit status modal
    }
  };

  // Open the edit priority modal and set the current priority to edit
  const handleEditPriority = (priorityId) => {
    const priorityToEdit = taskPriority.find(
      (priority) => priority.id === priorityId
    );
    if (priorityToEdit) {
      setSelectedPriority(priorityToEdit);
      setNewPriorityName(priorityToEdit.name);
      setShowEditPriorityModal(true); // Open edit priority modal
    }
  };

  // Handle the submission of the edited priority
  const handleEditPrioritySubmit = async (e) => {
    e.preventDefault();
    if (selectedPriority) {
      const updatedPriority = {
        ...selectedPriority,
        name: newPriorityName,
      };
      setTaskPriority((prev) =>
        prev.map((priority) =>
          priority.id === updatedPriority.id ? updatedPriority : priority
        )
      );

      // Optionally, make an API call to update the priority on the server
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:4001/api/tasks/updatePriority/${updatedPriority.id}`,
          updatedPriority,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Task priority updated successfully");
      } catch (error) {
        console.error("Error updating task priority", error);
        alert("Failed to update task priority");
      }

      setShowEditPriorityModal(false); // Close the edit priority modal
    }
  };

  const handleDeleteStatus = async (statusId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:4001/api/tasks/deleteTask/${statusId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Task status deleted successfully");
      // Remove the deleted status from the state
      setTaskStatus(taskStatus.filter((status) => status.id !== statusId));
    } catch (error) {
      console.error("Error deleting task status", error);
      alert("Failed to delete task status");
    }
  };

  const handleDeletePriority = async (priorityId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:4001/api/tasks/deletePriority/${priorityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Task priority deleted successfully");
      // Remove the deleted priority from the state
      setTaskPriority(
        taskPriority.filter((priority) => priority.id !== priorityId)
      );
    } catch (error) {
      console.error("Error deleting task priority", error);
      alert("Failed to delete task priority");
    }
  };

  return (
    <div
      className="task-categories-container rounded"
      style={{ border: "1px solid black" }}
    >
      <div
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ padding: "8px", marginTop: "10px" }}
      >
        <div style={{ marginLeft: "30px" }}>
          <h2>Task Categories</h2>
          <Button
            variant="danger"
            className="mb-3 btn-md"
            onClick={() => setShowModal(true)} // Open modal on button click
            style={{ backgroundColor: "#f24e1e", marginTop: "5px" }}
          >
            Add Category
          </Button>
        </div>
        <div
          className="button"
          style={{ color: "black", listStyle: "none", marginRight: "20px" }}
        >
          <Link
            to={"/dashboard"}
            style={{ textDecoration: "underline", color: "black" }}
          >
            <span type="button">Go Back</span>
          </Link>
        </div>
      </div>

      {/* Modal for adding a category */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <label style={{ marginBottom: "5px", color: "black" }}>
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="form-control"
            />

            <Modal.Footer className="d-flex justify-content-start">
              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: "#f24e1e", marginRight: "10px" }}
              >
                Create
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                style={{ backgroundColor: "#f24e1e" }}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for editing a task status */}
      <Modal
        show={showEditStatusModal}
        onHide={() => setShowEditStatusModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Task Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditStatusSubmit}>
            <label style={{ marginBottom: "5px", color: "black" }}>
              Task Status Name
            </label>
            <input
              type="text"
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              className="form-control"
            />

            <Modal.Footer className="d-flex justify-content-start">
              <Button
                type="submit"
                style={{ backgroundColor: "#f24e1e", marginRight: "10px" }}
              >
                Update
              </Button>
              <Button
                onClick={() => setShowEditStatusModal(false)}
                style={{ backgroundColor: "#f24e1e" }}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for editing a task priority */}
      <Modal
        show={showEditPriorityModal}
        onHide={() => setShowEditPriorityModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Task Priority</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditPrioritySubmit}>
            <label style={{ marginBottom: "5px", color: "black" }}>
              Task Priority Title
            </label>
            <input
              type="text"
              value={newPriorityName}
              onChange={(e) => setNewPriorityName(e.target.value)}
              className="form-control"
            />

            <Modal.Footer className="d-flex justify-content-start">
              <Button
                type="submit"
                style={{ backgroundColor: "#f24e1e", marginRight: "10px" }}
              >
                Update
              </Button>
              <Button
                onClick={() => setShowEditPriorityModal(false)}
                style={{ backgroundColor: "#f24e1e" }}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Remaining component code */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h4 style={{ textAlign: "left", marginBottom: "0px" }}>
                Task Status
              </h4>
            </div>

            <Table bordered>
              <thead className="text-center">
                <tr>
                  <th>SN</th>
                  <th>Task Status</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {taskStatus.map((status, index) => (
                  <tr key={status.id}>
                    <td>{index + 1}</td>
                    <td>{status.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div
              className="d-flex justify-content-between align-items-center mb-1"
              style={{ marginTop: "20px" }}
            >
              <h4 style={{ textAlign: "left", marginBottom: "0px" }}>
                Task Priority
              </h4>
            </div>

            <Table bordered>
              <thead className="text-center">
                <tr>
                  <th>SN</th>
                  <th>Task Priority</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {taskPriority.map((priority, index) => (
                  <tr key={priority.id}>
                    <td>{index + 1}</td>
                    <td>{priority.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCategories;
