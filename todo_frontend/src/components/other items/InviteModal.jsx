import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const InviteModal = ({ show, onHide, taskId }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/users/getAllUsers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Error fetching users. Please try again.");
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
        <Modal.Title>Invite Someone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="inviteEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              as="select"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            >
              <option value="">Select User Email</option>
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
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
            <Button variant="primary" type="submit" className="ms-2">
              Send Invite
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InviteModal;
