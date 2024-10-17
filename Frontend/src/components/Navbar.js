import React from 'react';
import { Navbar, Nav, Container, Image, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleState } from '../RTK/slices/usersActiveslice';
import logo from '../images/Logo.jpg';

function NavigationBar() {
  const isUserActive = useSelector(state => state.isActive); // Corrected variable name to camelCase
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(toggleState('no'));
    navigate('/home');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Left-aligned Logo */}
        <Navbar.Brand as={Link} to="/">
          <Image
            src={logo}
            alt="logo"
            height="50"
            width="50"
            className="d-inline-block rounded-circle"
          />
        </Navbar.Brand>
        <Nav.Link as={Link} className="text-light" to='/consultion'>Consult a Doctor</Nav.Link> 

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible Navbar Content */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Nav Links aligned to the right */}
          <Nav className="ms-auto">
            {isUserActive === "no" ? (
              <>
                <Nav.Link as={Link} to="/">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="dropdown-user" className="text-light">
                  Welcome! <span className="fw-bold">ahmed</span> {/* Replace 'ahmed' with dynamic username */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/editprofile">Edit Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/changepassword">Change Password</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
