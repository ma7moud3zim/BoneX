import {React,useEffect,useState} from 'react';
import Slider from 'react-slick';
import DoctorCardv1 from './components/DoctorCardv1';
import { useNavigate } from 'react-router-dom';
import './doctorhomev1.css'
export default function Doctors() {
  const [doctors, setdoctors] = useState([]);
  const navigate = useNavigate();
  const showAllClick = () => navigate('/doctorsv1');


  useEffect(() => {
    fetch('https://bonex.runasp.net/Doctor/doctors').then((res)=>res.json()).then((data)=>setdoctors(data))

  }, []);
  
  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600,  settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div style={{ width: '90%', maxWidth: 1200, margin: '2rem auto' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
      Doctors Are Ready to Help You
    </h1>

    <Slider {...settings} style={{ padding: '0 1rem' }}>
      
      {doctors.map((doc, idx) => (
        <div key={idx} style={{ padding: '0 20px' }}>
          <DoctorCardv1 doctor={doc} />
        </div>
      ))}
    </Slider>

    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
    <button
  
  className="bg-[#287DA5] text-white border-none px-6 py-3 rounded hover:bg-[#071952] cursor-pointer transition duration-300"
  onClick={showAllClick}
>
  
  Show All Doctors
  
</button>

    </div>
  </div>
  );
}
