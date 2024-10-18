import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user session and redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const userName = 'John Doe'; // Replace with actual user data from the backend
  const role = 'Student'; // Replace with actual role data

  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="App Logo" className="logo" />
        <h1>Student Dashboard</h1>
      </div>
      <div className="header-right">
        <span className="user-info">
          {userName} ({role})
        </span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
