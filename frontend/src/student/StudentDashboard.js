import React from "react";
import Header from "../component/Header";
import Sidebar from "../component/Sidebar";
import QuizSection from "./QuizSection";
import ResultsSection from "./ResultsSection";
import ProgressChart from "./ProgressChart";
import ProfileSection from "./ProfileSection";
import Footer from "../component/Footer";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <Header />

      <div className="dashboard-content">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content">
          {/* Progress Overview */}
          <section className="progress-overview">
            <h2>Progress Overview</h2>
            <ProgressChart />
          </section>

          {/* Quiz Section */}
          <section className="quiz-section">
            <h2>Available Quizzes</h2>
            <QuizSection />
          </section>

          {/* Results Section */}
          <section className="results-section">
            <h2>Your Results</h2>
            <ResultsSection />
          </section>

          {/* Profile Section */}
          <section className="profile-section">
            <h2>Your Profile</h2>
            <ProfileSection />
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StudentDashboard;
