import React, { useState, useEffect } from "react";
import { Calendar, Award, Phone, Mail, MapPin } from "lucide-react";
import "./doctorDetails.css";
import { useParams } from "react-router-dom";
import MaleAvatar from "./images/avatar-male.jpg";

const doctors = [
  {
    id: 1,
    name: "Dr. Mohamed Ebraheem",
    specialty: "Cardiologist Specialist",
    certifications: [
      "Board Certified in Cardiology",
      "MD from Johns Hopkins University",
    ],
    contact: {
      phone: "+1 (555) 123-4567",
      email: "dr.johnson@medical.com",
      address: "123 Medical Center Drive, Suite 200",
    },
    specializations: [
      "Interventional Cardiology",
      "Heart Disease Prevention",
      "Cardiac Rehabilitation",
      "Echocardiography",
    ],
    image: MaleAvatar,
  },
  {
    id: 2,
    name: "Dr. Ahmed Hassan",
    specialty: "Neurologist Specialist",
    certifications: [
      "Board Certified in Neurology",
      "MD from Harvard University",
    ],
    contact: {
      phone: "+1 (555) 987-6543",
      email: "dr.hassan@medical.com",
      address: "456 Medical Center Drive, Suite 300",
    },
    specializations: [
      "Neurodegenerative Disorders",
      "Stroke Management",
      "Epilepsy Treatment",
      "Neuroimaging",
    ],
    image: MaleAvatar,
  },
];

function DoctorDetails() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "12:00 AM", available: false },
    { time: "1:00 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "05:00 PM", available: true },
  ];

  const AppointType = [
    { time: "Online", available: true },
    { time: "Offline", available: true },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointment = {
      date: selectedDate,
      time: selectedTime,
      type: selectedType,
    };
    console.log(appointment);
    alert("Appointment request submitted successfully!");
  };

  const { id } = useParams();

  const doctor = doctors.find((doc) => doc.id === parseInt(id));

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="doctor-details-container">
      <div className="doctor-details-wrapper">
        <div className="doctor-details-card">
          <div className="doctor-info">
            <img
              className="DoctorImage-az"
              src={doctor.image}
              alt={doctor.name}
            />
            <div className="doctor-details">
              <h2>{doctor.name}</h2>
              <p>{doctor.specialty}</p>
              <div>
                {doctor.certifications.map((certification, index) => (
                  <div key={index}>
                    <Award />
                    <span>{certification}</span>
                    <br />
                  </div>
                ))}
                <div>
                  <Phone />
                  <span>{doctor.contact.phone}</span>
                </div>
                <br />
                <div>
                  <Mail />
                  <span>{doctor.contact.email}</span>
                </div>
                <br />
                <div>
                  <MapPin />
                  <span>{doctor.contact.address}</span>
                  <div className="specializations">
                    <h3 className="text-xl font-semibold mb-4">
                      Specializations
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-white">
                      {doctor.specializations.map((specialization, index) => (
                        <li key={index}>{specialization}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <br />
              </div>
            </div>
          </div>

          <div className="booking-form">
            <h3>Book an Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="pdLabel">Select Date</label>
                <div className="relative">
                  <Calendar />
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="pdLabel">Available Times</label>
                <div className="time-slot-container">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`time-slot-button ${
                        selectedTime === slot.time
                          ? "selected"
                          : slot.available
                          ? "available"
                          : "unavailable"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
              <br />

              <label className="pdLabel">Appointment Type</label>

              <div className="appn-slot-container">
                {AppointType.map((slot2) => (
                  <button
                    key={slot2.time}
                    type="button"
                    disabled={!slot2.available}
                    onClick={() => setSelectedType(slot2.time)}
                    className={`appn-slot-button ${
                      selectedType === slot2.time
                        ? "selected"
                        : slot2.available
                        ? "available"
                        : "unavailable"
                    }`}
                  >
                    {slot2.time}
                  </button>
                ))}
              </div>

              <button type="submit" className="booking-form-button">
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
