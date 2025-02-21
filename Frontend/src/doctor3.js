import React, { useState, useRef } from "react";
import personalImg from "./images/personal.webp";
import graduateImg from "./images/graduate.webp";
 import { useNavigate } from "react-router-dom";
import axios from "axios";
import professionalImg from "./images/professional.png";
import "./doctor3.css";

const Doctor3 = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleAddClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log("Selected file:", file);
      // Process the file as needed (e.g., upload or store it)
    }
  };

  // Form field states for professional details
  const [clinicName, setClinicName] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [hours, setHours] = useState("");

  // State to store validation errors
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async(e) => {
    e.preventDefault();
    let formErrors = {};

    // Validate clinic name
    if (clinicName.trim() === "") {
      formErrors.clinicName = "Clinic name is required";
    }

    // Validate years of experience (should be a positive number)
    if (!experience || experience <= 0) {
      formErrors.experience = "Years of experience must be greater than 3";
    }

    // Validate consultation fees (should be a positive number)
    if (!fees || fees <= 0) {
      formErrors.fees = "Consultation fees must be greater than 5 $";
    }

    // Validate consultation hours (should be a positive number)
    if (!hours || hours <= 0) {
      formErrors.hours = "Consultation hours must be greater than 1";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log("Form submitted successfully:", {
        clinicName,
        experience,
        fees,
        hours,
      });

      // Retrieve stored data from previous two pages
      const doctorDataStr = sessionStorage.getItem("doctorData");
      const academicDataStr = sessionStorage.getItem("academicData");
      const doctorData = doctorDataStr ? JSON.parse(doctorDataStr) : {};
      const academicData = academicDataStr ? JSON.parse(academicDataStr) : {};

      // Prepare professional details from this page
      const professionalData = {
        clinicName,
        experience,
        fees,
        hours,
        awardFile: uploadedFile ? uploadedFile.name : null,
      };

      // Combine the data from previous pages with professional details
      const combinedData = {
        ...doctorData,
        ...academicData,
        professionalData,
      };
/*{"name":"saad","dob":"1990-02-02","gender":"male","countryCode":"+20","mobile":"+201155006348","email":"saad@test.com","password":"P@ssword123","university":"harvard","gradYear":"2005","degreeCertificate":"sec.css","postGradCertificate":null,"speciality":"sports_medicine","medRegNumber":"4455","professionalData":{"clinicName":"bonex","experience":"5","fees":"48","hours":"6","awardFile":null}}*/ 
      // Store the combined data in session storage
      try {
        console.log('hello');
        
          const response = await axios.post(
            "http://bonex.runasp.net/Auth/register",
            {
              
                "email": combinedData.email,
                "password": combinedData.password,
                "firstName": combinedData.name,
                "lastName": combinedData.name,
                "dateOfBirth": combinedData.dob,
                "gender": (combinedData.gender=="male"?1:2),
                "phoneNumber": "+2011155006348",
                "doctorInfo": {
                  "universityName": combinedData.university,
                  "graduationYear": combinedData.gradYear,
                  "degreeCertificates": "asadada",
                  "additionalCertifications": "asdsdadd",
                  "yearsOfExperience": 25,
                  "consultationHours": "35",
                  "consultationFees": 12,
                  "workplaceName": "Bonex",
                  "awardsOrRecognitions": "aasaasdsaddd"
                }
              
              
            },
            
          );


     console.log('entered');
          
          if(response.status===200){
        
          window.sessionStorage.setItem("anuser", true);
         
          const doctorData = {combinedData}
      
          const userData = {
              
            email: combinedData.email,
            firstName: combinedData.name,
            lastName: combinedData.name,
            gender: (combinedData.gender==="male"?1:0),
           role:"doc" 
           
          };
          
          
          sessionStorage.setItem("userInfo", JSON.stringify(userData));
          
            
          
          
          
          

            // Clear errors and process form (e.g., call an API)
    setErrors({});
    console.log('Form submitted successfully!');
    
            
          // Only navigate if the AuthToken is retrieved or exists
          navigate("/homed")
          window.location.reload(true);
          }
        } catch (error) {
          console.error("Login failed:", error);
         
          sessionStorage.setItem("completeDoctorData", JSON.stringify(combinedData));
          console.log("Combined data stored:", combinedData);
        }

      // Optionally, process further actions (e.g., navigate to next page)
    }
  };

  return (
    <div className="main-container3">
      <h1 className="head">Professional Details</h1>
      <div className="div-line"></div>

      {/* Progress Bar */}
      <div className="progress-bar3">
        <div className="circle done">
          <img src={personalImg} alt="Personal Info" />
        </div>
        <div className="line"></div>
        <div className="circle">
          <img src={graduateImg} alt="Graduation" />
        </div>
        <div className="line"></div>
        <div className="circle inactive">
          <img src={professionalImg} alt="Professional" />
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box3">
        <h2>Why Bonex?</h2>
        <hr />
        <ul>
          <li>
            • Consult over 10 million existing <span>online patients</span> and
            acquire new online patients every day.
          </li>
          <li>
            • Consult <span>your patient online</span> via multiple channels --
            Query, Video, and on Phone.
          </li>
          <li>
            • Discuss <span>medical cases</span> with fellow Bonex doctors.
          </li>
          <li>
            • Increase your <span>online brand</span> by publishing articles and
            health tips to a large database of our patients.
          </li>
        </ul>
      </div>

      {/* Award Section with File Upload */}
      <div className="award">
        <h2>Awards/Recognitions </h2>
        <button onClick={handleAddClick}>+ Add</button>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <span>
          Note: If you have trouble in uploading your certificates, please email
          them to us at Bonex@Bonex.com.
        </span>
      </div>

      <div className="div-line" style={{ width: "50%", marginTop: "10px" }}></div>

      {/* Form Section */}
      <div className="container3">
        <form onSubmit={handleFormSubmit}>
          <div className="form-row">
            <label htmlFor="clinicName">Current Workplace/ClinicName</label>
            <input
              type="text"
              id="clinicName"
              placeholder="Enter your ClinicName or address"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
            {errors.clinicName && <span className="error">{errors.clinicName}</span>}
          </div>
          <div className="form-row">
            <label htmlFor="experience">Years of experience</label>
            <input
              type="number"
              id="experience"
              placeholder="5 Years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
            {errors.experience && <span className="error">{errors.experience}</span>}
          </div>
          <div className="form-row">
            <label htmlFor="fees">Consultation Fees</label>
            <input
              type="number"
              id="fees"
              placeholder="50 $"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
            />
            {errors.fees && <span className="error">{errors.fees}</span>}
          </div>
          <div className="form-row">
            <label htmlFor="hours">Consultation hours/availability</label>
            <input
              type="number"
              id="hours"
              placeholder="6 hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            {errors.hours && <span className="error">{errors.hours}</span>}
          </div>
          <button type="submit">Submit &amp; Continue</button>
        </form>
      </div>
    </div>
  );
};

export default Doctor3;
