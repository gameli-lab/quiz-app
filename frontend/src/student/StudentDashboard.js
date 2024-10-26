import React from "react";
import Navbar from "../landingpage/navbar";
import QuizSection from "./QuizSection";
import ResultsSection from "./ResultsSection";
import ProgressChart from "./ProgressChart";
import ProfileSection from "./ProfileSection";
import Footer from "../landingpage/footer";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <div className="main-content">
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

      <Footer />
    </div>
  );
};

export default StudentDashboard;

