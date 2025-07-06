import React from 'react';
import doctoravt from "../images/professional-male-doctor.jpg";
import { useNavigate } from 'react-router-dom';
const ClinicCard = () => {
  const navigate = useNavigate();
  const handleFindClinicClick = () => {
    navigate('/doctorsv1');
  }
  return (
    
   <div className="flex flex-col md:flex-row  bg-gray-50 mx-auto rounded-lg shadow-md" style={{width: '90%', height: '500px'}}>
  <div className="md:w-2/4 p-6 ">
    <p className="text-teal-600 text-sm uppercase  ml-[165px] " style={{marginTop:'33px',fontSize:'14px',lineHeight:'24px'}}>Locate Us</p>
    <h2 className="text-2xl font-bold text-black mt-2 ml-[165px]" style={{marginTop:'8px'}}>Find Your Nearest Clinic <br />Today</h2>
    <p
  className="ml-[165px] text-sm text-gray-700"
  style={{
    marginTop: '44px',
    fontFamily: 'Roboto, serif',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '29px',
    color: 'rgb(59, 60, 62)',
  }}
>
  With over 60 clinics across Egypt, Healthway Medical is always nearby.
  <br />
  Find a GP clinic close to you today.
</p>

    <button className="bg-[#071952] hover:bg-[#0B2C78] text-white  py-3 px-6  mt-4 " style={{borderRadius:'20px',marginLeft:'165px',fontSize:'1.2rem',fontWeight:'500'}} onClick={handleFindClinicClick}>Find a Clinic</button>
  </div>
  <div className="md:w-2/4">
    <img src={doctoravt} alt="Clinic location illustration" className="w-full h-full object-fit rounded-r-lg" />
  </div>
</div>
  );
};

export default ClinicCard;