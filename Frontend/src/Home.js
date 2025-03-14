import React from 'react'
import Carousel from './components/Carousel';
import DoctorsHome from './DoctorsHome.js';
import './Home.css'

const Home = () => {
  return (
    <div className='transparent-square-auto'>
      <br/>
      <Carousel />
      <br/><br/>
      <DoctorsHome/>
  </div>
  )
}

export default Home;