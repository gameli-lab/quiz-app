// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css'; 
import logo from './logo.jpg';

const Header = () => {
  return (
    <header className="home-header">
      <div className="branding">
        <Link to="/">
          <img src={logo} alt="Quiz App Logo" className="logo" />
        </Link>
        <h1>QuizMaster</h1>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="#about">About</Link></li>
          <li><Link to="#features">Features</Link></li>
          <li><Link to="#testimonials">Testimonials</Link></li>
          <li><Link to="/role">Sign Up</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
