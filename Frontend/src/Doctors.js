import React  from 'react';
import {useState , useEffect}  from 'react';
import "./Home.css"
import DoctorCard from './components/DoctorCard.jsx'
import TheImage from "../src/images/avatar-male.jpg";


function Doctors() {

  // we should here retrieve the data of doctors from the database and then show them organized
  // in every panal 

  
  // Every card should lead to another page that called doctor details page
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchDoctors = async () => {
        try {
          const response = await fetch("http://bonex.runasp.net/me/doctors");
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setDoctors(data);
          console.log(data);
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchDoctors();
    }, []);
  const doctor = {
    id:'1',
    name: 'Dr. Ahmed Imam',
    specialization: 'Cardiologist',
    description: 'Dr. John Doe is a renowned cardiologist with over 20 years of experience in treating heart diseases.',
    image: TheImage, 
  };
  const doctor2 = {
    id:'2',
    name: 'Dr. Mohamed Esmaeal',
    specialization: 'Cardiologist',
    description: 'Dr. John Doe is a renowned cardiologist with over 20 years of experience in treating heart diseases.',
    image: TheImage, 
  };
  const doctor3 = {
    id:'3',
    name: 'Dr. Khaled Tawfic',
    specialization: 'Cardiologist',
    description: 'Dr. John Doe is a renowned cardiologist with over 20 years of experience in treating heart diseases.',
    image: TheImage, 
  };
  const doctor4 = {
    id:'4',
    name: 'Dr. Ibraheem Mohamed',
    specialization: 'Cardiologist',
    description: 'Dr. John Doe is a renowned cardiologist with over 20 years of experience in treating heart diseases.',
    image: TheImage, 
  };

  return (
  <div className="Doctors">
      <div className="transparent-square">
        <h1>Doctors list</h1>
        <h2>Book your appointment now!</h2>
        <DoctorCard doctor={doctor}/>
        <DoctorCard doctor={doctor2}/>
        <DoctorCard doctor={doctor3}/>
        <DoctorCard doctor={doctor4}/>
      </div>
    </div>
  );

}

export default Doctors;