import React, { useState, useRef, useEffect } from "react";
import personalImg from "./images/personal.webp";
import graduateImg from "./images/graduate.webp";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is imported
import axios from "axios";
import professionalImg from "./images/professional.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

import AwardModal from "./AwardModal";
import "./doctor3.css";

const Doctor3 = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedAwardFile, setUploadedAwardFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

const[sh,setsh]=useState(false);
  
  // Professional form field states
  const [clinicName, setClinicName] = useState("");
  const [experience, setExperience] = useState("");
  const [docbrief, setDocbrief] = useState("");
  const [fees, setFees] = useState("");
  const [hours, setHours] = useState("");
  const [errors, setErrors] = useState({});

  // Get user geolocation (if needed)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log("Location:", position.coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);



  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedAwardFile(file);
      console.log("Selected award file:", file);
    }
  };

  // Helper: Retrieve an academic file from IndexedDB ("AcademicFilesDB")
  const getAcademicFileFromDB = async (fileCategory) => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("AcademicFilesDB", 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("files", "readonly");
        const store = transaction.objectStore("files");
        const cursorRequest = store.openCursor();
        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.fileCategory === fileCategory) {
              resolve(cursor.value);
              return;
            }
            cursor.continue();
          } else {
            resolve(null);
          }
        };
        cursorRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  // Helper: Retrieve the user picture from IndexedDB ("DoctorFilesDB")
  const getUserPicFromDB = async () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("DoctorFilesDB", 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("files", "readonly");
        const store = transaction.objectStore("files");
        const cursorRequest = store.openCursor();
        cursorRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.fileCategory === "userpic") {
              resolve(cursor.value);
              return;
            }
            cursor.continue();
          } else {
            resolve(null);
          }
        };
        cursorRequest.onerror = (event) => {
          reject(event.target.error);
        };
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (docbrief.trim() === "") {
      formErrors.docbrief = "The brief is required";
    }
    if (clinicName.trim() === "") {
      formErrors.clinicName = "Clinic name is required";
    }
    if (!experience || experience <= 0) {
      formErrors.experience = "Years of experience must be greater than 0";
    }
    if (!fees || fees <= 0) {
      formErrors.fees = "Consultation fees must be greater than 0";
    }
    if (!hours || hours <= 0) {
      formErrors.hours = "Consultation hours must be greater than 0";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    } else {
      setErrors({});
    }
    setLoading(true);
    // Retrieve stored data from previous pages
    const doctorDataStr = sessionStorage.getItem("doctorData");
    const academicDataStr = sessionStorage.getItem("academicData");
    const doctorData = doctorDataStr ? JSON.parse(doctorDataStr) : {};
    const academicData = academicDataStr ? JSON.parse(academicDataStr) : {};

    // Combine data from previous pages with current professional details
    const combinedData = {
      ...doctorData,
      ...academicData,
      professionalData: {
        clinicName,
        docbrief,
        experience,
        fees,
        hours,
        awardFile: uploadedAwardFile ? uploadedAwardFile.name : null,
      },
    };

    // Create FormData payload for multipart/form-data submission
    const formData = new FormData();

    // Append personal details (assuming these fields exist in doctorData)
    formData.append("email", combinedData.email);
    formData.append("password", combinedData.password);
    formData.append("firstName", combinedData.name);
    formData.append("lastName", combinedData.name);
    formData.append("dateOfBirth", combinedData.dob);
    formData.append("gender", combinedData.gender === "male" ? 1 : 2);
    formData.append("phoneNumber", "+2011155006348");

    // Append academic details
    formData.append("universityName", combinedData.university);
    formData.append("graduationYear", combinedData.gradYear);

    // Append professional details
    formData.append("yearsOfExperience", experience);
    formData.append("consultationHours", hours);
    formData.append("consultationFees", fees);
    formData.append("workplaceName", clinicName);
    formData.append("doctorBrief", docbrief);

    // Retrieve files from IndexedDB and append them
    try {
      const degreeRecord = await getAcademicFileFromDB("degreeCertificate");
      if (degreeRecord && degreeRecord.fileData) {
        formData.append("degreeCertificates", degreeRecord.fileData, degreeRecord.name);
      }
      const postGradRecord = await getAcademicFileFromDB("postGradCertificate");
      if (postGradRecord && postGradRecord.fileData) {
        formData.append("additionalCertifications", postGradRecord.fileData, postGradRecord.name);
      }
      // Get the user picture from DoctorFilesDB
      const userPicRecord = await getUserPicFromDB();
      if (userPicRecord && userPicRecord.fileData) {
        formData.append("userpic", userPicRecord.fileData, userPicRecord.name);
      }
    } catch (dbError) {
      console.error("Error retrieving files from IndexedDB:", dbError);
    }

    // Append award/recognition file from the current page if available
    if (uploadedAwardFile) {
      formData.append("awardsOrRecognitions", uploadedAwardFile, uploadedAwardFile.name);
    }

    try {
      const response = await axios.post(
        "http://bonex.runasp.net/Doctor/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("API Response:", response.data);
      if (response.status === 200) {
        sessionStorage.setItem("anuser", true);
        const userData = {
          email: combinedData.email,
          firstName: combinedData.name,
          lastName: combinedData.name,
          gender: combinedData.gender === "male" ? 1 : 0,
          role: "doc",
        };
        sessionStorage.setItem("userInfo", JSON.stringify(userData));
        navigate("/homed");
        window.location.reload(true);
      }
    } catch (error) {
      console.error("API call failed:", error);
      sessionStorage.setItem("completeDoctorData", JSON.stringify(combinedData));
    }
    finally{setLoading(false);}
  };

  return (
    <div className="main-container3">
      <h1 className="head  animate__animated animate__backInDown">Professional Details</h1>
      <div className="div-line   animate__animated animate__backInDown"></div>

      {/* Progress Bar */}
      <div className="progress-bar1 animate__animated animate__backInDown">
        <div className="circle done">
          <img src={personalImg} alt="Personal Info" />
        </div>
        <div className="line"></div>
        <div className="circle done">
          <img src={graduateImg} alt="Graduation" />
        </div>
        <div className="line"></div>
        <div className="circle inactive">
          <img src={professionalImg} alt="Professional" />
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box1 animate__animated animate__slideInRight">
        <h2>Why Bonex?</h2>
        <hr />
        <ul>
          <li>
            • Consult over 10 million existing <span>online patients</span> and acquire new online patients every day.
          </li>
          <li>
            • Consult <span>your patient online</span> via multiple channels – Query, Video, and on Phone.
          </li>
          <li>
            • Discuss <span>medical cases</span> with fellow Bonex doctors.
          </li>
          <li>
            • Increase your <span>online brand</span> by publishing articles and health tips to a large database of our patients.
          </li>
        </ul>
      </div>

      {/* Award Section with File Upload */}
      <div className="award animate__animated animate__backInLeft">
        <h2>Awards/Recognitions</h2>
        <button type="button" onClick={()=>setsh(true)}>
        Add Award
       </button>
       
        <span>
          Note: If you have trouble uploading your certificates, please email them to us at Bonex@Bonex.com.
        </span>
      </div>

      <h2 className="div-line"     style={{ width: "50%", marginTop: "10px" } } ></h2>

      {/* Professional Details Form */}
      <div className="container3 animate__animated animate__backInUp">
        <form onSubmit={handleFormSubmit}>
          <div className="form-row">
            <label htmlFor="clinicName">About You</label>
            <input
              type="text"
              id="clinicName"
              placeholder="Write a brief about yourself"
              value={docbrief}
              onChange={(e) => setDocbrief(e.target.value)}
            />
            {errors.docbrief && <span className="error">{errors.docbrief}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="clinicName">Current Workplace/Clinic Name</label>
            <input
              type="text"
              id="clinicName"
              placeholder="Enter your Clinic Name or address"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
            />
            {errors.clinicName && <span className="error">{errors.clinicName}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              placeholder="e.g., 5"
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
              placeholder="e.g., 50"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
            />
            {errors.fees && <span className="error">{errors.fees}</span>}
          </div>

          <div className="form-row">
            <label htmlFor="hours">Consultation Hours/Availability</label>
            <input
              type="number"
              id="hours"
              placeholder="e.g., 6"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            {errors.hours && <span className="error">{errors.hours}</span>}
          </div>

          <AwardModal sh={sh}  onClose={() => setsh(false)} />

          <button type="submit" className="submit-btn">
            Submit &amp; Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Doctor3;
