import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import image from "../../assets/profile.jpg";
import { Link } from "react-router-dom";

const AccountInfo = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    position: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:4001/api/users/getUserInfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { firstName, lastName, email } =
          response.data.user;
        setUser({ firstName, lastName, email });
        setLoading(false);
      } catch (error) {
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // You can add logic to handle form submission here, such as sending updated user data to the backend.
    console.log("User data updated:", user);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div
        className="card p-4 shadow-sm"
        style={{ borderRadius: "10px", maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Account Information</h2>
          <Link to="dashboard" className="text-decoration-none">
            Go Back
          </Link>
        </div>

        <div className="text-center mb-4">
          <img
          style={{height: "100px", width: "100px"}}
            src={image}
            alt="Profile"
            className="rounded-circle mb-2"
          />
          <h4>{`${user.firstName} ${user.lastName}`}</h4>
          <p className="text-muted">{user.email}</p>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="form-group mb-3">
            <label htmlFor="firstName" className="font-weight-bold">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={user.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="lastName" className="font-weight-bold">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={user.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email" className="font-weight-bold">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn text-white me-2"
              style={{ backgroundColor: "#f24e1e" }}
            >
              Update Info
            </button>
            <button
              type="button"
              className="btn text-white"
              style={{ backgroundColor: "#f24e1e" }}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountInfo;
