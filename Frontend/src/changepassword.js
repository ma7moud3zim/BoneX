import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import "./styles.css"; // Import the custom CSS for animations
import axios from "axios";

const Changepassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setShowCard(true); // Trigger animation on mount
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
    } else if (newPassword === oldPassword) {
      setMessage("The new Password Should be not equal the old password.");
    } else {
      // Add password change logic here
      axios
        .put(
          "https://localhost:7294/api/Patient/reset-password",
          {
            currentPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setMessage("Password changed successfully");
        })
        .catch((error) => {
          console.log(error.response.data);

          setMessage(error.response.data);
        });
    }
  };

  return (
    <Container className="mt-5 " >
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card
            className={`rounded-lg p-4 shadow-sm border-0 animated-card ${
              showCard ? "show" : ""
            }`}
            style={{ background: "#f9f9f9" }}
          >
            <h2 className="text-center mb-4">Change Your Password</h2>
            <p className="text-center text-muted">
              Use the form below to update your password
            </p>

            {message && (
              <Alert
                variant={
                  message === "Password changed successfully"
                    ? "info"
                    : "danger"
                }
                className="text-center"
              >
                {message}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12}>
                  <Form.Group controlId="oldPassword" className="mb-3">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter old password"
                      required
                      className="rounded-pill shadow-sm"
                      style={{ borderColor: "#37B7C3" }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="newPassword" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="rounded-pill shadow-sm pr-5" // Added extra padding on the right
                        style={{ borderColor: "#37B7C3" }}
                      />
                      <Button
                        variant="link"
                        onClick={togglePasswordVisibility}
                        className="position-absolute end-0 top-0 mt-1 me-3 p-0" // Positioned to the right
                        style={{ border: "none", outline: "none" }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          style={{ color: "#37B7C3", fontSize: "1.2rem" }} // Adjusted size and color
                        />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="rounded-pill shadow-sm pr-5" // Added extra padding on the right
                        style={{ borderColor: "#37B7C3" }}
                      />
                      <Button
                        variant="link"
                        onClick={togglePasswordVisibility}
                        className="position-absolute end-0 top-0 mt-1 me-3 p-0" // Positioned to the right
                        style={{ border: "none", outline: "none" }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          style={{ color: "#37B7C3", fontSize: "1.2rem" }} // Adjusted size and color
                        />
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col xs={12} className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3 rounded-pill px-4"
                    style={{
                      backgroundColor: "#088395",
                      borderColor: "#088395",
                    }}
                  >
                    Change Password
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Changepassword;
