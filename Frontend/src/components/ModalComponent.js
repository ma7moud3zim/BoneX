import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";

import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import TextField from "@mui/material/TextField";
import { ExclamationIcon } from "@heroicons/react/solid";

function NotificationCard({ message, isError }) {
  return (
    <div
      className={`animate__animated animate__backInDown shadow-lg transform rotate-2 p-3 rounded-lg ${isError ? "bg-red-100" : "bg-white"}`}
    >
      <span className={`font-extrabold text-lg ${isError ? "text-red-600" : "text-blue-600"}`}>
        {message}
      </span>
    </div>
  );
}

// Enhanced DatePickerWrapper with an updated style and smooth focus transitions
function DatePickerWrapper({ selectedDate, onChange, error }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Select Date"
        value={selectedDate}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={error && "Please select a valid date"}
            variant="outlined"
            className="transition-all duration-200"
          />
        )}
        sx={{
          "& .MuiPickersToolbar-root": { backgroundColor: "#B3E5FC" },
          "& .MuiCalendarPicker-root": { backgroundColor: "white" },
        }}
      />
    </LocalizationProvider>
  );
}

// TimeSlotButton with the specified background and hover styles
function TimeSlotButton({ time, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ borderRadius: "8px" }}
      className={`px-4 py-2 rounded-md w-full transition-all duration-200 ${
        selected
          ? "bg-[#2661a8] text-white shadow-md"
          : "bg-[#f3f9ff] text-black border border-blue-500 hover:bg-[#287DA5] hover:text-white"
      }`}
      aria-pressed={selected}
      aria-label={`Select ${time} time slot`}
    >
      {time}
    </button>
  );
}

// A small notification that highlights the timezone info with an icon
function TimeZoneNotification() {
  return (
    <div className="bg-orange-100 text-black p-3 rounded-md mt-4 flex items-center shadow-sm">
      <ExclamationIcon className="h-6 w-6 text-orange-500 mr-2" />
      <span className="text-sm font-medium">
        All times are in Central Time (Egypt)
      </span>
    </div>
  );
}

// Main ModalComponent with enhanced layout, spacing, and animations
function ModalComponent(props) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState(""); // State for the notes text input
  const token = JSON.parse(sessionStorage.getItem("userInfo"))?.token;
  const doctorid = props.doctorid;
  const [errors, setErrors] = useState({
    date: false,
    time: false,
    notes: false,
  });
  // New state to store notification messages
  const [notificationMessage, setNotificationMessage] = useState("");

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  useEffect(() => {
    console.log("doctor id", doctorid);
  }, [doctorid]);

  const handleSubmit = async () => {
    // Validate inputs
    const hasDateError = !selectedDate;
    const hasTimeError = !selectedTime;
    const hasNotesError = notes.trim() === ""; // Notes must not be empty

    setErrors({
      date: hasDateError,
      time: hasTimeError,
      notes: hasNotesError,
    });

    if (!hasDateError && !hasTimeError && !hasNotesError) {
      // Extract the date part in YYYY-MM-DD format
      const formattedDate = selectedDate.toISOString().split("T")[0];
      // Concatenate with the selected time and add seconds (00) and Z for UTC.
      const combinedDateTime = `${formattedDate}T${selectedTime}:00Z`;

      try {
        console.log("token", token);
        console.log("doctor id", doctorid);
        console.log("combinedDateTime", combinedDateTime);
        const response = await fetch("https://bonex.runasp.net/Appointments", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId: doctorid,
            scheduledTime: combinedDateTime,
            
          }),
        });

        // If the response is ok, show success notification
        if (response.ok) {
      
          const responseData = await response.json();
          console.log('res data',responseData);
            sessionStorage.setItem('Appointment', JSON.stringify(responseData.value));
          // Wait for 3 seconds then exit the modal and clear the notification
          setNotificationMessage("Congrats, you have an Appointment");
          setTimeout(() => {
            setNotificationMessage("");
            props.handleClose();
          }, 3000);
        } else {
          // For a non-ok response, set an error message in the notification card.
          setNotificationMessage(
            "The selected time is not available, please try another time"
          );
        }
      } catch (error) {
        console.log(error);
        // If an error happens during the fetch, you might want to show the same error notification.
        setNotificationMessage(
          "The selected time is not available, please try another time"
        );
      }

      console.log("Appointment:", {
        datetime: combinedDateTime,
        notes,
      });
    }
  };

  return (
    <Modal
      open={props.isopen}
      onClose={props.handleClose}
      aria-labelledby="appointment-modal"
      className="flex items-center justify-center"
    >
      <div className="bg-gray-50 border border-blue-200 rounded-xl p-8 shadow-2xl w-11/12 max-w-3xl animate-fadeIn">
        {/* Render NotificationCard if there is a notification message */}
        {notificationMessage && (
          <div className="flex justify-center mb-6">
            <NotificationCard
              message={notificationMessage}
              // If the message does not start with "Congrats", consider it as error styled.
              isError={!notificationMessage.startsWith("Congrats")}
            />
          </div>
        )}
        <h2
          className="text-3xl font-bold text-blue-800 text-center mt-6"
          id="appointment-modal"
        >
          Make an Appointment
        </h2>

        {/* Date and Notes Section */}
        <div className="flex flex-col sm:flex-row mt-8 gap-6">
          <div className="sm:w-2/3">
            <DatePickerWrapper
              selectedDate={selectedDate}
              onChange={setSelectedDate}
              error={errors.date}
            />
          </div>
          {/* Notes input field beside the date picker */}
          <div className="sm:w-1/3">
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              variant="outlined"
              className="w-full"
              error={errors.notes}
              helperText={errors.notes && "Please add a note"}
            />
          </div>
        </div>

        {/* Time Selection Section */}
        <div className="mt-8">
          <label className="text-base text-gray-700 block mb-3 font-medium">
            Select Time
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {timeSlots.map((time) => (
              <TimeSlotButton
                key={time}
                time={time}
                selected={selectedTime === time}
                onClick={() => setSelectedTime(time)}
              />
            ))}
          </div>
          {errors.time && (
            <p className="text-red-500 text-sm mt-2">
              Please select a time slot.
            </p>
          )}
        </div>

        {/* Time Zone Notification */}
        <TimeZoneNotification />

        {/* Action Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            className="bg-[#2661a8] text-white hover:bg-[#287DA5] px-8 py-3 rounded-full shadow-lg transition-colors text-lg"
            style={{ borderRadius: "50px" }}
          >
            Get Appointment
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalComponent;
