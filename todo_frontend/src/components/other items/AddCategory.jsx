import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function AddCategory() {
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState(""); // Fixed variable name
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User is not authenticated");
      toast.error("User is not authenticated");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4001/api/category/createCategory",
        { categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Category added successfully!");
      toast.success("Category added successfully!");
      setCategoryName(""); // Corrected function call to setCategoryName
      setError(null);
      navigate("/taskcategories"); // Navigate back to Task Categories after success
    } catch (err) {
      console.error(err.response.data);
      setError("Error adding category. Please try again.");
      toast.error("Error adding category. Please try again.");
      setSuccess(null);
    }
  };

  const handleDismiss = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div
      className="container"
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px",
        height: "90%",
      }}
    >
      <Container className="mt-5">
        <Row className="justify-content-between align-items-center">
          <Col>
            <h2>Create Categories</h2>
          </Col>
          <Col className="text-end">
            <Link to="/taskcategories">
              <Button variant="link">Go Back</Button>
            </Link>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="categoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={categoryName} // Corrected variable name
              onChange={(e) => setCategoryName(e.target.value)} // Corrected function call
            />
          </Form.Group>

          <div className="mt-3">
            <Button variant="primary" className="me-2" type="submit">
              Create
            </Button>
            <Link to="/taskcategories">
              <Button variant="secondary">Cancel</Button>
            </Link>
          </div>
        </Form>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default AddCategory;
