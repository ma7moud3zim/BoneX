import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import maleavatar from "./images/MaleAvatar.png"
import './main.css'
const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarVisible, setCalendarVisible] = useState(false);

  // Ref for detecting clicks outside the date picker
  const containerRef = useRef(null);

  // Month names (for the month dropdown)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


  // Close the calendar when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setCalendarVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // When a day is clicked, update the selected date and close the calendar
  const handleDayClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setCalendarVisible(false);
  };

  // Render the calendar days
  const renderCalendarDays = () => {
    // Determine the first day of the month (0 = Sunday)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Get total days in the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    // Add empty placeholders for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<span key={`empty-${i}`} className="empty"></span>);
    }
    // Add days for the month
    for (let day = 1; day <= daysInMonth; day++) {
      const thisDay = new Date(currentYear, currentMonth, day);
      const today = new Date();
      const isToday =
        thisDay.getDate() === today.getDate() &&
        thisDay.getMonth() === today.getMonth() &&
        thisDay.getFullYear() === today.getFullYear();
      const isSelected =
        selectedDate &&
        thisDay.getDate() === selectedDate.getDate() &&
        thisDay.getMonth() === selectedDate.getMonth() &&
        thisDay.getFullYear() === selectedDate.getFullYear();

      days.push(
        <span
          key={day}
          className={`day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </span>
      );
    }
    return days;
  };

  // Handle navigation to the previous month
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Handle navigation to the next month
  const handleNextMonth = (e) => {
    e.stopPropagation();
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Handle month dropdown change
  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value, 10));
  };

  // Handle year dropdown change
  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value, 10));
  };










  useEffect(() => {
    const handleClick = (event) => {
      const isToggle = event.target.closest(".dropdown-toggle");
      
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        if (!isToggle || menu !== isToggle.nextElementSibling) {
          menu.classList.remove("show");
        }
      });
  
      if (isToggle) {
        event.stopPropagation();
        isToggle.nextElementSibling.classList.toggle("show");
      }
    };
  
    document.addEventListener("click", handleClick);
  
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);


  return (
    
  <>
  <div className="homebody">

    <div className="doctor-card male">

      <div className="docinfo">
        <p className="greeting">Welcome back, Have a nice day at work!</p>
        <h1 className="DoctorName">Dr. John Smith</h1>
        <p className="specialities">MD, DM (Internal Medicine), FACP</p>
        <h2 className="todaysApp">
          You have total <span>10 Appointments</span> today!
        </h2>
      </div>
      
      <img src={maleavatar} alt="Male Doctor Avatar" />
    </div>

    
    <h4
      style={{
        fontSize: '32px',
        color: 'var(--secondary-accent)',
        marginLeft: '50px',
        marginBottom: '1rem'
      }}
      
    >
     Statistics
    </h4>

    
    <div className="cards-container">
      <div className='r1' >
      <div className="card purple">
        <div className="icon-container">
          <span className="material-icons">calendar_today</span>
        </div>
        <div>
          <h3>250</h3>
          <p>Appointments</p>
        </div>
      </div>
      <div className="card red">
        <div className="icon-container">
          <span className="material-icons">person</span>
        </div>
        <div>
          <h3>250</h3>
          <p>Total Patients</p>
        </div>
      </div>
      <div className="card orange">
        <div className="icon-container">
          <span className="material-icons">medical_services</span>
        </div>
        <div>
          <h3>150</h3>
          <p>Clinic Consulting</p>
        </div>
      </div>
      <div className="card blue">
        <div className="icon-container">
          <span className="material-icons">videocam</span>
        </div>
        <div>
          <h3>100</h3>
          <p>online Consulting</p>
        </div>
      </div>
      </div>

      <div className='r2'>
      <div className="card green">
        <div className="icon-container">
          <span className="material-icons">event_busy</span>
        </div>
        <div>
          <h3>5%</h3>
          <p>No-Show Rates</p>
        </div>
      </div>
      <div className="card teal">
        <div className="icon-container">
          <span className="material-icons">cancel</span>
        </div>
        <div>
          <h3>10</h3>
          <p>Canceled Appointments</p>
        </div>
      </div>

      <div className="card indigo">
        <div className="icon-container">
          <span className="material-icons">star</span>
        </div>
        <div>
          <h3>4.8 / 5 ⭐</h3>
          <p>Consultation Ratings</p>
        </div>
      </div>
  
    
      <div className="card cyan">
        <div className="icon-container">
          <span className="material-icons">schedule</span>
        </div>
        <div>
          <h3>12 min</h3>
          <p>Average Waiting Time</p>
        </div>
      </div>
      </div>
    </div>
    

    
    <div className="schedule-section">
      <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
      
      >
        <span
      style={{
        fontSize: '24px',
        color: 'var(--secondary-accent)',
        fontWeight: 'bold',
        marginLeft: '20px'
      }}
      
          >Schedule List:</span
        >
        <div className="search-filter-wrapper">
     
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search Appointment, Patient or etc"
            />
          </div>
          
          <div className="filter-dropdown">
            <label for="appointment-status" className="filter-label"
              >Filter By</label
            >
            <select name="appointment-status" id="appointment-status">
              <option value="">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Appointment Date &amp; Time</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Appointment Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
       
          <tr>
            <td>
              <div className="patient-info">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="John Doe"
                />
                <span>John Doe</span>
              </div>
            </td>
            <td>2025-02-20 10:00 AM to 11:00 AM</td>
            <td>Male</td>
            <td>1985-04-12</td>
            <td>Clinic</td>
            <td>
              <span className="status status-booked">Booked</span>
            </td>
            <td>
             
              <div className="dropdown">
                <i className="fas fa-ellipsis-h dropdown-toggle" title="Actions"></i>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-comment-dots"></i>Message Patient
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-info-circle"></i>View More Details
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-times"></i>Cancel Appointment
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-edit"></i>Edit Time
                  </a>
                </div>
              </div>
            </td>
          </tr>

          
          <tr>
            <td>
              <div className="patient-info">
                <img
                  src="https://randomuser.me/api/portraits/women/2.jpg"
                  alt="Jane Smith"
                />
                <span>Jane Smith</span>
              </div>
            </td>
            <td>2025-02-20 11:30 AM to 12:30 PM</td>
            <td>Female</td>
            <td>1990-08-25</td>
            <td>Online</td>
            <td>
              <span className="status status-completed">Completed</span>
            </td>
            <td>
              <div className="dropdown">
                <i className="fas fa-ellipsis-h dropdown-toggle" title="Actions" ></i>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-comment-dots"></i>Message Patient
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-info-circle"></i>View More Details
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-times"></i>Cancel Appointment
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-edit"></i>Edit Time
                  </a>
                </div>
              </div>
            </td>
          </tr>

          
          <tr>
            <td>
              <div className="patient-info">
                <img
                  src="https://randomuser.me/api/portraits/men/3.jpg"
                  alt="Robert Brown"
                />
                <span>Robert Brown</span>
              </div>
            </td>
            <td>2025-02-20 02:00 PM to 03:00 PM</td>
            <td>Male</td>
            <td>1978-12-05</td>
            <td>Clinic</td>
            <td>
              <span className="status status-canceled">Canceled</span>
            </td>
            <td>
              <div className="dropdown">
                <i className="fas fa-ellipsis-h dropdown-toggle" title="Actions"></i>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-comment-dots"></i>Message Patient
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-info-circle"></i>View More Details
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-times"></i>Cancel Appointment
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-edit"></i>Edit Time
                  </a>
                </div>
              </div>
            </td>
          </tr>

       
          <tr>
            <td>
              <div className="patient-info">
                <img
                  src="https://randomuser.me/api/portraits/men/4.jpg"
                  alt="Michael Green"
                />
                <span>Michael Green</span>
              </div>
            </td>
            <td>2025-02-20 03:00 PM to 04:00 PM</td>
            <td>Male</td>
            <td>1992-06-15</td>
            <td>Online</td>
            <td>
              <span className="status status-noshow">No Show</span>
            </td>
            <td>
              <div className="dropdown">
                <i className="fas fa-ellipsis-h dropdown-toggle" title="Actions"></i>
                <div className="dropdown-menu">
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-comment-dots"></i>Message Patient
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-info-circle"></i>View More Details
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-times"></i>Cancel Appointment
                  </a>
                  <a href="#" className="dropdown-item">
                    <i className="fas fa-edit"></i>Edit Time
                  </a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </>
  );
};

export default HomePage;