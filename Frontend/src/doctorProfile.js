import React, { useState } from 'react'
import './doctorProfile.css'
import cer1 from './images/cer1.jpg'
import MapComponent from './components/MapComponent '
const DoctorProfile = () => {
  const [user,setuser]=useState(JSON.parse(sessionStorage.getItem('userInfo')))
  return (

    <div class="doctorProfilecontainer">

  <div class="profile-card">
    <div class="profile-header">
    
      <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt="Doctor Profile Picture"/>
      <div>
        <h2 id="docName">Dr. Ahmed</h2>
        <p class="specialty" id="docSpecialty">Orthopedic Surgeon</p>
        <p class="years-exp" id="docExperience">10 Years of Experience</p>
        <p class="registration" id="docReg">Reg. No: 1234567</p>
      </div>
    </div>
  </div>

 
  <button class="edit-profile-btn" onclick="openModal()"  hidden={user.role === 'patient'}>Edit Profile</button>

 
  <section id="overview">
    <h3 class="section-title">Brief About the Doctor</h3>
    <p id="docBio">
      Dr. Ahmed is a board-certified Orthopedic Surgeon specializing in musculoskeletal injuries and conditions. With a passion for minimally invasive techniques, he focuses on helping patients recover quickly and with minimal discomfort. His patient-centered approach emphasizes clear communication and personalized care.
    </p>
    <div class="actions">
      <button className="book-btn" hidden={user.role === 'Doctor'}>Book Appointment</button>
      <button class="msg-btn"   hidden={user.role === 'Doctor'}>Message Doctor</button>
    </div>
  </section>


  <section id="education">
    <h3 class="section-title">Education & Qualifications</h3>
    <p class="section-content" id="educationInfo">
      Undergraduate: MBBS, Harvard Medical School (2010)
      <br />
      Postgraduate: MD (Orthopedics); Fellowship in Sports Medicine
    </p>
  </section>

 
<section id="achievements">
    <h3 class="section-title">Achievements & Awards</h3>
    <div id="carouselAchievements" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src={cer1} class="d-block w-100" alt="Certificate of Excellence"/>
          <div class="carousel-caption d-none d-md-block">
            <h5>Certificate of Excellence</h5>
          </div>
        </div>
        <div class="carousel-item">
          <img src="" class="d-block w-100" alt="Medical Degree Certificate"/>
          <div class="carousel-caption d-none d-md-block">
            <h5>Medical Degree Certificate</h5>
          </div>
        </div>
        <div class="carousel-item">
          <img src="./images/cer1.jpg" class="d-block w-100" alt="Best Surgeon Award"/>
          <div class="carousel-caption d-none d-md-block">
            <h5>Best Surgeon Award</h5>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselAchievements" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselAchievements" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </section>
  

  <section id="professional">
  <h3 className="section-title">Professional Details</h3>
  <p className="section-content" id="professionalInfo">
    Current Clinic: Sunshine Orthopedic Center
    <br />
    Address: 1234 Health Street, Cairo, Egypt
    <br />
    Consultation Fee: $95
    <br />
    Availability: Mon-Fri (9:00 AM - 4:00 PM)
    <br />
    Consultation Methods: Video Call, In-Person, Phone
    <br />
    Additional Qualification: Advanced Certification in Minimally Invasive Procedures
  </p>
</section>

<section id="reviews">
  <h3 class="section-title">Reviews & Ratings</h3>
  <p><strong>Overall Rating:</strong> 4.7 / 5</p>
  <div class="reviews-container">
    <div class="review">
      <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="Hossam A."/>
      <p class="review-text">"Dr. Ahmed performed my knee surgery. I recovered quickly and painlessly. Highly recommend!"</p>
      <p class="reviewer-name">Sarah A.</p>
    </div>
    <div class="review">
      <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Mohammed F."/>
      <p class="review-text">"Great bedside manner and thorough explanations. Truly caring."</p>
      <p class="reviewer-name">Mohammed F.</p>
    </div>
    <div class="review">
      <img src="https://randomuser.me/api/portraits/men/46.jpg" alt="Ahmed R."/>
      <p class="review-text">"Efficient and professional. The appointment was smooth from start to finish."</p>
      <p class="reviewer-name">Ahmed R.</p>
    </div>
    <div class="review">
      <img src="https://randomuser.me/api/portraits/men/47.jpg" alt="Kareem B."/>
      <p class="review-text">"Dr. Ahmed provided excellent guidance for my back pain. His advice was life-changing!"</p>
      <p class="reviewer-name">Kareem B.</p>
    </div>
    <div class="review">
      <img src="https://randomuser.me/api/portraits/men/48.jpg" alt="Omar M."/>
      <p class="review-text">"Highly skilled and compassionate. He explained everything clearly and gave me confidence in my treatment."</p>
      <p class="reviewer-name">Omar M.</p>
    </div>
    <div class="review">
      <img src="https://randomuser.me/api/portraits/men/49.jpg" alt="abdallah E."/>
      <p class="review-text">"Top-notch care! My post-surgery recovery was smooth and well-managed, thanks to Dr. Ahmed."</p>
      <p class="reviewer-name">abdallah E.</p>
    </div>
  </div>
</section>


  <section id="additional-info">
    <h3 class="section-title">Additional Information</h3>
    <p class="section-content" id="additionalInfo">
      Languages: English, Arabic, French
      <br />
      Affiliations: Egyptian Medical Association, International Orthopedic Society
      <br />
      Certifications: Board Certified Orthopedic Surgeon, Fellowship in Sports Medicine
      <br />
      Awards: Best Surgeon Award 2019, Healthcare Excellence Award 2021
      <br />
      Twitter: <a href="https://twitter.com/dr_ahmed" target="_blank">twitter.com/dr_ahmed</a>
      <br />
      LinkedIn: <a href="https://linkedin.com/in/dr-ahmed" target="_blank">linkedin.com/in/dr-ahmed</a>
      <br />
      Publications: <a href="https://scholar.google.com/citations?user=example" target="_blank">Google Scholar Profile</a>
    </p>
    <div class="sub-section">
      <h4>Clinic Location</h4>
      <div class="embed-container">
     <MapComponent lat={30.044420} lng={31.235712}/>
      </div>
    </div>
    
  </section>
</div>
  );
}

export default DoctorProfile;