import React from 'react';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  
  const handleBookNow = () => {
    alert(`Booking appointment with ${doctor.name}`);
  };

  return (
    <div className="doctor-card">
      <img src={doctor.image} alt={doctor.name} className="doctor-image" />
      <div className="doctor-info">
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