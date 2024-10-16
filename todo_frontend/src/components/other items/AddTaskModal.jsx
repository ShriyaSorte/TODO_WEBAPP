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
    setImage(e.target.files[0]);
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
    formData.append("title", title);
    formData.append("dueDate", taskDate);
    formData.append("priority", priority);
    formData.append("description", description);
    formData.append("status", status);
    if (image) {
      formData.append("image", image);
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
    <>
      {show && (
        <>
          {/* Dark background overlay */}
          <div
            className="modal-backdrop fade show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background with opacity
              zIndex: 1040, // Ensures it is behind the modal
            }}
          ></div>

          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
              style={{ zIndex: 1050 }} // Ensure the modal is above the backdrop
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Task</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={onHide}
                    aria-label="Close"
                    style={{
                      marginLeft: "550px",
                      border: "none",
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    }}
                  >
                    <span aria-hidden="true">Go Back</span>
                  </button>
                </div>
                <div className="modal-body">
                  {/* Error and Success Messages */}
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && (
                    <div className="alert alert-success">{success}</div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit}>
                    {/* Title Input */}
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    {/* Date Input */}
                    <div className="form-group mt-3">
                      <label htmlFor="taskDate">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        id="taskDate"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        required
                      />
                    </div>

                    {/* Priority Radio Buttons */}
                    <div className="form-group mt-3">
                      <label>Priority</label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="priority"
                            id="highPriority"
                            value="High"
                            checked={priority === "High"}
                            onChange={(e) => setPriority(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="highPriority"
                          >
                            High
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="priority"
                            id="mediumPriority"
                            value="Medium"
                            checked={priority === "Medium"}
                            onChange={(e) => setPriority(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="mediumPriority"
                          >
                            Medium
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="priority"
                            id="lowPriority"
                            value="Low"
                            checked={priority === "Low"}
                            onChange={(e) => setPriority(e.target.value)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="lowPriority"
                          >
                            Low
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Description and File Upload Side by Side */}
                    <div className="row mt-3">
                      {/* Description Field */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="taskDescription">Description</label>
                          <textarea
                            className="form-control"
                            id="taskDescription"
                            rows="3"
                            value={description}
                            onChange={(e) =>
                              setDescription(e.target.value)
                            }
                            required
                          ></textarea>
                        </div>
                      </div>

                      {/* File Upload Field */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="taskImage">Upload Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="taskImage"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="form-group mt-3">
                      <label htmlFor="taskStatus">Status</label>
                      <select
                        className="form-control"
                        id="taskStatus"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                      >
                        <option value="Not started">Not started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn mt-4"
                      style={{ backgroundColor: "#ff6767" }}
                    >
                      Done
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AddTaskModal;
