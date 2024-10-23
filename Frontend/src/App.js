import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NavigationBar from './components/Navbar';
import Home from './Home';
import Consultion from './consutlion'
import EditProfile from './update-profile';
import Changepassword from './changepassword';
function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/consultion" element={<Consultion />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/changepassword" element={<Changepassword />} />

      </Routes>
    </Router>
  );
}

export default App;
