import React from 'react';
import '../src/App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';

import Nav from './Navigationbar/Nav';

import RegisterDoctor1 from "./RegisterDoctor1";
import Consultion from './consutlion'
import EditProfile from './update-profile';
import Changepassword from './changepassword';

import AcademicDetails from './doctor2';
import Doctor3 from './doctor3';
import Register from './Register';
import HomepageD from './main';
import Footer from './footer.jsx'
import UploadComponent from './XrayCheck.jsx'
import Home from './Home.js'
import Doctors from './Doctors.js'
import Chatpage from './Chatpage.js' 
import DoctorProfile from './doctorProfile.js';
import AwardModal from './AwardModal.js';
import JitsiMeet from './JitsiMeet.js';
import PatientProfile from './PatientProfile.jsx';
import PatientFeedback from './PatientFeedback.js';
import DoctorDetails from './doctorDetails.jsx'

import Notifications from './Notifications.jsx';
function App() {
  return (
    
    
    <Router>
    <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/chat" element={<Chatpage />} />
        <Route path="/homed" element={<HomepageD />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Doctor1" element={<RegisterDoctor1 />} />
        <Route path="/Doctor3" element={<Doctor3 />} />
        <Route path="/Doctor2" element={<AcademicDetails />} />
        <Route path="/xray" element={<UploadComponent />} />
        <Route path="/doctorprofile" element={<DoctorProfile />} />
        <Route path="/wrd" element={<AwardModal />} />
        <Route path="/meet" element={<JitsiMeet />} />
      
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/notifications" element={<Notifications/>}/>
        <Route path="/patientfeedback" element={<PatientFeedback/>}/>
        <Route path="/doctorDetails/:id" element={<DoctorDetails/>}/>

      
        <Route path="/login" element={<Login />} />
       س
        <Route path="/consultion" element={<Consultion />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/changepassword" element={<Changepassword />} />

      </Routes>
      <Footer />
    </Router>
    
  );
}

export default App;
