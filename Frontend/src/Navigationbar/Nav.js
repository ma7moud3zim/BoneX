import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import avtmale from "../images/avatar-male.jpg";
import avtfemale from "../images/avatarfm.webp";
import notification from "../images/notification.png";
import "./nav.css";

const Nav = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anUser, setAnUser] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem("userInfo");
    if (data) {
      console.log("entered");
      setAnUser(true);
      const parsedUser = JSON.parse(data);
      console.log("parsedUser:", parsedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    
   
    // Remove using the same key as stored ("userInfo")
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("anuser");
    navigate("/");
    window.location.reload(true);
  };

  return (
    <nav className="navbar">
      <Link to="/xray">X-ray Checker</Link>
      <Link to="/chat">Chat messages</Link>
      <Link to="/doctors">Doctors</Link>
      <Link to="/">Bonex</Link>

      {anUser ? (
        <div className="user-logged">
          <span className="user-name">{user.firstName}</span>
          <img
            src={user.gender === "1" ? avtmale : avtmale}
            alt="user-pic"
          />
          <img src={notification} alt="Notification Icon" />
          <Link onClick={handleLogout} style={{ marginLeft: "10px" }}>
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
