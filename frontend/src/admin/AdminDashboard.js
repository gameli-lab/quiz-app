import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate
import UserManagement from "./UserManagement";
import QuizManagement from "./QuizManagement";
import Analytics from "./Analytics";
import SystemSettings from "./SystemSettings";
import { handleLogout } from "../landingpage/logout";
import Footer from "../landingpage/footer";
import "./AdminDashboard.css";
import logo from "./logo.jpg";
import Navbar from "../landingpage/navbar";

const AdminDashboard = () => {
  const navigate = useNavigate(); // Get navigate function
  const [activeTab, setActiveTab] = useState("userManagement");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "userManagement":
        return <UserManagement />;
      case "quizManagement":
        return <QuizManagement />;
      case "analytics":
        return <Analytics />;
      case "systemSettings":
        return <SystemSettings />;
      default:
        return <UserManagement />;
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  /*   const handleLogoutClick = () => {
    handleLogout(navigate); // Pass navigate to handleLogout
  };

 */
  return (
    <div className="admin-layout">
      {/*       <header className="admin-header">
        <div className="header-logo">
          <img src={logo} alt="App Logo" />
          <h2>QuizMaster</h2>
        </div>
        <h1>Admin Dashboard</h1>
        <Navbar />
      </header>
 */}
      <Navbar />
      <div className="admin-dashboard">
        <div
          className={`hamburger-icon ${sidebarOpen ? "open" : ""}`}
          onClick={handleSidebarToggle}
        />

        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <h2>Admin Dashboard</h2>
          <ul>
            <li onClick={() => setActiveTab("userManagement")}>
              User Management
            </li>
            <li onClick={() => setActiveTab("quizManagement")}>
              Quiz Management
            </li>
            <li onClick={() => setActiveTab("analytics")}>
              Analytics & Reports
            </li>
            <li onClick={() => setActiveTab("systemSettings")}>
              System Settings
            </li>
          </ul>
        </aside>

        <main
          className="dashboard-content"
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          {renderActiveTab()}
        </main>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
