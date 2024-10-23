import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  // State to track form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State to track login error
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear error message before submission

    if (formData.username !== "" && formData.password !== "") {
      try {
        const response = await axios.post(
          "https://localhost:7294/api/Login",
          {
            UserName: formData.username,
            Password: formData.password,
          },
          {
            withCredentials: true, // Ensures that cookies (AuthToken) are sent
          }
        );

        window.sessionStorage.setItem("IsUserActive", "true");
        window.sessionStorage.setItem("UserInfo", JSON.stringify(response.data.user));

        // Only navigate if the AuthToken is retrieved or exists
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
        setErrorMessage("Username or Password is incorrect"); // Set error message
      }
    } else {
      setErrorMessage("Please fill in both fields"); // Handle case where fields are empty
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div
        className="p-4 login-form"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {/* Display error message if exists */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-3">
            <label htmlFor="formUsername" className="form-label">Username</label>
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <input
                type="text"
                className="form-control"
                id="formUsername"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="formPassword" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text" style={{backgroundColor:'transparent'}}>
                <FontAwesomeIcon icon={faLock}  />
              </span>
              <input
                type="password"
                className="form-control"
                id="formPassword"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-dark w-100 login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
