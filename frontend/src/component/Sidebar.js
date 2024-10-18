import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/student">Dashboard</Link></li>
        <li><Link to="/student/quiz">Take Quiz</Link></li>
        <li><Link to="/student/results">Results</Link></li>
        <li><Link to="/student/profile">Profile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
