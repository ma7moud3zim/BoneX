import React, { useState } from "react";
import personalImg from "./images/personal.webp";
import graduateImg from "./images/graduate.webp";
import { useNavigate } from "react-router-dom";
import professionalImg from "./images/professional.png";
import "./doctor2.css";

const AcademicDetails = () => {
  const navigate = useNavigate();

  // Form field states
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [postGradCertificate, setPostGradCertificate] = useState(null);
  const [speciality, setSpeciality] = useState("");
  const [medRegNumber, setMedRegNumber] = useState("");
  const [errors, setErrors] = useState({});

  // File change handlers
  const handleDegreeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDegreeCertificate(file);
    }
  };

  const handlePostGradFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostGradCertificate(file);
    }
  };

  // Open (or create) IndexedDB
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open("AcademicFilesDB", 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create an object store "files" if it doesn't exist
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
        }
      };
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  // Store a file in IndexedDB
  const storeFileInDB = async (file, fileCategory) => {
    try {
      const db = await openDB();
      const transaction = db.transaction("files", "readwrite");
      const store = transaction.objectStore("files");

      // Record structure with metadata and the file object
      const record = {
        fileCategory, // e.g., "degreeCertificate" or "postGradCertificate"
        name: file.name,
        fileData: file, // file object is stored directly (as a Blob)
        timestamp: new Date(),
      };

      store.add(record);

      // Wrap the transaction in a promise to handle completion if needed.
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error("Error storing file in IndexedDB", error);
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};

    // Validation
    if (!university.trim()) {
      formErrors.university = "University name is required";
    }
    if (!gradYear) {
      formErrors.gradYear = "Graduation year is required";
    } else if (gradYear < 1900 || gradYear > new Date().getFullYear()) {
      formErrors.gradYear = "Please enter a valid graduation year";
    }
    if (!degreeCertificate) {
      formErrors.degreeCertificate = "Degree certificate file is required";
    } else if (degreeCertificate.size > 5242880) {
      formErrors.degreeCertificate = "Degree certificate file must be less than 5MB";
    }
    if (postGradCertificate && postGradCertificate.size > 5242880) {
      formErrors.postGradCertificate = "Postgraduate certificate file must be less than 5MB";
    }
    if (!speciality) {
      formErrors.speciality = "Please select a speciality";
    }
    if (!medRegNumber.trim()) {
      formErrors.medRegNumber = "Medical Registration Number is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    } else {
      setErrors({});
    }

    // Store the files in IndexedDB
    if (degreeCertificate) {
      await storeFileInDB(degreeCertificate, "degreeCertificate");
    }
    if (postGradCertificate) {
      await storeFileInDB(postGradCertificate, "postGradCertificate");
    }

    // Store other academic details in session storage (for non-file data)
    const academicData = {
      university,
      gradYear,
      degreeCertificate: degreeCertificate ? degreeCertificate.name : null,
      postGradCertificate: postGradCertificate ? postGradCertificate.name : null,
      speciality,
      medRegNumber,
    };
    sessionStorage.setItem("academicData", JSON.stringify(academicData));

    console.log("Form submitted successfully!", academicData);
    navigate("/Doctor3");
  };

  return (
    <div className="main-container2">
      <h1 className="head">Academic Details</h1>
      <div className="div-line"></div>
      
      {/* Progress Bar */}
      <div className="progress-bar1 animate__animated animate__slideInLeft">
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
      <div className="info-box1 animate__animated animate__slideInRight">
        <h2>Why Bonex?</h2>
        <hr />
        <ul>
          <li>
            • Consult over 10 million existing <span>online patients</span> and acquire new online patients every day.
          </li>
          <li>
            • Consult <span>your patient online</span> via multiple channels -- Query, Video, and on Phone.
          </li>
          <li>
            • Discuss <span>medical cases</span> with fellow Bonex doctors.
          </li>
          <li>
            • Increase your <span>online brand</span> by publishing articles and health tips to a large database of our patients.
          </li>
        </ul>
      </div>
      
      {/* Form */}
      <div className="container2">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="university">University Name</label>
            <input
              type="text"
              id="university"
              placeholder="Harvard"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
            {errors.university && (
              <span className="error">{errors.university}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="gradYear">Graduation Year</label>
            <input
              type="number"
              id="gradYear"
              placeholder="2005"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
            />
            {errors.gradYear && (
              <span className="error">{errors.gradYear}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="degreeCertificate">Degree Certificate</label>
            <div className="pstd">
              <input
                type="file"
                id="degreeCertificate"
                onChange={handleDegreeFileChange}
              />
              <span>Max Size is 5MB</span>
            </div>
            {errors.degreeCertificate && (
              <span className="error">{errors.degreeCertificate}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="postGradCertificate">Postgraduate (if any)</label>
            <div className="pstd">
              <input
                type="file"
                id="postGradCertificate"
                onChange={handlePostGradFileChange}
              />
              <span>Max Size is 5MB</span>
            </div>
            {errors.postGradCertificate && (
              <span className="error">{errors.postGradCertificate}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="specialities">Specialities</label>
            <select
              name="specialities"
              id="specialities"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
            >
              <option value="" disabled>
                Select Specialities
              </option>
              <option value="orthopedics">Orthopedics</option>
              <option value="radiology">Radiology</option>
              <option value="physical therapy">Physical Therapy</option>
              <option value="sports_medicine">Sports Medicine</option>
              <option value="others">Others</option>
            </select>
            {errors.speciality && (
              <span className="error">{errors.speciality}</span>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="medRegNumber">Medical Registration Number</label>
            <input
              type="text"
              id="medRegNumber"
              placeholder="Fill your Medical Registration Number"
              value={medRegNumber}
              onChange={(e) => setMedRegNumber(e.target.value)}
            />
            {errors.medRegNumber && (
              <span className="error">{errors.medRegNumber}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Submit &amp; Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default AcademicDetails;
