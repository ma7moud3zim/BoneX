import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import "./styles.css"; // Import the custom CSS for animations

const Changepassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    setShowCard(true); // Trigger animation on mount
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
    } else {
      // Add password change logic here
      setMessage("Password changed successfully");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className={`rounded-lg p-4 shadow-sm border-0 animated-card ${showCard ? "show" : ""}`} style={{ background: "#f9f9f9" }}>
            <h2 className="text-center mb-4">Change Your Password</h2>
            <p className="text-center text-muted">Use the form below to update your password</p>

            {message && <Alert variant="info" className="text-center">{message}</Alert>}

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
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="newPassword" className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <Form.Group controlId="confirmPassword" className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="justify-content-center">
                <Col xs={12} className="text-center">
                  <Button variant="primary" type="submit" className="w-100 mt-3">
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
