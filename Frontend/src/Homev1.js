import React from "react";
import DoctorsHomev1 from "./DoctorHomev1.js";
import icon1 from "./icons/1-24.png";
import icon2 from "./icons/2-26.png";
import icon3 from "./icons/3-29.png";
import icon4 from "./icons/4-31.png";
import icon5 from "./icons/5-33.png";
import timesave from './icons/benefit-time.png';
import ReviewsComponent from "./components/reviewscmp.js";
import ClinicCard from "./components/ClinicCard.js";
import Caroselv1 from "./components/caroselv1.js";
import "./Home.css";
const Homev1 = () => {
  const reviewsData = [
    {
      author: 'J.',
      comment: 'I immediately felt better after the treatment. I recommend everyone to try this doctor!',
      rating: 5,
    },
    {
      author: 'A.',
      comment: 'The doctor gave me exceptional care. He constantly answered my questions, and I was in safe hands.',
      rating: 4,
    },
    {
      author: 'H.',
      comment: 'Thank you for the doctor’s regular follow-ups. It made the treatment experience easier and less exhausting.',
      rating: 5,
    },
    {
      author: 'M.',
      comment: 'A very professional doctor with a friendly nursing staff. I highly recommend trying him.',
      rating: 5,
    },
    {
      author: 'S.',
      comment: 'I loved the comprehensive diagnostic approach and the detailed explanation of every treatment step.',
      rating: 4,
    },
    {
      author: 'F.',
      comment: 'The service was excellent, and the appointments were precisely organized.',
      rating: 5,
    },
    // ... add more reviews as needed
  ];
  

  
  
      
  return (
    <div >
      
      <Caroselv1 />
      
      
      <div className="sec1 animate__animated animate__fadeInLeftBig">
        <p 
    style={{ color: "#ED5C67",fontFamily:'"Nunito Sans", sans-serif',fontStyle:'normal',fontSize:'12px',fontWeight:'700',lineHeight:'30px',padding:'10px' }}>The Process</p>
                <h1 style={{
        color: "#010001",
        fontFamily: '"Cormorant Garamond", serif',
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: "35px",
        lineHeight: "35px"
        }}>
        Your health journey
        </h1>

        
        <div className="iconsContainer ">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={icon1} alt="ic1"></img>
            <span style={{color:'#125BD1'}}>•</span>
            <h5 style={{color:'#125BD1'}}>Build a Health Profile</h5>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={icon2} alt="ic1"></img>
            <span style={{color:'#57D4D5'}}>•</span>
            <h5 style={{color:'#57D4D5'}}>Advanced Scan</h5>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={icon3} alt="ic1"></img>
            <span style={{color:'#FA063C'}}>•</span>
            <h5 style={{color:'#FA063C'}}>Virtual consultation</h5>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={icon4} alt="ic1"></img>
            <span style={{color:'#FABA01'}}>•</span>
            <h5 style={{color:'#FABA01'}}>Personalized Health Plan</h5>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={icon5} alt="ic1"></img>
            <span style={{color:'#FE7978'}}>•</span>
            <h5 style={{color:'#FE7978'}}>Track your progress</h5>
          </div>
        </div>
      </div>
        <div className="sec2 animate__animated animate__fadeInRightBig animate__delay-1s"  style={{width:'100%',height:'500px',backgroundColor:'white',display:'flex',     gap:'10px'}}>
            
            <div style={{width:'965px',height:'503px',display:'flex',justifyContent:'center'}}>
                <img src={timesave} style={{width:'540px',height:'437px',marginTop:'63px'}}></img>
            </div>
            
            <div style={{width:'678px'}}>
                <p  style={{marginLeft:'49px',color:'#EF6970' ,marginTop:'90px',fontFamily:'"Nunito Sans", sans-serif',fontStyle:'normal',fontSize:'12px',fontWeight:'700',lineHeight:'30px'}}>TIME SAVING & ORGANIZED</p>

                <h2 style={{marginLeft:'49px',
                marginTop:'10px',
                
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "35px",
                lineHeight: "35px"}}>More time spent with <br />the doctor =<span style={{color:'#414EEE'}}>better care.</span>  </h2>
                  
                
                 <p style={{
                        marginLeft: '49px',
                        
                        color: 'rgb(51, 51, 51)',
                        fontFamily: '"Source Sans Pro", Arial, Helvetica, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '29px'
                        }}>
                        How long was your last doctor’s visit? <span style={{ fontWeight: 'bold' }}>Ten minutes?</span>
                        <br />
                        This does not allow for enough time to get to the
                        <br />
                        bottom of your health concerns. Our <span style={{ fontWeight: 'bold' }}>one-hour</span> long
                        <br />
                        consults will result in greater clarity about your health
                        <br />
                        and the need for fewer prescription medications,
                        <br />
                        reducing your risk of chronic disease, and cultivating
                        <br />
                        peace of mind.
            </p>

            </div>
        </div>
      <br />
      <ClinicCard />
      <br />
      <div id='doctor-home'>
      { <DoctorsHomev1 /> }
      </div>

      <br />
      <ReviewsComponent />
      
    </div>
  );
};

export default Homev1;
