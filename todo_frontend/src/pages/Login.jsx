import { useState } from "react";
import log_img from "../assets/login.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4001/api/users/login",
        {
          username,
          password,
        }
      );

      console.log(response); // Debugging log

      if (response.status === 200) {
        // Change this to match your backend status code
        const { accessToken } = response.data;
        localStorage.setItem("token", accessToken);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error(error); // Log the full error for debugging
      toast.error(
        error.response?.data?.error ||
          "Login failed, please check your credentials"
      );
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FF6767",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ToastContainer />
      <div style={{ width: "1000px", marginTop: "10px" }}>
        {/* Parent div with Flexbox */}
        <div className="d-flex align-items-center p-2 rounded shadow bg-white">
          {/* Form Section */}
          <div style={{ flex: "1", paddingRight: "20px" }}>
            <form className="p-4 rounded" onSubmit={handleSubmit}>
              <h2>Sign In</h2>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: "#FF6767" }}
              >
                Login
              </button>

              {/* Don't have an account? */}
              <div className="mt-3">
                <p>
                  Don't have an account?{" "}
                  <a href="/register" className="text-primary">
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div style={{ flex: "1", paddingLeft: "20px" }}>
            <img
              src={log_img}
              alt="Login"
              className="img-fluid rounded"
              style={{ width: "100%", height: "550px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
