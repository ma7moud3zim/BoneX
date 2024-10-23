import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Card,
} from "react-bootstrap";
import AvatarMale from "./images/avatar-male.jpg";
import AvatarFemale from "./images/avatarfm.webp";

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    email: "",
    bloodGroup: "",
    height: "",
    bodyWeight: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = window.sessionStorage.getItem("UserInfo");
    if (data) {
      const res = JSON.parse(data);
      setUser(res);

      setFormData({
        name: res.userName || "",
        gender: res.gender || "",
        dateOfBirth: res.dateOfBirth || "",
        mobile: res.mobile || "",
        email: res.email || "",
        bloodGroup: res.bloodGroup || "",
        height: res.height || "",
        bodyWeight: res.bodyWeight || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add logic to handle form submission
  };

  return (
    <div className="container-fluid mt-5" style={{ backgroundColor: "#EBF4F6" }}> {/* Changed container background */}
      <Card
        className="p-4 shadow-sm rounded-lg border-0"
        style={{ maxWidth: "900px", margin: "0 auto", background: "#FFFFFF" }}
      >
        <h2 className="my-4 text-center" style={{ color: "#071952" }}>Update Profile</h2> {/* Changed heading color */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group as={Row} controlId="formName" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Name <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }} // Border color for inputs
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formGender" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Gender <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Col sm={9}>
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleChange}
                    inline
                    style={{ color: "#071952" }}
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleChange}
                    inline
                    style={{ color: "#071952" }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formDOB" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Date of Birth <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formMobile" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Mobile <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    as="select"
                    defaultValue="Egypt (+20)"
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }}
                  >
                    <option>Egypt (+20)</option>
                    {/* Add more country code options as needed */}
                  </Form.Control>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={formData.mobile || user?.phoneNumber || ""}
                    onChange={handleChange}
                    required
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formEmail" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Email <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formBloodGroup" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Blood Group
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="select"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }}
                  >
                    <option>Choose your blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHeight" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Height <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Enter height in cm"
                    required
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formBodyWeight" className="mb-3">
                <Form.Label column sm={3} style={{ color: "#071952" }}>
                  Body Weight <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="number"
                    name="bodyWeight"
                    value={formData.bodyWeight}
                    onChange={handleChange}
                    placeholder="Enter weight in kg"
                    required
                    className="rounded-pill shadow-sm"
                    style={{ borderColor: "#37B7C3" }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 6, offset: 3 }} className="text-center">
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    className="rounded-pill px-4"
                    style={{ backgroundColor: "#088395", borderColor: "#088395" }} // Button color
                  >
                    Submit
                  </Button>
                </Col>
              </Form.Group>

              <Row className="text-center mt-2">
                <Col>
                  <a href="#" className="text-muted">
                    Download Data
                  </a>{" "}
                  |{" "}
                  <a href="#" className="text-muted">
                    Delete Account
                  </a>
                </Col>
              </Row>
            </Col>

            <Col md={4} className="text-center">
              <Image
                src={
                  profileImage ||
                  (user && user.gender === "Female" ? AvatarFemale : AvatarMale)
                }
                roundedCircle
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                alt="Profile"
                className="mb-3"
              />
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label style={{ color: "#071952" }}>Upload Profile Picture</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                  className="rounded-pill shadow-sm"
                  style={{ borderColor: "#37B7C3" }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default EditProfile;
