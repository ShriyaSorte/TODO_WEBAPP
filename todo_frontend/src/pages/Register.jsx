import { useState } from "react";
import reg_img from "../assets/register.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  async function register(payload) {
    try {
      const response = await axios.post(
        "http://localhost:4001/api/users/register",
        payload
      );
      toast.success(response.data.message || "Registration Successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
    };

    await register(payload);
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
          {/* Image Section */}
          <div style={{ flex: "1", paddingRight: "20px" }}>
            <img
              src={reg_img}
              alt="Todo"
              className="img-fluid rounded"
              style={{ width: "100%", height: "550px", objectFit: "cover" }}
            />
          </div>

          {/* Form Section */}
          <div style={{ flex: "1" }}>
            <form className="p-4 rounded" onSubmit={handleSubmit}>
              <h2>Sign Up</h2>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  value={lastName}
                  onChange={handleLastNameChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>

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
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
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

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Agree to Terms Checkbox */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  required
                />
                <label className="form-check-label" htmlFor="terms">
                  I agree to all terms and conditions
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="btn text-white"
                style={{ backgroundColor: "#FF6767" }}
              >
                Register
              </button>

              {/* Already have an account? */}
              <div className="mt-3">
                <p>
                  Already have an account?{" "}
                  <a href="/login" className="text-primary">
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;