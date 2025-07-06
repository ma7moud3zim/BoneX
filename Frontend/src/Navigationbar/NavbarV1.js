import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import logo from '../images/BoneX_Logo.png'
const NavbarV1 = () => {
  return (
     <Navbar className=''   expand="lg">
      
        <Navbar.Brand className='an' href="#home" >
    <Link to="" id="logo">
        <img src={logo} alt="Bonex Logo" className="ign" />
      </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* 2) Everything inside Collapse will be hidden/shown */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left-aligned links */}
          <Nav className="me-auto ">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
          {/* Right-aligned links */}
          <Nav className="ms-auto">
            <Nav.Link href="#account">Account</Nav.Link>
            <Nav.Link href="#settings">Settings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    
    </Navbar>
  )
}

export default NavbarV1