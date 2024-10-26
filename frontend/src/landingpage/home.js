// Home.js
import { Link } from "react-router-dom";
import "./css/homepage.css";
import heroImage from "./hero.jpg";
import custom_quiz from "./custom_quiz.jpg";
import track_learning from "./track_learning.jpg";
import gamification from "./gamification.jpg";

const Home = () => {
  return (
    <home>
      {/* Hero Section */}
      <section className="hero">
        <img
          src={heroImage}
          alt="Learning Illustration"
          className="hero-image"
        />
        <div className="hero-content">
          <h2>Engage, Learn, Succeed!</h2>
          <p>
            Custom quizzes, analytics, and gamification to enhance learning.
          </p>
          <p>
            Empower your teaching with personalized quizzes, analytics, and
            engaging gamification tools.
          </p>
          <p>
            Whether you’re a teacher looking to enhance your classroom
            experience or a student seeking fun and interactive ways to learn,{" "}
            <strong>QuizMaster</strong> has everything you need to succeed.
          </p>
          <Link to="/role" className="cta-btn">
            Get Started Today
          </Link>
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
        <blockquote>
          "QuizMaster has transformed the way I teach!" - Mrs. Akosua, Teacher
        </blockquote>
        <blockquote>
          "I love the quizzes. They're so fun!" - Kwame, Student
        </blockquote>
      </section>
      <section className="about" id="about">
        <h3>About QuizMaster</h3>
        <p>
          QuizMaster is an interactive platform designed to enhance learning
          experiences through custom quizzes, real-time teacher analytics, and
          gamified challenges. Whether you're a teacher or a student, QuizMaster
          provides tools to make learning both engaging and effective.
        </p>
        <p>
          With our focus on personalized quiz creation and progress tracking, we
          aim to empower educators to deliver better learning outcomes and
          motivate students with an enjoyable, interactive learning process.
        </p>
        <p>
          Join us on the journey to transform education with fun and effective
          learning tools.
        </p>
      </section>
    </home>
  );
};

export default Home;
