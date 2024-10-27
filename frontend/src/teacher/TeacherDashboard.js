import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CreateQuizSection from "./CreateQuizSection";
import ManageQuizzesSection from "./ManageQuizzesSection";
import ViewResultsSection from "./ViewResultsSection";
import "./teacher-dashboard.css";
import Footer from "../landingpage/footer";
import Navbar from "../landingpage/navbar";

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState("createQuiz"); // Default section
  const [sidebarOpen, setSidebarOpen] = useState(false); // For sidebar toggling

  const renderSection = () => {
    switch (activeSection) {
      case "createQuiz":
        return <CreateQuizSection />;
      case "manageQuizzes":
        return <ManageQuizzesSection />;
      case "viewResults":
        return <ViewResultsSection />;
      default:
        return <CreateQuizSection />;
    }
  };

  return (
    <div className="teacher-dashboard">
      <div>
        <Navbar />
      </div>
      <span>
        <button
          className="hamburger-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          &#9776;
        </button>
      </span>
      <div className="dashboard-container">
        <Sidebar
          setActiveSection={setActiveSection}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div
          className={`dashboard-content ${sidebarOpen ? "shifted" : ""}`}
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          {renderSection()}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default TeacherDashboard;
