import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CreateQuizSection from "./CreateQuizSection";
import ManageQuizzesSection from "./ManageQuizzesSection";
import ViewResultsSection from "./ViewResultsSection";
import "./teacher-dashboard.css";

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
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
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
    </div>
  );
};

export default TeacherDashboard;
