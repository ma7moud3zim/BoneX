import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegCommentDots, FaBell } from "react-icons/fa";

import logo from "../images/BoneX_Logo.png";
import "./nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anUser, setAnUser] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profilePicRef = useRef(null);
  const [isOpen, setisOpen] = useState(false);
  
  const togglemenu = () => {
    setisOpen(!isOpen);
  };

  const userp = `https://bonex.runasp.net/${user?.profilePicture}`;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        profilePicRef.current && !profilePicRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const data = sessionStorage.getItem("userInfo");
    if (data) {
      setAnUser(true);
      const parsedUser = JSON.parse(data);
      setUser(parsedUser);
    }
  }, []);

useEffect(() => {
  const fetchPatientData = async () => {
    if (user?.role === "Patient" && user?.token) {
      try {
        // Fetch location
        // const locationResponse = await fetch("https://bonex.runasp.net/Patient/location", {
        //   method: "GET",
        //   headers: {
        //     "Authorization": `Bearer ${user.token}`
        //   }
        // });
        
        // if (!locationResponse.ok) {
        //   throw new Error("Failed to fetch location");
        // }
        
        // const locationData = await locationResponse.json();
        // console.log("Location data:", locationData);
        
        // // Format location string
        // let locationString;
        // if (locationData.latitude && locationData.longitude) {
        //   locationString = `${locationData.latitude},${locationData.longitude}`;
        // } else if (Array.isArray(locationData)) {
        //   locationString = locationData.join(',');
        // } else {
        //   throw new Error("Unexpected location data format");
        // }
        
        // Create form data
        const formData = new FormData();
        formData.append('user_location', "35.5,35.5");
        
        // Get recommendations using location
        const recommendationResponse = await fetch("https://bonex.runasp.net/Patient/get-recommendations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`
          },
          body: formData
        });
        
        if (!recommendationResponse.ok) {
          const errorText = await recommendationResponse.text();
          throw new Error(`Recommendations failed: ${recommendationResponse.status} - ${errorText}`);
        }
        
        const recommendationData = await recommendationResponse.json();
        console.log("Recommendations:", recommendationData);
        
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    }
  };
  
  fetchPatientData();
}, [user]);
  const notifications = [
    { id: 1, message: "You have a new message." },
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    let timer;
    if (showNotifications) {
      timer = setTimeout(() => {
        setShowNotifications(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showNotifications]);

  return (
    <nav className="navbar">
      <Link to={user === null ? "/" : user.role === "Patient" ? "/" : "homed"} id="logo">
        <img src={logo} alt="Bonex Logo" className="ign" />
      </Link>
     
      <Link to="/xray">X-ray Checker</Link>
      <Link to="/doctorsv1" hidden={user?.role === "Doctor"}>Doctors</Link>

      {anUser ? (
        <div className="user-logged">
          <span className="user-name">{user.firstName}</span>
          <div className="user-profile" style={{ position: "relative" }}>
            <img
              ref={profilePicRef}
              src={userp}
              alt="user-pic"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{ cursor: "pointer" }}
              />
            {showUserDropdown && (
              <div ref={dropdownRef} className="user-dropdown">
                <Link to={user.role === "Patient" ? "/profile" : `doctorprofile/${user?.id}`}>
                  View Profile
                </Link>
                <Link to="/changepassword">Change Password</Link>
              </div>
            )}
          </div>

          {/* Chat Icon */}
          <Link to="/chat" style={{ marginRight: "10px" }} title="Chat Page">
            <FaRegCommentDots size={24} style={{ cursor: "pointer", color: "#fff" }} />
          </Link>

          {/* Notification Icon */}
          <div className="notification-container" style={{ position: "relative" }}>
            <button
              className="notification-btn"
              onClick={toggleNotifications}
              aria-label="Toggle notifications"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              title="Notifications"
              >
              <FaBell size={24} className="notification-icon" />
            </button>
            <div className={`notification-dropdown ${showNotifications ? "show" : ""}`}>
              <ul>
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification.id} className="notification-item">
                      <span className="icon" aria-hidden="true">🔔</span>
                      <span className="message">{notification.message}</span>
                    </li>
                  ))
                ) : (
                  <li className="notification-item">
                    <span className="message">No new notifications</span>
                  </li>
                )}
              </ul>
              <Link to="/notifications" className="view-all">
                View All
              </Link>
            </div>
          </div>

          <Link
            onClick={() => {
              sessionStorage.clear();
              navigate("/login");
              window.location.reload();
            }}
            style={{ marginLeft: "10px" }}
            >
            Logout
          </Link>
        </div>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">SignUp</Link>
        </>
      )}
    </nav>
  );
};

export default Nav;