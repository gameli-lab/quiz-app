import React, { useState } from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import QuizSection from "./QuizSection";
import ResultsSection from "./ResultsSection";
import ProgressChart from "./ProgressChart";
import ProfileSection from "./ProfileSection";
import Footer from "../component/Footer";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Header />

      {/* Hamburger Icon */}
      <div
        className={`hamburger-icon ${sidebarOpen ? "open" : ""}`}
        onClick={handleSidebarToggle}
      />

      <div className="dashboard-content">
        <Sidebar isOpen={sidebarOpen} />

        <div
          className="main-content"
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          <section className="progress-overview">
            <h2>Progress Overview</h2>
            <ProgressChart />
          </section>

          <section className="quiz-section">
            <h2>Available Quizzes</h2>
            <QuizSection />
          </section>

          <section className="results-section">
            <h2>Your Results</h2>
            <ResultsSection />
          </section>

          <section className="profile-section">
            <h2>Your Profile</h2>
            <ProfileSection />
          </section>
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default StudentDashboard;

/* import React, { useState } from "react";
import Header from "../component/Header";
import Navbar from "../component/Navbar"; // Change from Sidebar to Navbar
import QuizSection from "./QuizSection";
import ResultsSection from "./ResultsSection";
import ProgressChart from "./ProgressChart";
import ProfileSection from "./ProfileSection";
import Footer from "../component/Footer";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleNavbarToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div className="dashboard-container">
      <Header />

      {/* Hamburger Icon for Mobile View *
      <div
        className={`hamburger-icon ${navbarOpen ? "open" : ""}`}
        onClick={handleNavbarToggle}
      />

      <div className="dashboard-content">
        <Navbar isOpen={navbarOpen} /> 
        <div
          className="main-content"
          onClick={() => navbarOpen && setNavbarOpen(false)}
        >
          <section className="progress-overview">
            <h2>Progress Overview</h2>
            <ProgressChart />
          </section>

          <section className="quiz-section">
            <h2>Available Quizzes</h2>
            <QuizSection />
          </section>

          <section className="results-section">
            <h2>Your Results</h2>
            <ResultsSection />
          </section>

          <section className="profile-section">
            <h2>Your Profile</h2>
            <ProfileSection />
          </section>
        </div>
      </div>

      {/* Footer 
      {/* <Footer /> 
    </div>
  );
};

export default StudentDashboard;
 */
