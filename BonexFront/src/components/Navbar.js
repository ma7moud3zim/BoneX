import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

import { Link } from 'react-router-dom';

function NavigationBar() {




  function handlelogout(){
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('expiration');
    window.location.pathname="/"
    
    
    }
    
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Bonex</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!(localStorage.getItem('username')||localStorage.getItem('token'))?
              (
           <>
            <Nav.Link as={Link} to="/">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          ):(
<Nav.Link as={Link} to="/"  onClick={handlelogout}>Logout</Nav.Link>

          )}
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
