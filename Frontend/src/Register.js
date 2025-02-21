import React, { useState } from 'react';
import logo from './images/Logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  // State for each form field
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [address, setAddress] = useState('');

  // State to store validation errors
  const [errors, setErrors] = useState({});

  // Handler for form submit
  const handleSubmit =async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validate username
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Validate email using a basic regex
    if (!email.trim()) {
      newErrors.email = 'A valid email is required';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate confirm password
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate telephone
    if (!telephone.trim()) {
      newErrors.telephone = 'Telephone is required';
    }

    // Validate address
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    // If there are errors, update the state, otherwise process the form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {

  
            
        try {
          console.log('hello');
          
            const response = await axios.post(
              "http://bonex.runasp.net/Auth/register",
              {
                "email": email,
                "password": password,
                "firstName": username,
                "lastName": username,
                "dateOfBirth": "2025-02-19",
                "gender": 1,
                "phoneNumber": '+201551704101'
              },
              
            );


       console.log('entered');
            
            if(response.status===200){
          
            window.sessionStorage.setItem("anuser", true);
            const userData = {
              
              email: email,
              firstName: username,
              lastName: username,
              gender: 2,
              
             
            };
            console.log('from form',userData);
            
            sessionStorage.setItem("userInfo", JSON.stringify(userData));

              // Clear errors and process form (e.g., call an API)
      setErrors({});
      console.log('Form submitted successfully!');
      // Reset form fields if needed:
       setUsername('');
       setEmail('');
       setPassword('');
       setConfirmPassword('');
       setTelephone('');
       setAddress('');
              
            // Only navigate if the AuthToken is retrieved or exists
            navigate("/")
            window.location.reload(true);
            }
          } catch (error) {
            console.error("Login failed:", error);
           
          }
          

    }
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <div>
          <img className="logo" src={logo} alt="Bonex Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <span>UserName</span>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>
            <div className="input-group">
              <span>Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <div className="input-group">
              <span>Confirm Password</span>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword}</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <div className="input-group">
              <span>Telephone</span>
              <input
                type="tel"
                placeholder="Enter your telephone number"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
              {errors.telephone && <span className="error">{errors.telephone}</span>}
            </div>
            <div className="input-group">
              <span>Address</span>
              <input
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>
          </div>
          
          <div className="signup">
            <button type="submit">
              SignUp <i className="bx bx-chevrons-right" style={{ fontSize: '17px' }}></i>
            </button>
          </div>
        </form>
        <div className="line">
          <span className="or">Or Continue With</span>
        </div>
        <div className="social-login">
          <i className="bx bxl-facebook-circle" style={{ fontSize: '40px', color: '#1877F2' }}></i>
          <i className="bx bxl-google" style={{ fontSize: '40px', color: '#DB4437' }}></i>
          <i className="bx bxl-apple" style={{ fontSize: '40px', color: '#000' }}></i>
        </div>
      </div>
      <div className="info">
        <div className="info-section">
          <h3>Why Register?</h3>
          <p>
            . Consult Doctors Anytime.
            <br />
            . No Travel. No Waiting Queue. Comfort of Your Home
          </p>
        </div>
        <div className="info-section">
          <h3>Are You a Doctor?</h3>
          <Link to="/Doctor1" className="signup-btn">
            sign up here <i className="bx bx-chevrons-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
