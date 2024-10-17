import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, Image, Card } from 'react-bootstrap';

function EditProfile() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    mobile: '',
    email: '',
    bloodGroup: '',
    height: '',
    bodyWeight: ''
  });
  
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
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
    // Handle form submission (e.g., API call to update profile)
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm rounded-lg border-0" style={{ maxWidth: '900px', margin: '0 auto', background: '#f9f9f9' }}>
        <h2 className="my-4 text-center text-primary">Update Profile</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              {/* Profile Form */}
              <Form.Group as={Row} controlId="formName" className="mb-3">
                <Form.Label column sm={3}>Name <span style={{ color: 'red' }}>*</span></Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="rounded-pill shadow-sm"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formGender" className="mb-3">
                <Form.Label column sm={3}>Gender <span style={{ color: 'red' }}>*</span></Form.Label>
                <Col sm={9}>
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                    inline
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange}
                    inline
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formDOB" className="mb-3">
                <Form.Label column sm={3}>Date of Birth <span style={{ color: 'red' }}>*</span></Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="rounded-pill shadow-sm"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formMobile" className="mb-3">
                <Form.Label column sm={3}>Mobile <span style={{ color: 'red' }}>*</span></Form.Label>
                <Col sm={3}>
                  <Form.Control as="select" defaultValue="Egypt (+20)" className="rounded-pill shadow-sm">
                    <option>Egypt (+20)</option>
                    {/* Add more options as needed */}
                  </Form.Control>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="rounded-pill shadow-sm"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formEmail" className="mb-3">
                <Form.Label column sm={3}>Email <span style={{ color: 'red' }}>*</span></Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-pill shadow-sm"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formBloodGroup" className="mb-3">
                <Form.Label column sm={3}>Blood Group</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    as="select"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="rounded-pill shadow-sm"
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
                <Form.Label column sm={3}>Height <span style={{ color: 'red' }}>*</span></Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Enter height in cm"
                    required
                    className="rounded-pill shadow-sm"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formBodyWeight" className="mb-3">
                <Form.Label column sm={3}>Body Weight <span style={{ color: 'red' }}>*</span></Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="number"
                    name="bodyWeight"
                    value={formData.bodyWeight}
                    onChange={handleChange}
                    placeholder="Enter weight in kg"
                    required
                    className="rounded-pill shadow-sm"
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 6, offset: 3 }} className="text-center">
                  <Button variant="success" size="sm" type="submit" className="rounded-pill px-4">
                    Submit
                  </Button>
                </Col>
              </Form.Group>

              {/* Links below the button */}
              <Row className="text-center mt-2">
                <Col>
                  <a href="#" className="text-muted">Download Data</a> | <a href="#" className="text-muted">Delete Account</a>
                </Col>
              </Row>
            </Col>

            {/* Image Upload Section */}
            <Col md={4} className="text-center">
              <Image
                src={profileImage || "https://via.placeholder.com/150"}
                roundedCircle
                style={{ width: '150px', height: '150px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                alt="Profile"
                className="mb-3"
              />
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Upload Profile Picture</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} className="rounded-pill shadow-sm" />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
}

export default EditProfile;
