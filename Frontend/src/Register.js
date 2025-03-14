import React, { useState } from "react";
import logo from "./images/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import avtmale from "./images/avatar-male.jpg";
import avtfemale from "./images/avatarfm.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

import "./register.css";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(""); // "1" for male, "2" for female
  const [location, setLocation] = useState(null);
  const [locationChecked, setLocationChecked] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Get user location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationChecked(true);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // Validations
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "A valid email is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!telephone.trim()) newErrors.telephone = "Telephone is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!gender) newErrors.gender = "Please select a gender";
    if (!locationChecked) newErrors.location = "Please retrieve your location";

    // Set errors if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      
      // Dynamically choose profile picture based on gender
      setLoading(true);
      const profilePictureValue = gender === "1" ? avtmale : avtfemale;
    
      // Fetch the image and convert it to a Blob
      const responseForImage = await fetch(profilePictureValue);
      const imageBlob = await responseForImage.blob();
    
    
      // Create a new FormData instance
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("firstName", username);
      formData.append("lastName", username);
      formData.append("dateOfBirth", "2025-02-19");
      formData.append("gender", gender === "1" ? 1 : 2); // "1" for male, "2" for female
      formData.append("phoneNumber", telephone);
      
      // Append the image Blob with a filename
      formData.append(
        "profilePicture",
        imageBlob,
        gender === "1" ? "avatar-male.jpg" : "avatarfm.webp"
      );
      
      formData.append("address", address);
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);
      formData.append("pastMedicalConditions", "hand fracture");
      formData.append("chronicConditions", 1);
    
      const response = await axios.post(
        "http://bonex.runasp.net/Patient/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      if (response.status === 200) {

        try{
                  const responsec=await axios.post("http://chatservice.runasp.net/api/ChatUsers", {
                    id: email,
                    userName: username,
                    
                  });
                  console.log('from assign');
                  
                    if(responsec.status===200||responsec.status===201){
                    
                      console.log('assignChatUser is done:',responsec.data);
                    }
                  else 
              
                      console.log('assignChatUser is faild:',e);
                  }catch(e){
                    console.log('assignChatUser is faild:',e);
                    
                  }

        const userInfo = {
          email: email,
          password: password,
          firstName: username,
          lastName: username,
          dateOfBirth: "2025-02-19",
          gender: gender === "1" ? 1 : 2,
          phoneNumber: telephone,
          profilePicture: gender === "1" ? avtmale : avtfemale,
          address: address,
          latitude: location.latitude,
          longitude: location.longitude,
          pastMedicalConditions: "hand fracture",
          chronicConditions: 1,
          role: "patient",
        };
    
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
      finally {
        setLoading(false);

      }
  };

  return (
    <div className="main-container animate__animated animate__fadeInUp">
      <div className="form-container">
        <div>
          <img className="logo" src={logo} alt="Bonex Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <span>Username</span>
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

          <div className="form-group">
            
            <div className="toggle-container">
              <input
                type="radio"
                id="male"
                name="gender"
                value="1"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="male" className="toggle-btn">
                Male
              </label>

              <input
                type="radio"
                id="female"
                name="gender"
                value="2"
                onChange={(e) => setGender(e.target.value)}
              />
              <label htmlFor="female" className="toggle-btn">
                Female
              </label>
            </div>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          <div className="locationdv">
            <button
              type="button"
              onClick={handleGetLocation}
              className={`location-btn ${locationChecked ? "checked" : ""}`}
            >
              {locationChecked ? "Location Retrieved" : "Get My Location"}
            </button>
            {errors.location && <span className="error">{errors.location}</span>}
          </div>

          <div className="signup">
            <button type="submit"   disabled={loading}>
              
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "SignUp"}
            </button>
          </div>
        </form>

        <div className="line">
          <span className="or">Or Continue With</span>
        </div>
        <div className="social-login">
          <i className="bx bxl-facebook-circle" style={{ fontSize: "40px", color: "#1877F2" }}></i>
          <i className="bx bxl-google" style={{ fontSize: "40px", color: "#DB4437" }}></i>
          <i className="bx bxl-apple" style={{ fontSize: "40px", color: "#000" }}></i>
        </div>
      </div>
      <div className="info animate__animated animate__slideInRight">
        <div className="info-section">
          <h3>Why Register?</h3>
          <p>
            . Consult Doctors Anytime.
            <br />. No Travel. No Waiting Queue. Comfort of Your Home
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
