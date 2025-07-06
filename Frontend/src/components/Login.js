import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebookF, faApple } from "@fortawesome/free-brands-svg-icons";
import "./login.css";
import doctorImg from "../images/doctorimg3.png"; // Ensure your image path is correct

function Login() {
  const navigate = useNavigate();
 
  // State to track form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  // State to track login error
  const [errorMessage, setErrorMessage] = useState("");
  // State to control password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // State to control loading state during login request
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Toggle the visibility of the password
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevVisible) => !prevVisible);
  };
  
async function assignChatUser( Id, UserName){

  try{
const response=await axios.post("https://chatservice.runasp.net/api/ChatUsers", {
  Id: Id,
  UserName: UserName});
console.log('from assign');

  if(response.status===200||response.status===201){
  
    console.log('assignChatUser is done:',response.data);
  }

}catch(e)
  {
    console.log('assignChatUser is faild:',e);
    
  }

}
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear error message before submission

    if (formData.username && formData.password) {
      setLoading(true);
      try {
        const response = await axios.post("https://bonex.runasp.net/Auth", {
          email: formData.username,
          password: formData.password,
        });

        window.sessionStorage.setItem("anuser", true);
        window.sessionStorage.setItem("userInfo", JSON.stringify(response.data));
  
        // Update context with the user info
          

       console.log('from login:',response.data.id);
       console.log('from login:',response.data.firstName);
       try{
          const responsec=await axios.post("https://chatservice.runasp.net/api/ChatUsers", {
            id: response.data.id,
            userName: response.data.firstName ,
            profilePictureUrl: `https://bonex.runasp.net${response.data.profilePicture}`
            
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
            


        if (response.data.role === "Doctor") {
          navigate("/iv");
        } else {
          navigate("/");
        }
        window.location.reload(true);
      } catch (error) {
        console.error("Login failed:", error);
        setErrorMessage("Username or Password is incorrect");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage("Please fill in both fields");
    }
  };

  return (
    
    <div className="login-page animate__animated animate__slideInDown">
      <div className="login-container">
        {/* Left side: Image */}
        <div className="login-image">
          <img src={doctorImg} alt="Doctor" />
        </div>

        {/* Right side: Login form */}
        <div className="login-form-container">
          <h2 className="text-center mb-2">Welcome back 💫</h2>
          <p className="text-center mb-4">Login to your account</p>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="mb-3">
              <label htmlFor="formUsername" className="form-label">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                  type="text"
                  id="formUsername"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleInputChange}
                  aria-label="Username"
                  required
                  className="form-control"
                />
              </div>
            </div>

            {/* Password Input with Toggle */}
            <div className="mb-3 position-relative">
              <label htmlFor="formPassword" className="form-label">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="formPassword"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                  aria-label="Password"
                  required
                  className="form-control"
                />
                <span
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                  role="button"
                  tabIndex="0"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                </span>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="rememberMe"
                name="remember"
                checked={formData.remember}
                onChange={handleInputChange}
                className="form-check-input"
              />
              <label htmlFor="rememberMe" className="form-check-label" >
                Remember me 
              </label>
              <a href="/forgot-password" className="forgot-password" style={{float: "right"}}>
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className=" w-100 login-btn"
              disabled={loading}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Login"}
            </button>
          </form>


          {/* Sign up Prompt */}
          <p className="text-center mt-4">
            Don’t have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
