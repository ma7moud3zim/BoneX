import React, { useEffect, useState } from "react";
import "./notifications.css"; // Custom CSS file for additional styling
import { Link } from "react-router-dom";

const Notifications = () => {
  const [feedbackapps, setFeedbackapps] = useState(
    JSON.parse(sessionStorage.getItem("nonfeedbackedApps"))
  );
  const [notifications, setNotifications] = useState([]);
  const [appointment, setAppointment] = useState(
    JSON.parse(sessionStorage.getItem("Appointment"))
  );

  useEffect(() => {
    if (!appointment) return;
    console.log("hi from appointment");
    const ntf = {
      id: appointment.id,
      message: `Hi ${appointment.patientName}! Your appointment with Dr. ${appointment.doctorName} is scheduled at ${appointment.scheduledTime}. Please arrive 15 minutes early. Thank you!`,
      time: "A while ago",
      status: "appointment"
    };

    const newNotifications = [ntf];
    setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);
  }, [appointment]);

  useEffect(() => {
    if (!feedbackapps) return;
    console.log("hi from nv");
    
    const newNotifications = feedbackapps.map((app) => {
      const ntf = {
        id: app.id,
        message: `Hi ${app.patientName}! We hope you had a positive experience with your doctor ${app.doctorName}. Please share your feedback to help us improve our services. Thank you!`,
        time: "1 hour ago",
        status: "feedback"
      };
      console.log(ntf);
      return ntf;
    });

    setNotifications(newNotifications);
  }, [feedbackapps]);

  return (
    <div className="notifications-page container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Notifications</h2>
      <ul className="notification-list space-y-4">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="notification-item bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="notification-info flex-1">
              <p className="notification-message text-gray-800 font-medium">
                {notification.message}
              </p>
              <span className="notification-time text-sm text-gray-500">
                {notification.time}
              </span>
            </div>
            {notification.status === "feedback" && (
              <button className="fill-feedback-btn bg-[#287DA5] text-white px-4 py-2 rounded hover:bg-[#071952] transition-colors ml-4">
                <Link
                  to={`/patientfeedback/${notification.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Fill Feedback
                </Link>
              </button>
            )}
            {notification.status === "appointment" && (
              <button className="join-meeting-btn bg-[#287DA5] text-white px-4 py-2 rounded hover:bg-[#071952] transition-colors ml-4">
                <Link
                  to="../meet"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Join Meeting
                </Link>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;