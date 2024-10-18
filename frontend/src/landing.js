import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.jpg';
import heroImage from './hero.jpg';
import custom_quiz from './custom_quiz.jpg';
import track_learning from './track_learning.jpg';
import gamification from './gamification.jpg';
import './landing.css';

const LandingPage = () => {
  return (
    <div>
      {/* Header Section */}
      <header>
        <div className="header-container">
          <div className="logo">
            <img src={ logo } alt="Quiz App Logo" />
            <h1>QuizApp</h1>
          </div>
          <nav className="navbar">
            <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="#about">About</Link></li>
            <li><Link to="#features">Features</Link></li>
            <li><Link to="#testimonials">Testimonials</Link></li>
            <li><Link to="/role">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>

{/*               <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#footer">Contact</a></li>
 */}            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-image">
            <img src={heroImage} alt="Quiz App Hero" />
          </div>
          <div className="hero-text">
            <h2>Welcome to QuizApp</h2>
            <p>Create custom quizzes, analyze performance, and enhance learning through gamification!</p>
            <button>Get Started</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Our Features</h2>
        <div className="features-container">
          <div className="feature-item">
            <div className="feature-image">
              <img src={custom_quiz} alt="Custom Quiz Creation" />
            </div>
            <h3>Custom Quiz Creation</h3>
            <p>Create quizzes tailored to your students' needs.</p>
          </div>
          <div className="feature-item">
            <div className="feature-image">
              <img src={track_learning} alt="Teacher Analytics" />
            </div>
            <h3>Teacher Analytics</h3>
            <p>Get detailed analytics on your students' progress.</p>
          </div>
          <div className="feature-item">
            <div className="feature-image">
              <img src={gamification} alt="Gamification" />
            </div>
            <h3>Gamification</h3>
            <p>Make learning fun with quizzes, challenges, and leaderboards!</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <h2>What People Say</h2>
        <div className="testimonial-item">
          <div className="testimonial-content">
            <p>"QuizApp has transformed how I teach. My students love the quizzes!"</p>
            <p className="testimonial-author">- Mrs. Adjei, Teacher</p>
          </div>
        </div>
        <div className="testimonial-item">
          <div className="testimonial-content">
            <p>"I love the challenges in QuizApp. It makes learning more exciting!"</p>
            <p className="testimonial-author">- Kofi, Student</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="footer">
        <p>&copy; 2024 QuizApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
