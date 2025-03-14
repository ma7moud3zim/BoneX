import React, { useState } from "react";
import "./PatientFeedback.css";

const PatientFeedback = () => {
  const [responses, setResponses] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    rating: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResponses({ ...responses, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", responses);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1>Patient Feedback</h1>
        <p className="subtitle">Please share your experience with us</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="questions-container">
          <div className="question-card">
            <p className="question-text">
              1. Does the doctor give attention to your medical history and
              select the best medicines that are suitable for your status?
            </p>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="question1"
                  value="Yes"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Yes</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="question1"
                  value="No"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">No</span>
              </label>
            </div>
          </div>

          <div className="question-card">
            <p className="question-text">
              2. Was the doctor a good listener and gave you space to talk about
              how you feel?
            </p>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="question2"
                  value="Yes"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Yes</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="question2"
                  value="No"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">No</span>
              </label>
            </div>
          </div>

          <div className="question-card">
            <p className="question-text">
              3. Do you want to continue your treatment with this doctor?
            </p>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="question3"
                  value="Yes"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Yes</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="question3"
                  value="No"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">No</span>
              </label>
            </div>
          </div>

          <div className="question-card">
            <p className="question-text">
              4. Were your expectations from the session met?
            </p>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="question4"
                  value="Yes"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Yes</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="question4"
                  value="No"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">No</span>
              </label>
            </div>
          </div>

          <div className="question-card">
            <p className="question-text">
              5. Do you recommend this doctor to other patients?
            </p>
            <div className="radio-group">
              <label className="radio-container">
                <input
                  type="radio"
                  name="question5"
                  value="Yes"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">Yes</span>
              </label>
              <label className="radio-container">
                <input
                  type="radio"
                  name="question5"
                  value="No"
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                <span className="radio-label">No</span>
              </label>
            </div>
          </div>

          <div className="rating-card">
            <p className="question-text">Rate your experience</p>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="star-container">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    onChange={handleChange}
                  />
                  <span className="star">⭐</span>
                  <span className="star-label">{star}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default PatientFeedback;