import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Homepage';
import RoleSelection from './role';
import Signup from './signup';
import Login from './login';


const App = () => {
  return (
    <Routes>
      {/* Home route */}
      <Route path="/" element={<HomePage />} />

      {/* Role selection route */}
      <Route path="/role" element={<RoleSelection />} />
      
      {/* Signup route */}
      <Route path="/signup" element={<Signup />} />

      {/* Login route */}
      <Route path="/login" element={<Login />} />


    </Routes>
  );
}

export default App;
