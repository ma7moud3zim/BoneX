import axios from 'axios';
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

if(formData.username!==''&&formData.password!==''){

  axios.post('https://localhost:44370/api/Account', {
          
    UserName: formData.username,
    Password: formData.password,
  
  })
  .then(response => {
window.localStorage.setItem('token',response.data.token);
window.localStorage.setItem('expiration',response.data.expiration);

window.location.pathname="/home";


  })
  .catch(error => console.log(error));



}


    console.log('Login data:', formData);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div className="p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;
