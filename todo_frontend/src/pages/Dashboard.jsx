import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import profileImg from "../assets/profile.jpg";
import Navbar from "../components/Navbar";
import { MdDashboard } from "react-icons/md";
import { FaExclamation } from "react-icons/fa";
import { BiTask } from "react-icons/bi";
import { RiMenuFold2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { MdHelp } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VitalTask from "../components/other items/VitalTask";
import MyTask from "../components/other items/MyTask";
import TaskCategories from "../components/other items/TaskCategories";
import TaskDashboard from "../components/other items/TaskDashboard";
import AccountInfo from "../components/other items/AccountInfo"; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
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

        setUser(response.data.user);
      } catch (error) {
        const errorMsg = error.response?.data?.msg || error.message;
        setError(`Error fetching user data: ${errorMsg}`);
      }
    };

    fetchUserInfo();
  }, []);

  // Update selected state based on location
  useEffect(() => {
    const path = location.pathname.split("/")[2]; // Get the second part of the path
    setSelected(path || "dashboard"); // Set to "dashboard" if no specific path
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileClick = () => {
    setSelected("account-info"); // Set the selected state
    navigate("/dashboard/account-info"); // Navigate directly to the AccountInfo route
  };

  const handleGoBack = () => {
    navigate("/dashboard"); // Navigate to dashboard using navigate
  };

  return (
    <>
      <Navbar />

      <div className="d-flex">
        {/* Sidebar */}
        <div
          className="d-flex flex-column p-3"
          style={{
            width: "250px",
            minHeight: "85vh",
            backgroundColor: "#ff6767",
          }}
        >
          <div className="d-flex justify-content-center mb-4">
            <img
              src={profileImg}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover", cursor: "pointer" }}
              onClick={handleProfileClick} 
            />
          </div>
          {error && <div className="text-center text-danger mb-4">{error}</div>}
          {user && (
            <div className="text-center mb-4 text-white">
              <h5>
                {user.firstName} {user.lastName}
              </h5>
              <p>{user.email}</p>
            </div>
          )}

          {/* Sidebar Links */}
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link
                className={`nav-link d-flex align-items-center ${selected === "dashboard" ? "bg-white text-dark" : "text-white"} p-2 rounded`}
                to="/dashboard"
                onClick={() => setSelected("dashboard")}
              >
                <MdDashboard className="me-2" /> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link d-flex align-items-center ${selected === "vital-task" ? "bg-white text-dark" : "text-white"} p-2 rounded`}
                to="/dashboard/vital-task"
                onClick={() => setSelected("vital-task")}
              >
                <FaExclamation className="me-2" /> Vital Task
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link d-flex align-items-center ${selected === "my-task" ? "bg-white text-dark" : "text-white"} p-2 rounded`}
                to="/dashboard/my-task"
                onClick={() => setSelected("my-task")}
              >
                <BiTask className="me-2" /> My Task
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link d-flex align-items-center ${selected === "task-categories" ? "bg-white text-dark" : "text-white"} p-2 rounded`}
                to="/dashboard/task-categories"
                onClick={() => setSelected("task-categories")}
              >
                <RiMenuFold2Fill className="me-2" /> Task Categories
              </Link>
            </li>
            {/* Help and Settings Links */}
            <li className="nav-item mb-2">
              <Link
                className={`nav-link d-flex align-items-center ${selected === "settings" ? "bg-white text-dark" : "text-white"} p-2 rounded`}
                to="/dashboard/settings"
                onClick={() => setSelected("settings")}
              >
                <IoMdSettings className="me-2" /> Settings
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                className={`nav-link d-flex align-items-center ${selected === "help" ? "bg-white text-dark" : "text-white"} p-2 rounded`}
                to="/dashboard/help"
                onClick={() => setSelected("help")}
              >
                <MdHelp className="me-2" /> Help
              </Link>
            </li>
          </ul>

          {/* Logout Button */}
          <div className="mt-auto">
            <button className="btn text-white d-flex align-items-center" style={{ width: "100%" }} onClick={handleLogout}>
              <IoLogOut className="me-2" /> Logout
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1 p-4">
          {location.pathname === "/dashboard/account-info" ? (
            <AccountInfo onGoBack={handleGoBack} />
          ) : (
            <>
              {location.pathname === "/dashboard/vital-task" && <VitalTask />}
              {location.pathname === "/dashboard/my-task" && <MyTask />}
              {location.pathname === "/dashboard/task-categories" && <TaskCategories />}
              {location.pathname === "/dashboard" && <TaskDashboard />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
