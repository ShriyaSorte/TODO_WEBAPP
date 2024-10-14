import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const InviteModal = ({ show, onHide, taskId }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:4001/api/users/getAllUsers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchUsers();
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inviteData = {
      task: taskId,
      invitedUser: email,
      status: "Not started",
      invitedAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:4001/api/invites/invitation", inviteData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Invite sent:", response.data);
      alert("Invite sent successfully!");
      onHide();
    } catch (error) {
      console.error("Error sending invite:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.msg || "An error occurred while sending the invite.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Send an invite to a new member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="inviteEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter or select email"
                  required
                />
              </Form.Group>
              <Form.Group controlId="userSelect" className="mt-3">
                <Form.Label>Members</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user.email}>{user.email}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="inviteMessage" className="mt-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Optional message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-end mt-3">
                <Button type="submit" className="ms-2" style={{ backgroundColor: "#ff6767" }}>
                  Send Invite
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default InviteModal;
