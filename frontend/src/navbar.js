import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import logo from './logo.jpg';

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="branding">
        <Link to="/"></Link>
        <img src={logo} alt="Quiz App Logo" className="logo" />
        <h1>QuizMaster</h1>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><Link to="/role">Sign Up</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
