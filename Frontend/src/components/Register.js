import axios from "axios";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";

function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    phoneNumber: "",
    gender: "",
  });

  const [accept, setAccept] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAccept(true);

    // Form validation
    let flag = true;

    if (
      formData.userName === "" ||
      formData.email === "" ||
      formData.password.length < 8 ||
      formData.password !== formData.confirmPassword ||
      formData.age < 18 ||
      formData.gender === ""
    ) {
      flag = false;
    }

    if (flag) {
      axios
        .post(
          "https://localhost:7294/api/PatientAccount/register",
          {
            userName: formData.userName,
            Email: formData.email,
            password: formData.password,
            phone: formData.phoneNumber,
            gender: formData.gender,
            firstName: formData.userName
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          window.sessionStorage.setItem("IsUserActive", "true");
          console.log(formData)
          window.sessionStorage.setItem("UserInfo", JSON.stringify(formData));
          console.log("Registration data:", formData);

          navigate("/");
        })
        .catch((error) => {
          console.error("There was an error during registration!", error);
        });
    } else {
      console.log("Form validation failed.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div className="p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Register</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formuserName">
                <Form.Label>userName</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Gmail"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    variant="outline-primary"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </Button>
                </div>
                {formData.password.length < 8 && accept && (
                  <Form.Text style={{ color: "red", fontSize: "12px" }}>
                    * Password length should be at least 8 characters
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    variant="outline-primary"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </Button>
                </div>
                {formData.password !== formData.confirmPassword && accept && (
                  <Form.Text style={{ color: "red", fontSize: "12px" }}>
                    * Password does not match
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
                {formData.age < 18 && accept && (
                  <Form.Text style={{ color: "red", fontSize: "12px" }}>
                    * Age should be 18 or above
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <ToggleButtonGroup
              type="radio"
              name="gender"
              value={formData.gender}
              onChange={(value) => setFormData({ ...formData, gender: value })}
              className="w-100"
            >
              <ToggleButton
                id="gender-male"
                value="male"
                variant="outline-primary"
              >
                Male
              </ToggleButton>
              <ToggleButton
                id="gender-female"
                value="female"
                variant="outline-primary"
              >
                Female
              </ToggleButton>
            </ToggleButtonGroup>
            {formData.gender === "" && accept && (
              <Form.Text style={{ color: "red", fontSize: "12px" }}>
                * Please select your gender
              </Form.Text>
            )}
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Register;