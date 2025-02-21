import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import avtmale from "../images/avatar-male.jpg";
import avtfemale from "../images/avatarfm.webp";
import notification from "../images/notification.png";
import "./nav.css";
import logo  from '../images/BoneX_Logo.png';
import chat from '../images/chat.png';


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
      <Link to="/"><img src={logo} alt="Bonex Logo" className="ign" /></Link>
      <Link to="/xray">X-ray Checker</Link>
      <Link to="/doctors">Doctors</Link>

      {anUser ? (
        <div className="user-logged">
          <span className="user-name">{user.firstName}</span>
          <Link to="/profile">
          <img
            src={user.gender === "1" ? avtmale : avtmale}
            alt="user-pic"
          />
          </Link>
          <Link to="/chat"><img src={chat} alt="chat" className="ign" /></Link>
          <Link to="/notfications"><img src={notification} alt="Nsotification Icon" /></Link>
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
