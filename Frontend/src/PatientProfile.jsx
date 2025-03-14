import React, { useState } from "react";
import Avatar from "./images/avatar-male.jpg";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import "./PatientProfile.css";

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const me = sessionStorage.getItem("userInfo");
  const userData = JSON.parse(me);

  const [patient, setPatient] = useState({
    name: userData.firstName + " " + userData.lastName,
    age: userData.age,
    gender: userData.gender === 1 ? "Male" : "Female",
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

  // Expanded predefined choices
  const medicalHistoryChoices = [
    "Asthma",
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Arthritis",
    "Cancer",
    "Chronic Pain",
    "Epilepsy",
    "Multiple Sclerosis",
    "COPD (Chronic Obstructive Pulmonary Disease)",
    "Stroke",
    "Depression",
    "Anxiety Disorders",
    "Osteoporosis",
    "Ulcerative Colitis",
    "Crohn's Disease",
    "Parkinson's Disease",
    "AIDS/HIV",
    "Obesity",
    "Hyperthyroidism",
    "Hypothyroidism",
    "Chronic Kidney Disease",
  ];

  const medicationChoices = [
    "Albuterol Inhaler",
    "Lisinopril",
    "Metformin",
    "Aspirin",
    "Ibuprofen",
    "Paracetamol",
    "Atorvastatin",
    "Simvastatin",
    "Omeprazole",
    "Amoxicillin",
    "Levothyroxine",
    "Hydrochlorothiazide",
    "Metoprolol",
    "Losartan",
    "Sertraline",
    "Furosemide",
    "Gabapentin",
    "Prednisone",
    "Tramadol",
    "Warfarin",
    "Clopidogrel",
    "Ranitidine",
    "Loratadine",
  ];

  const allergyChoices = [
    "Peanuts",
    "Shellfish",
    "Pollen",
    "Dust",
    "Latex",
    "Milk",
    "Eggs",
    "Wheat",
    "Soy",
    "Fish",
    "Cat Dander",
    "Dog Dander",
    "Bee Stings",
    "Insect Bites",
    "Penicillin",
    "Sulfa Drugs",
    "Mold",
    "Grass",
    "Tree Nuts",
    "Perfume",
    "Nickel",
  ];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    const updatedArray = checked
      ? [...formData[type], value]
      : formData[type].filter((item) => item !== value);
    setFormData({ ...formData, [type]: updatedArray });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setPatient(formData);
    setIsEditing(false);
  };

  return (
    <Box className="profile-container" sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Box
          className="profile-header"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={patient.profilePicture}
            alt={patient.name}
            className="profile-pic"
            style={{
              borderRadius: "50%",
              width: 100,
              height: 100,
              marginRight: 16,
            }}
          />

          <Box className="profile-info">
            <Typography variant="h4" className="patient-name">
              {patient.name}
            </Typography>
            <Typography>
              <strong>Age:</strong> {patient.age}
            </Typography>
            <Typography>
              <strong>Gender:</strong> {patient.gender}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <Box className="profile-details">
          <Typography variant="h6">Medical History</Typography>
          <ul className="details-list">
            {patient.medicalHistory.map((condition, index) => (
              <li key={index}>{condition}</li>
            ))}
          </ul>

          <Typography variant="h6">Medications</Typography>
          <ul className="details-list">
            {patient.medications.map((medication, index) => (
              <li key={index}>{medication}</li>
            ))}
          </ul>

          <Typography variant="h6">Allergies</Typography>
          <ul className="details-list">
            {patient.allergies.map((allergy, index) => (
              <li key={index}>{allergy}</li>
            ))}
          </ul>

          <Typography variant="h6">Old X-Ray Checks</Typography>
          <ul className="details-list">
            {patient.oldXRayChecks.map((xray, index) => (
              <li key={index}>
                {xray.date}: {xray.description}
              </li>
            ))}
          </ul>

          <Box className="contact-info">
            <Typography>
              <strong>Contact:</strong> {patient.contact}
            </Typography>
            <Typography>
              <strong>Email:</strong> {patient.email}
            </Typography>
          </Box>

          <Button variant="contained" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
        </Box>
      </Paper>

      {isEditing && (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <form className="edit-form" onSubmit={handleSave}>
            <Typography variant="h5" className="h3label">
              Edit Patient Information
            </Typography>

            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
              <Typography className="h6">Medical History</Typography>
              <Grid container spacing={2}>
                {medicalHistoryChoices.map((choice, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.medicalHistory.includes(choice)}
                          onChange={(e) =>
                            handleCheckboxChange(e, "medicalHistory")
                          }
                          value={choice}
                        />
                      }
                      label={choice}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormControl>

            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
              <Typography className="h6">Medications</Typography>
              <Grid container spacing={2}>
                {medicationChoices.map((choice, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.medications.includes(choice)}
                          onChange={(e) =>
                            handleCheckboxChange(e, "medications")
                          }
                          value={choice}
                        />
                      }
                      label={choice}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormControl>

            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
              <Typography className="h6">Allergies</Typography>
              <Grid container spacing={2}>
                {allergyChoices.map((choice, i) => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.allergies.includes(choice)}
                          onChange={(e) => handleCheckboxChange(e, "allergies")}
                          value={choice}
                        />
                      }
                      label={choice}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormControl>

            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default PatientProfile;