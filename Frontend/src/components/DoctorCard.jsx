import React from "react";
import "./DoctorCard.css";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to the doctorDetails route with the doctor's ID
    navigate(`/doctorDetails/${doctor.id}`);
  };
  const handleBookNow = () => {
    navigate(`/doctorDetails/${doctor.id}`);
  };

  return (
    <div className="doctor-card2" onClick={handleCardClick}>
      <img src={doctor.image} alt={doctor.name} className="doctor-image2" />
      <div className="doctor-info2">
        <h2>{doctor.name}</h2>
        <p>{doctor.specialization}</p>
        <p>{doctor.description}</p>
        <button className="book-now-button" onClick={handleBookNow}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
