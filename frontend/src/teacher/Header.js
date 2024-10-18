import React from 'react';
import './teacher-dashboard.css';

const Header = () => {
  return (
    <div className="header">
      <h1>Teacher Dashboard</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/logout">Logout</a>
      </nav>
    </div>
  );
};

export default Header;
