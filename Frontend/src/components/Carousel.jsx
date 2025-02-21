// src/Carousel.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css'; 
import img1 from '../images/ConsultAdoctor.jpg';
import img2 from '../images/XrayCheck.jpg';
import img3 from '../images/historicaldisease.jpg';

const images = [
  { src: img1, text: 'Book an appointment with our best doctors to get help for all your needs.' },
  { src: img2, text: 'Know your X-ray results in no time.' },
  { src: img3, text: 'Save your medical history so doctors can help you better.' },
];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image.src} alt={`Slide ${index}`} className="carousel-image" />
            <div className="carousel-text">{image.text}</div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;