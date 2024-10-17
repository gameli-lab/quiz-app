import React from 'react';
import { Link } from 'react-router-dom';
import './homepage.css';
import logo from './logo.jpg';
import heroImage from './hero.jpg';
import custom_quiz from './custom_quiz.jpg';
import track_learning from './track_learning.jpg';
import gamification from './gamification.jpg';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Header with Branding and Navigation */}
      <header className="home-header">
        <div className="branding">
          <Link to="/"></Link>
          <img src={logo} alt="Quiz App Logo" className="logo" />
          <h1>QuizMaster</h1>
        </div>
        <nav>
          <ul>
            <li><Link to="Homepage">Home</Link></li>
            <li><Link to="#about">About</Link></li>
            <li><Link to="#features">Features</Link></li>
            <li><Link to="#testimonials">Testimonials</Link></li>
            <li><Link to="/role">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
            {/* <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="/signup">Sign Up</a></li>
            <li><a href="/login">Login</a></li> */}
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img src={heroImage} alt="Learning Illustration" className="hero-image" />
        <div className="hero-content">
          <h2>Engage, Learn, Succeed!</h2>
          <p>Custom quizzes, analytics, and gamification to enhance learning.</p>
        </div>
      </section>

      {/* Features Overview */}
      <section className="features" id="features">
        <h3>Why Choose QuizMaster?</h3>
        <div className="feature-list">
          <div className="feature-item">
            <img src={custom_quiz} alt="Custom Quiz" />
            <h4>Custom Quiz Creation</h4>
            <p>Create tailored quizzes for any subject or class.</p>
          </div>
          <div className="feature-item">
            <img src={track_learning} alt="Analytics" />
            <h4>Teacher Analytics</h4>
            <p>Track student progress and performance effortlessly.</p>
          </div>
          <div className="feature-item">
            <img src={gamification} alt="Gamification" />
            <h4>Gamification</h4>
            <p>Make learning fun with rewards and challenges.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <h3>What Our Users Say</h3>
        <blockquote>"QuizMaster has transformed the way I teach!" - Mrs. Akosua, Teacher</blockquote>
        <blockquote>"I love the quizzes. They're so fun!" - Kwame, Student</blockquote>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
          <p>© 2024 QuizMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
