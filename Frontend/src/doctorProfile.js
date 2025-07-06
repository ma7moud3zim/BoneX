import React, { useEffect, useState } from 'react'
import cer1 from './images/cer1.jpg'
import { useNavigate } from 'react-router-dom'
import MapComponent from './components/MapComponent '
import { Link, useParams } from 'react-router-dom'
import ModalComponent from './components/ModalComponent'
import './doctorProfile.css'
const DoctorProfile = () => {
  const [user,setuser]=useState(JSON.parse(sessionStorage.getItem('userInfo')))
  const [doctor,setdoctor]=useState(null)
 const[isopen,setisopen]=useState(false)
const navigate=useNavigate();
  const params=useParams();

const degreeurl='https://bonex.runasp.net'+doctor?.degreeCertificate;
const postgradurl='https://bonex.runasp.net'+doctor?.additionalCertification;
const profilepic='https://bonex.runasp.net'+doctor?.profilePicture;
const handlebook=()=>{setisopen(true)}
const handleClose=()=>{setisopen(false)}

useEffect(() => {
    console.log(params.id);

    fetch(`https://bonex.runasp.net/Doctor/profile/${params.id}`, {
      headers: {
        'authorization': `Bearer ${user.token}`
      }
    })
      .then((res) => res.json())
      .then((data) =>{ setdoctor(data);console.log(data); })
      
      .catch((error) => console.error('Error fetching doctor data:', error));
  }, []); 
  
const handleMessageDoctor=()=>{
sessionStorage.setItem('doctorId',doctor?.id);
navigate('/chat');
}

  return (

    <div class="doctorProfilecontainer">

  <div class="profile-card">
    <div class="profile-header">
    
      <img src={profilepic} alt="Doctor Profile Picture"/>
      <div>
        <h2 id="docName">Dr.{doctor?.firstName}</h2>
        <p class="specialty" id="docSpecialty">Orthopedic Surgeon</p>
        <p class="years-exp" id="docExperience">{doctor?.yearsOfExperience} Years of Experience</p>
        <p class="registration" id="docReg">Reg. No: 1234567</p>
      </div>
    </div>
  </div>
<>


</>
{/* 
  <button class="edit-profile-btn" onclick="openModal()"  hidden={user.role === 'patient'}>Edit Profile</button>
*/}
 
  <section id="overview">
    <h3 class="section-title">Brief About the Doctor</h3>
    <p id="docBio">
    {doctor?.brief}
    </p>
    {
    <div class="actions">
      <button className="book-btn" hidden={user.role === 'Doctor'} onClick={handlebook}>Book Appointment</button>
      <button class="msg-btn"   hidden={user.role === 'Doctor'} onClick={handleMessageDoctor}> Message Doctor </button>
    </div>
    }
  </section>
{isopen&&(<ModalComponent  isopen={isopen} handleClose={handleClose} doctorid={doctor?.id} />)}

  <section id="education">
    <h3 class="section-title">Education & Qualifications</h3>
    <p class="section-content" id="educationInfo">
      Undergraduate: {doctor?.universityName} ({doctor?.graduationYear})
      <br />
      Postgraduate: MD (Orthopedics); Fellowship in Sports Medicine
    </p>
  </section>

 
<section id="achievements">
    <h3 class="section-title">Achievements & Awards</h3>
    <div id="carouselAchievements" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src={degreeurl} class="d-block w-100" alt="Certificate of Excellence"/>
          <div class="carousel-caption d-none d-md-block">
            <h5>graduation of Certificate</h5>
          </div>
        </div>
        <div class="carousel-item">
          <img src={postgradurl} class="d-block w-100" alt="Medical Degree Certificate"/>
          <div class="carousel-caption d-none d-md-block">
            <h5>Postgraduate  Certificate</h5>
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
    Current Clinic: {doctor?.workplaceName} Center
    <br />
    Address: 1234 Health Street, Cairo, Egypt
    <br />
    Consultation Fee: ${doctor?.consultationFees}
    <br />
    Availability: Sun-Fri ({doctor?.consultationHours})
    <br />
    Consultation Methods: Video Call, In-Person, Phone
    <br />
    Additional Qualification: None 
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
      Languages: English, Arabic
      <br />
      Affiliations: Egyptian Medical Association, International Orthopedic Society
      <br />
      Certifications: Board Certified Orthopedic Surgeon, Fellowship in Sports Medicine
      <br />
      Awards: Best Surgeon Award 2019, Healthcare Excellence Award 2021
      <br />
      FaceBook:none
      <br />
      LinkedIn: none
      <br />
      Publications:none 
    </p>
    <div class="sub-section">
      <h4>Clinic Location</h4>
      <div class="embed-container">
     <MapComponent lat={parseFloat(doctor?.latitude || 0, 10)} lng={parseFloat(doctor?.longitude || 0, 10)}/>
      </div>
    </div>
    
  </section>
</div>
  );
}

export default DoctorProfile;