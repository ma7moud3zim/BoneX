import React from 'react';
import DoctorCard from './components/DoctorCard'
import TheImage from "../src/images/avatar-male.jpg";
import { useNavigate } from 'react-router-dom';

function Doctors() {

  // we should here retrieve the data of doctors from the database and then show them organized
  // in every panal 
  // Every card should lead to another page that called doctor details page
  const navigate = useNavigate();

  const ShowAllClick = () => {
    navigate('/doctors');
  };

  const doctor = {
    id: '1',
    name: 'Dr. Ahmed Imam',
    specialization: 'Cardiologist',
    description: 'Dr. John Doe is a renowned cardiologist with over 20 years of experience in treating heart diseases.',
    image: TheImage, 
  };
  const doctor2 = {
    id: '2',
    name: 'Dr. Mohamed Esmaeal',
    specialization: 'Cardiologist',
    description: 'Dr. John Doe is a renowned cardiologist with over 20 years of experience in treating heart diseases.',
    image: TheImage, 
  };
  const doctor3 = {
    id: '3',
    name: 'Dr. Khaled Tawfic',
    specialization: 'Cardiologist',
    description: 'Dr. John Doe is a renowned cardiologist with over 20 years of experience in treating heart diseases.',
    image: TheImage, 
  };
  return (
    <div className='transparent-square'>
      <h1> Doctors are ready for your help!</h1>
        <DoctorCard doctor={doctor}/>
        <DoctorCard doctor={doctor2}/>
        <DoctorCard doctor={doctor3}/>
        <button className='show-all-doctors' onClick={ShowAllClick}> Show All Doctors </button>
    </div>
  );

}
export default Doctors;
