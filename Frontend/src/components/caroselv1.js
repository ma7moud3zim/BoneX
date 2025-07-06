import React from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../images/ConsultAdoctor.jpg";
import img2 from '../images/casourel.png'
const Caroselv1 = () => {
  const navigate = useNavigate();

  const h5Style = {
    fontFamily: "'Lato', sans-serif",
    fontStyle: "normal",
    fontWeight: 400,
    color: "rgb(54, 54, 54)",
    fontSize: "18px",
    lineHeight: "27px",
    marginTop: "20px",
  };

  const handleBookNow = () => {
    navigate("/doctorsv1");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "679px",
        backgroundColor: "white",
        display: "flex",
        position: "relative",
      }}
    >
      <img
        src={img2}
        alt="Consult a doctor"
        className="animate__animated animate__fadeInLeft"
        style={{
          width: "55%",
          height: "100%",
          objectFit: "cover",
          border: "none",
          WebkitMaskImage: "linear-gradient(to right, black 50%, transparent)",
          maskImage: "linear-gradient(to right, black 50%, transparent)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "74%",
          transform: "translate(-50%, -50%)",
          width: "40%",
          height: "50%",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontStyle: "normal",
            fontWeight: 100,
            color: "rgb(41, 124, 165)",
            fontSize: "52px",
            lineHeight: "59px",
            marginTop: "75px",
          }}
          className="animate__animated animate__backInRight animate__delay-1s"
        >
          Remote monitoring <br />technology with a<br /> personal touch
        </h1>

        <h5
          style={h5Style}
          className="animate__animated animate__backInRight animate__delay-1s"
        >
          Experience seamless healthcare: easily book appointments with our top
          doctors, <br />
          access your X-ray results in an instant, and securely store your
          medical history for truly personalized care.
        </h5>

        <button
          onClick={handleBookNow}
          className="animate__animated animate__backInRight animate__delay-1s font-roboto text-[16px] font-medium px-5 py-2.5 rounded w-[150px] bg-[rgb(41,124,165)] text-white cursor-pointer mt-[80px] transition-colors duration-300 ease-in-out hover:bg-[rgb(31,104,135)]"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Caroselv1;
