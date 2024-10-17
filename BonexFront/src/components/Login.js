import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container, InputGroup, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toggleState } from '../RTK/slices/usersActiveslice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './login.css'; // Assuming you have custom styles in Login.css

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to track form data
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // State to track login error
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear error message before submission

    if (formData.username !== '' && formData.password !== '') {
      try {
        const response = await axios.post(
          'https://localhost:7294/api/Login',
          {
            UserName: formData.username,
            Password: formData.password,
          },
          {
            withCredentials: true // Ensures that cookies (AuthToken) are sent
          }
        );

        console.log(response); // Check if the response is coming as expected
        dispatch(toggleState('yes')); // Dispatch action to change isActive to true

        // Only navigate if the AuthToken is retrieved or exists
        navigate('/home');
      } catch (error) {
        console.error('Login failed:', error);
        setErrorMessage('Username or Password is incorrect'); // Set error message
      }
    } else {
      setErrorMessage('Please fill in both fields'); // Handle case where fields are empty
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div className="p-4 login-form" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        
        {/* Display error message if exists */}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Username Input */}
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faUser} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="rounded-start" // For rounded left corners
              />
            </InputGroup>
          </Form.Group>

          {/* Password Input */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faLock} />
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="rounded-start"
              />
            </InputGroup>
          </Form.Group>

          {/* Submit Button */}
          <Button variant="dark" type="submit" className="w-100 login-btn">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
