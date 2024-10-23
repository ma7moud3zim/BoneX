import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Import the bell icon
import logo from '../images/Logo.jpg';
import AvatarMale from '../images/avatar-male.jpg';
import AvatarFemale from '../images/avatarfm.webp';

function NavigationBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [showNotifications, setShowNotifications] = useState(false); // State to toggle notifications

  useEffect(() => {
    const data = window.sessionStorage.getItem('UserInfo');
    if (data !== null) {
      const res = JSON.parse(data);
      setUser(res);
    }
  }, []);

  const handleLogout = () => {
    window.sessionStorage.setItem('IsUserActive', 'false');
    window.sessionStorage.setItem('UserInfo', null);
    navigate('/');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications); // Toggle the notification dropdown
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#071952' }}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src={logo}
            alt="logo"
            height="50"
            width="50"
            className="rounded-circle"
            style={{ objectFit: 'cover' }} // Custom styling for the logo
          />
        </Link>
        <Link to="/consultion" className="nav-link text-light animate__shakeX animate__delay-5s" style={{ color: '#37B7C3' }}>
          Consult a Doctor
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {window.sessionStorage.getItem('IsUserActive') === 'false' || window.sessionStorage.getItem('IsUserActive') === null ? (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-light" style={{ color: '#37B7C3' }}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link text-light" style={{ color: '#37B7C3' }}>Register</Link>
                </li>
              </>
            ) : (
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button
                    className="btn btn-link dropdown-toggle text-light"
                    id="dropdownUserButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ textDecoration: 'none', color: '#EBF4F6' }}
                  >
                    Welcome! <span className="fw-bold">{user?.userName || ''}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownUserButton">
                    <li><Link to="/editprofile" className="dropdown-item">Edit Profile</Link></li>
                    <li><Link to="/changepassword" className="dropdown-item">Change Password</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button onClick={handleLogout} className="dropdown-item">Log Out</button></li>
                  </ul>
                </div>
                <img
                  src={user?.gender === 'female' ? AvatarFemale : AvatarMale}
                  alt="avatar"
                  height="50"
                  width="50"
                  className="rounded-circle ms-2"
                  style={{ objectFit: 'cover', border: '2px solid #088395' }} // Custom styling for the avatar
                />
                <div className="position-relative">
                  <FontAwesomeIcon
                    icon={faBell}
                    className="ms-3 animate__shakeX"
                    style={{ fontSize: '24px', cursor: 'pointer', color: 'white' }}
                    onClick={toggleNotifications}
                  />
                  {showNotifications && (
                    <div
                      className="position-absolute"
                      style={{
                        right: 0,
                        top: '40px',
                        backgroundColor: '#EBF4F6',
                        width: '300px',
                        boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                        borderRadius: '5px',
                        zIndex: 1000,
                        color: '#071952'
                      }}
                    >
                      <div className="p-3">
                        <h6>Notifications</h6>
                        <hr />
                        {/* Add notifications here */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
