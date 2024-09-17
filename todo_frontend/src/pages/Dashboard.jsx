import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import profileImg from "../assets/profile_ss.jpg"; // Replace with your image path
import Navbar from "../components/Navbar";

const Sidebar = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div
        className="d-flex flex-column p-3 bg-light"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        {/* Profile Image */}
        <div className="d-flex justify-content-center mb-4">
          <img
            src={profileImg}
            alt="Profile"
            className="img-fluid rounded-circle"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>

        {/* Sidebar Links */}
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <a className="nav-link active" href="#">
              Dashboard
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link" href="#">
              Profile
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link" href="#">
              Settings
            </a>
          </li>
          <li className="nav-item mb-2">
            <a className="nav-link" href="#">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
