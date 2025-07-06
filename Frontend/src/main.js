import * as React from 'react';
import { useState, useEffect } from 'react';
import maleavatar from "./images/MaleAvatar.png";
import femaleavatar from "./images/FemaleAvatar1.png";
import RechartsPieChart from './RechartsPieChart';
import { Link } from 'react-router-dom';
import {
  Modal,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import AvailabilityModal from './components/AvailabilityModal.js';
import './main.css';

const HomePage = () => {
  const [user] = useState(JSON.parse(sessionStorage.getItem('userInfo')));
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [formattedAppointments, setFormattedAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [cancelingAppointment, setCancelingAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editValue, setEditValue] = useState(dayjs());
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Report states
  const [reportingAppointment, setReportingAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch real appointments once on mount
  useEffect(() => {
    fetch('https://bonex.runasp.net/Appointments?includePast=true', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setAppointmentsList(data.value || []))
      .catch(console.error);
  }, [user?.token]);

  // Shape incoming data for display
  useEffect(() => {
    setFormattedAppointments(
      appointmentsList.map(item => {
        const words = item.patientName.trim().split(/\s+/);
        const displayName = words.length > 2
          ? words.slice(0, 2).join(' ')
          : item.patientName;

        return {
          id: item.id,
          name: displayName,
          fullName: item.patientName, // Store full name for reports
          image: `https://bonex.runasp.net${item.patientPicture}`,
          date: item.scheduledTime,
          gender: item.patientGender === '1' ? 'Male' : 'Female',
          dob: item.patientBirthDate,
          type: item.type,
          status: item.status
        };
      })
    );
  }, [appointmentsList]);

  // Filtered view
  const filteredAppointments = formattedAppointments
    .filter(appt =>
      appt.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(appt =>
      !statusFilter || appt.status === statusFilter
    );

  // === Calculate statistics ===
  const calculateStatistics = () => {
    const totalAppointments = formattedAppointments.length;
    
    // Count unique patients
    const uniquePatients = new Set(
      formattedAppointments.map(appt => appt.fullName.toLowerCase().trim())
    ).size;
    
    // Count clinic and online consultations
    const clinicConsulting = formattedAppointments.filter(appt => 
      appt.type.toLowerCase() === 'clinic'
    ).length;
    
    const onlineConsulting = formattedAppointments.filter(appt => 
      appt.type.toLowerCase() === 'online'
    ).length;
    
    // Count canceled appointments
    const canceledAppointments = formattedAppointments.filter(appt => 
      appt.status === 'Canceled'
    ).length;
    
    // Calculate no-show rate
    const noShowCount = formattedAppointments.filter(appt => 
      appt.status === 'NoShow'
    ).length;
    
    const noShowRate = totalAppointments > 0 
      ? `${Math.round((noShowCount / totalAppointments) * 100)}%` 
      : '0%';
    
    return {
      totalAppointments,
      uniquePatients,
      clinicConsulting,
      onlineConsulting,
      canceledAppointments,
      noShowRate,
      // Placeholders for ratings and waiting time
      consultationRatings: '0 / 5 ⭐',
      averageWaitingTime: '0 min'
    };
  };

  const statistics = calculateStatistics();

  // === Cancellation handlers ===
  const handleOpenCancelDialog = appt => setCancelingAppointment(appt);
  const handleConfirmCancel = () => {
    setFormattedAppointments(prev =>
      prev.map(appt =>
        appt.id === cancelingAppointment.id
          ? { ...appt, status: "Canceled" }
          : appt
      )
    );
    setCancelingAppointment(null);
  };
  const handleCloseCancelDialog = () => setCancelingAppointment(null);

  // === Edit-time handlers ===
  const handleInitiateEdit = appt => {
    setEditingAppointment(appt);
    const start = appt.date.split(" to ")[0];
    setEditValue(dayjs(start));
  };
  const handleSaveEdit = () => {
    const newStart = editValue.format('YYYY-MM-DD hh:mm A');
    setFormattedAppointments(prev =>
      prev.map(appt =>
        appt.id === editingAppointment.id
          ? {
              ...appt,
              date: appt.date.includes(" to ")
                ? `${newStart} to ${appt.date.split(" to ")[1]}`
                : newStart
            }
          : appt
      )
    );
    setEditingAppointment(null);
  };
  const handleCancelEdit = () => setEditingAppointment(null);

  // === Report handlers ===
  const handleInitiateReport = (appt) => {
    setReportingAppointment(appt);
    setDiagnosis("");
    setMedications("");
  };

  const handleCloseReportModal = () => {
    setReportingAppointment(null);
  };

  const handleSubmitReport = async () => {
    if (!reportingAppointment) return;

    const reportData = {
      appointmentId: reportingAppointment.id,
      patientName: reportingAppointment.fullName,
      diagnosis,
      medications
    };

    try {
      const response = await fetch('https://bonex.runasp.net/Appointments/report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        setNotification({
          open: true,
          message: "Report submitted successfully!",
          severity: "success"
        });
        setTimeout(() => setNotification({ ...notification, open: false }), 3000);
        handleCloseReportModal();
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Error submitting report. Please try again.",
        severity: "error"
      });
      console.error(error);
    }
  };

  // === Availability modal handlers ===
  const closeAvailabilityModal = () => setIsAvailabilityModalOpen(false);
  const handleOnSaveAvailability = (scheduleData) => {
    const scheduleArray = Array.isArray(scheduleData) 
      ? scheduleData 
      : Object.values(scheduleData);

    const availabilitiesArray = [];
    scheduleArray.forEach((item, idx) => {
      availabilitiesArray.push({
        dayOfWeek: idx+1,
        startTime: item.startTime,
        endTime: item.endTime,
        isAvailable: item.working
      });
    });
    
    const bdy = { availabilities: availabilitiesArray };
    
    fetch('https://bonex.runasp.net/DoctorAvailability', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bdy)
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(console.log)
      .catch(console.error);
  };

  // Dropdown toggle logic
  React.useEffect(() => {
    const handler = e => {
      const toggle = e.target.closest(".dropdown-toggle");
      document.querySelectorAll(".dropdown-menu.show")
        .forEach(menu => {
          if (!toggle || menu !== toggle.nextElementSibling) {
            menu.classList.remove("show");
          }
        });
      if (toggle) {
        e.stopPropagation();
        toggle.nextElementSibling.classList.toggle("show");
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Single appointment row with conditional report option
  const AppointmentRow = ({ appointment }) => {
    // Check if appointment time has passed
    const now = dayjs();
    const timeParts = appointment.date.split(' to ');
    const startTimeStr = timeParts[0].trim();
    const startTime = dayjs(startTimeStr);
    const isPastAppointment = startTime.isBefore(now);

    return (
      <tr>
        <td>
          <div className="patient-info">
            <img src={appointment.image} alt={appointment.name} />
            <span>{appointment.name}</span>
          </div>
        </td>
        <td>{appointment.date}</td>
        <td>{ appointment.name==="Emad Khalid"?"Male": appointment.gender}</td>
        <td>{appointment.dob}</td>
        <td>{appointment.type}</td>
        <td>
          <span className={`status status-${appointment.status.toLowerCase() === 'scheduled' ? 'booked' : appointment.status.toLowerCase()}`}>
            {appointment.status}
          </span>
        </td>
        <td>
          <div className="dropdown">
            <i className="fas fa-ellipsis-h dropdown-toggle" title="Actions"></i>
            <div className="dropdown-menu">
              <Link to="#" className="dropdown-item">
                <i className="fas fa-comment-dots"></i> Message Patient
              </Link>
              <Link to="#" className="dropdown-item">
                <i className="fas fa-info-circle"></i> View More Details
              </Link>
              <a
                href="#"
                className="dropdown-item"
                onClick={() => handleOpenCancelDialog(appointment)}
              >
                <i className="fas fa-times"></i> Cancel Appointment
              </a>
              <a
                href="#"
                className="dropdown-item"
                onClick={() => handleInitiateEdit(appointment)}
              >
                <i className="fas fa-edit"></i> Edit Time
              </a>
              
              {/* Conditionally show Write Report option */}
              
                <a
                  href="#"
                  className="dropdown-item"
                  onClick={() => handleInitiateReport(appointment)}
                >
                  <i className="fas fa-file-medical"></i> Write Report
                </a>
              
              
              <Link to="/meet" className="dropdown-item">
                <li className="material-icons">video_call</li> Start Video Call
              </Link>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="homebody">
        <div
          className={`doctorh-card animate__animated animate__backInUp ${user?.gender === 1 ? 'male' : 'female'}`}
        >
          <div className="docinfo animate__animated animate__jackInTheBox animate__delay-1s">
            <p className="greeting">Welcome back, Have a nice day at work!</p>
            <h1 className="DoctorName">Dr.{user?.firstName}</h1>
            <p className="specialities">MD, DM (Internal Medicine), FACP</p>
            <h2 className="todaysApp">
              You have total <span>{formattedAppointments.length} Appointments</span> today!
            </h2>
            <button
              className='w-[200px] h-[50px] p-3 bg-[#37B7C3] transition hover:bg-[#2661a8]'
              style={{ borderRadius: '15px', marginTop: '20px' }}
              onClick={() => setIsAvailabilityModalOpen(true)}
            >
              Edit Availability
            </button>
          </div>
          <img
            src={user.gender === 1 ? maleavatar : femaleavatar}
            alt="Doctor Avatar"
            className="animate__animated animate__backInRight animate__delay-1s"
          />
        </div>

        <h4
          className="animate__animated animate__backInLeft"
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
          <div className="wrapcm">
            <div className="r1 animate__animated animate__backInLeft animate__delay-1s">
              <div className="cardh purple">
                <div className="icon-container">
                  <span className="material-icons">calendar_today</span>
                </div>
                <div>
                  <h3>{statistics.totalAppointments}</h3>
                  <p>Appointments</p>
                </div>
              </div>
              <div className="cardh red">
                <div className="icon-container">
                  <span className="material-icons">person</span>
                </div>
                <div>
                  <h3>{statistics.uniquePatients}</h3>
                  <p>Total Patients</p>
                </div>
              </div>
              <div className="cardh orange">
                <div className="icon-container">
                  <span className="material-icons">medical_services</span>
                </div>
                <div>
                  <h3>{statistics.clinicConsulting}</h3>
                  <p>Clinic Consulting</p>
                </div>
              </div>
              <div className="cardh blue">
                <div className="icon-container">
                  <span className="material-icons">videocam</span>
                </div>
                <div>
                  <h3>{statistics.onlineConsulting}</h3>
                  <p>Online Consulting</p>
                </div>
              </div>
            </div>

            <div className="r2 animate__animated animate__backInLeft animate__delay-2s">
              <div className="cardh green">
                <div className="icon-container">
                  <span className="material-icons">event_busy</span>
                </div>
                <div>
                  <h3>{statistics.noShowRate}</h3>
                  <p>No-Show Rates</p>
                </div>
              </div>
              <div className="cardh teal">
                <div className="icon-container">
                  <span className="material-icons">cancel</span>
                </div>
                <div>
                  <h3>{statistics.canceledAppointments}</h3>
                  <p>Canceled Appointments</p>
                </div>
              </div>
              <div className="cardh indigo">
                <div className="icon-container">
                  <span className="material-icons">star</span>
                </div>
                <div>
                  <h3>{statistics.consultationRatings}</h3>
                  <p>Consultation Ratings</p>
                </div>
              </div>
              <div className="cardh cyan">
                <div className="icon-container">
                  <span className="material-icons">schedule</span>
                </div>
                <div>
                  <h3>{statistics.averageWaitingTime}</h3>
                  <p>Average Waiting Time</p>
                </div>
              </div>
            </div>
          </div>
          <RechartsPieChart />
        </div>

        <div className="schedule-section">
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontSize: '24px',
                color: 'var(--secondary-accent)',
                fontWeight: 'bold',
                marginLeft: '20px'
              }}
            >
              Schedule List:
            </span>
            <div className="search-filter-wrapper">
              <div className="search-bar">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search Appointment, Patient or etc"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-dropdown">
                <label htmlFor="appointment-status" className="filter-label">Filter By</label>
                <select
                  name="appointment-status"
                  id="appointment-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="Scheduled">Booked</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                  <option value="NoShow">No Show</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
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
                {filteredAppointments.map(appt => (
                  <AppointmentRow key={appt.id} appointment={appt} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit-time Modal */}
        <Modal
          open={Boolean(editingAppointment)}
          onClose={handleCancelEdit}
          aria-labelledby="edit-appointment-modal"
          aria-describedby="edit-appointment-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              bgcolor: 'background.paper',
              border: '2px solid #1976d2',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              id="edit-appointment-modal"
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}
            >
              Edit Appointment Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Select new time"
                value={editValue}
                onChange={(newValue) => setEditValue(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                      '& .MuiInputLabel-root': { fontSize: '1rem', color: 'text.secondary' },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button onClick={handleSaveEdit} variant="contained" color="primary" sx={{ mr: 2 }}>
                Save
              </Button>
              <Button onClick={handleCancelEdit} variant="outlined" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Cancel-confirmation Dialog */}
        <Dialog 
          open={Boolean(cancelingAppointment)} 
          onClose={handleCloseCancelDialog}
          fullWidth
          maxWidth="xs"
          PaperProps={{ sx: { borderRadius: 4, boxShadow: 24 } }}
        >
          <DialogTitle sx={{ backgroundColor: 'error.main', color: 'white', textAlign: 'center', fontWeight: 'bold', py: 2 }}>
            Cancel Appointment
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', py: 3, fontSize: '1rem' }}>
            Are you sure you want to cancel this appointment?
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button onClick={handleConfirmCancel} variant="contained" color="error" sx={{ mr: 2 }}>
              Yes
            </Button>
            <Button onClick={handleCloseCancelDialog} variant="outlined" color="primary">
              No
            </Button>
          </DialogActions>
        </Dialog>

        {/* Report Modal */}
        <Modal
          open={Boolean(reportingAppointment)}
          onClose={handleCloseReportModal}
          aria-labelledby="report-modal-title"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}>
            <Typography 
              id="report-modal-title" 
              variant="h5" 
              component="h2"
              gutterBottom
              sx={{ 
                fontWeight: 'bold', 
                color: '#1976d2',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Medical Report for {reportingAppointment?.fullName}
            </Typography>
            
            <TextField
              label="Diagnosis"
              fullWidth
              multiline
              rows={4}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              margin="normal"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <TextField
              label="Medications"
              fullWidth
              multiline
              rows={4}
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              margin="normal"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              mt: 3,
              gap: 2
            }}>
              <Button 
                onClick={handleCloseReportModal} 
                variant="outlined"
                sx={{ 
                  px: 3,
                  py: 1,
                  borderRadius: 2
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmitReport}
                color="primary"
                sx={{ 
                  px: 3,
                  py: 1,
                  borderRadius: 2
                }}
              >
                Submit Report
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity={notification.severity}
            sx={{ width: '100%', fontSize: '1rem' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        <AvailabilityModal
          open={isAvailabilityModalOpen}
          onClose={closeAvailabilityModal}
          onSave={handleOnSaveAvailability}
        />
      </div>
    </>
  );
};

export default HomePage;