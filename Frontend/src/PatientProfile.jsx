// src/PatientProfile.js
import React, { useEffect, useState } from "react";
import "./PatientProfile.css";
import Avatar from "./images/avatar-male.jpg";
const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState(null);
  const [anUser, setAnUser] = useState(false);
  const me = sessionStorage.getItem("userInfo");
  const userData = JSON.parse(me);

  const [patient, setPatient] = useState({
    name: userData.firstName + " " + userData.lastName,
    age: userData.age,
    gender: "Female",
    medicalHistory: ["Asthma", "Allergy to penicillin", "High blood pressure"],
    medications: ["Albuterol Inhaler", "Lisinopril"],
    allergies: ["Peanuts", "Shellfish"],
    oldXRayChecks: [
      { date: "2022-01-15", description: "Chest X-Ray" },
      { date: "2021-06-10", description: "Knee X-Ray" },
    ],
    contact: "+1-987-654-3210",
    email: "jane.smith@example.com",
    profilePicture: Avatar,
  });

  const [formData, setFormData] = useState({ ...patient });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, index, type) => {
    const { value } = e.target;
    const updatedArray = [...formData[type]];
    updatedArray[index] = value;
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleAddToArray = (type) => {
    const updatedArray = [...formData[type], ""];
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleRemoveFromArray = (index, type) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setPatient(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={patient.profilePicture}
          alt={patient.name}
          className="profile-pic"
        />

        <div className="profile-info">
          <h2 className="patient-name">{patient.name}</h2>
          <p>
            <strong>Age:</strong> {patient.age}
          </p>
          <p>
            <strong>Gender:</strong> {patient.gender}
          </p>
        </div>
      </div>
      <div className="profile-details">
        <h4>Medical History</h4>
        <ul className="details-list">
          {patient.medicalHistory.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>

        <h4>Medications</h4>
        <ul className="details-list">
          {patient.medications.map((medication, index) => (
            <li key={index}>{medication}</li>
          ))}
        </ul>

        <h4>Allergies</h4>

        <ul className="details-list">
          {patient.allergies.map((allergy, index) => (
            <li key={index}>{allergy}</li>
          ))}
        </ul>

        <h4>Old X-Ray Checks</h4>
        <ul className="details-list">
          {patient.oldXRayChecks.map((xray, index) => (
            <li key={index}>
              {xray.date}: {xray.description}
            </li>
          ))}
        </ul>

        <div className="contact-info">
          <p>
            <strong>Contact:</strong> {patient.contact}
          </p>
          <p>
            <strong>Email:</strong> {patient.email}
          </p>
        </div>

        <button className="edit-button" onClick={handleEditClick}>
          Edit
        </button>
      </div>

      {isEditing && (
        <form className="edit-form" onSubmit={handleSave}>
          <h3 className="h3label">Edit Patient Information</h3>

          <h4>Medical History</h4>
          {formData.medicalHistory.map((condition, index) => (
            <div key={index} className="editable-item">
              <label>
                Condition {index + 1}:
                <input
                  type="text"
                  value={condition}
                  onChange={(e) =>
                    handleArrayChange(e, index, "medicalHistory")
                  }
                />
              </label>
              <button
                type="button"
                onClick={() => handleRemoveFromArray(index, "medicalHistory")}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="PButton"
            onClick={() => handleAddToArray("medicalHistory")}
          >
            +
          </button>

          <h4>Medications</h4>
          {formData.medications.map((medication, index) => (
            <div key={index} className="editable-item">
              <label>
                Medication {index + 1}:
                <input
                  type="text"
                  value={medication}
                  onChange={(e) => handleArrayChange(e, index, "medications")}
                />
              </label>
              <button
                type="button"
                onClick={() => handleRemoveFromArray(index, "medications")}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="PButton"
            onClick={() => handleAddToArray("medications")}
          >
            +
          </button>

          <h4>Allergies</h4>
          {formData.allergies.map((allergy, index) => (
            <div key={index} className="editable-item">
              <label>
                Allergy {index + 1}:
                <input
                  type="text"
                  value={allergy}
                  onChange={(e) => handleArrayChange(e, index, "allergies")}
                />
              </label>
              <button
                type="button"
                onClick={() => handleRemoveFromArray(index, "allergies")}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            className="PButton"
            onClick={() => handleAddToArray("allergies")}
          >
            +
          </button>

          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default PatientProfile;
