import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NavigationBar from './components/Navbar';
import Home from './Home';
import Consultion from './consutlion'
import EditProfile from './update-profile';
function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/consultion" element={<Consultion />} />
        <Route path="/editprofile" element={<EditProfile />} />

      </Routes>
    </Router>
  );
}

export default App;
