// src/Notifications.js
import React from "react";
import "./notifications.css"; // Create this CSS file for styling

const Notifications = () => {
  const notifications = [
    { id: 1, message: "You have a new message.", time: "2 minutes ago" },
    { id: 2, message: "Your appointment is confirmed.", time: "1 hour ago" },
    { id: 3, message: "New updates are available.", time: "3 hours ago" },
  ];

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <ul className="notification-list">
        {notifications.map((notification) => (
          <li key={notification.id} className="notification-item">
            <div className="notification-content">
              <span className="notification-message">
                {notification.message}
              </span>
              <span className="notification-time">{notification.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;