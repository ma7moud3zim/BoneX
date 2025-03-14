import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import avtmale from "../images/avatar-male.jpg";
import notificationIcon from "../images/notification.png";
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

  const [showNotifications, setShowNotifications] = useState(false);


  // we should retrieve notifications here after logged in
  const notifications = [
      { id: 1, message: "You have a new message." },
      { id: 2, message: "Your appointment is confirmed." },
      { id: 3, message: "New updates are available." },
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
}, [showNotifications])

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

          <div className="notification-icon" onClick={toggleNotifications}>
                <img src={notificationIcon} alt="Notification Icon" />
                { showNotifications && (
                    <div className="notification-dropdown">
                        <ul>
                            {notifications.map(notification => (
                                <li key={notification.id} className={`notification-item ${notification.type}`}>
                                    <span className="notification-icon">🔔 : </span>
                                    <span className="notification-message">{notification.message}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/notifications" className="view-all">View All</Link>
                    </div>
                )}
            </div>
            



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
