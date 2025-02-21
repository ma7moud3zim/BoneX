import React, { useState } from "react";
import personalImg from "./images/personal.webp";
import graduateImg from "./images/graduate.webp";
import { useNavigate } from "react-router-dom";
import professionalImg from "./images/professional.png";
import "./doctor2.css";

const AcademicDetails = () => {
  // Form field states
  const navigate = useNavigate();
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [postGradCertificate, setPostGradCertificate] = useState(null);
  const [speciality, setSpeciality] = useState("");
  const [medRegNumber, setMedRegNumber] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({});

  // File change handlers for file inputs
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

  // Form submit handler with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};

    // Validate University Name
    if (!university.trim()) {
      formErrors.university = "University name is required";
    }

    // Validate Graduation Year
    if (!gradYear) {
      formErrors.gradYear = "Graduation year is required";
    } else if (gradYear < 1900 || gradYear > new Date().getFullYear()) {
      formErrors.gradYear = "Please enter a valid graduation year";
    }

    // Validate Degree Certificate (required) and file size check (5MB)
    if (!degreeCertificate) {
      formErrors.degreeCertificate = "Degree certificate file is required";
    } else if (degreeCertificate.size > 5242880) {
      formErrors.degreeCertificate = "Degree certificate file must be less than 5MB";
    }

    // Validate Postgraduate Certificate (optional, but if provided, check file size)
    if (postGradCertificate && postGradCertificate.size > 5242880) {
      formErrors.postGradCertificate = "Postgraduate certificate file must be less than 5MB";
    }

    // Speciality selection validation
    if (!speciality) {
      formErrors.speciality = "Please select a speciality";
    }

    // Validate Medical Registration Number
    if (!medRegNumber.trim()) {
      formErrors.medRegNumber = "Medical Registration Number is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      console.log("Form submitted successfully!", {
        university,
        gradYear,
        degreeCertificate,
        postGradCertificate,
        speciality,
        medRegNumber,
      });

      // Store the inputs in session storage.
      // For file inputs, only storing file names since File objects are not serializable.
      const academicData = {
        university,
        gradYear,
        degreeCertificate: degreeCertificate ? degreeCertificate.name : null,
        postGradCertificate: postGradCertificate ? postGradCertificate.name : null,
        speciality,
        medRegNumber,
      };

      sessionStorage.setItem("academicData", JSON.stringify(academicData));
      navigate("/Doctor3");
      // Optionally, reset the form fields here if needed:
      // setUniversity("");
      // setGradYear("");
      // setDegreeCertificate(null);
      // setPostGradCertificate(null);
      // setSpeciality("");
      // setMedRegNumber("");
    }
  };

  return (
    <div className="main-container2">
      <h1 className="head">Academic Details</h1>
      <div className="div-line"></div>

      {/* Progress Bar */}
      <div className="progress-bar2">
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
      <div className="info-box2">
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
          {/* University Name */}
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

          {/* Graduation Year */}
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

          {/* Degree Certificate */}
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

          {/* Postgraduate Certificate (Optional) */}
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

          {/* Specialities */}
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
              <option value="sports_medicine">Sports Medicine</option>
              <option value="others">Others</option>
            </select>
            {errors.speciality && (
              <span className="error">{errors.speciality}</span>
            )}
          </div>

          {/* Medical Registration Number */}
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

          <button type="submit">Submit &amp; Continue</button>
        </form>
      </div>
    </div>
  );
};

export default AcademicDetails;
