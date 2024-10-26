import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import CreateQuizSection from "./CreateQuizSection";
import ManageQuizzesSection from "./ManageQuizzesSection";
import ViewResultsSection from "./ViewResultsSection";
import { handleLogout } from "../landingpage/logout"; // Import the logout function
import "./teacher-dashboard.css";
import Footer from "../landingpage/footer";
import Navbar from "../landingpage/navbar";

const TeacherDashboard = () => {
  const navigate = useNavigate();
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

  /*   const handleHomeClick = () => {
    setActiveSection("createQuiz"); // Set default section to createQuiz
    navigate("/dashboard"); // Redirect to dashboard
  };

  const handleLogoutClick = () => {
    handleLogout(navigate); // Pass navigate to handleLogout
  };
 */
  return (
    <div className="teacher-dashboard">
      {/*       <header className="header">
        <button
          className="hamburger-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          &#9776;
        </button>
        <h1>Teacher Dashboard</h1>
      </header>
 */}
      <div>
        <Navbar />
        <button
          className="hamburger-menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          &#9776;
        </button>
      </div>
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
