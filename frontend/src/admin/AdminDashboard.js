import React, { useState } from "react";
import UserManagement from "./UserManagement";
import QuizManagement from "./QuizManagement";
import Analytics from "./Analytics";
import SystemSettings from "./SystemSettings";
import "./AdminDashboard.css";

const AdminDashboard = () => {
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

  return (
    <div className="admin-dashboard">
      <div
        className={`hamburger-icon ${sidebarOpen ? "open" : ""}`}
        onClick={handleSidebarToggle}
      >
        {/* The icon changes based on the state */}
      </div>

      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        onClick={handleSidebarToggle}
      >
        <h2>Admin Dashboard</h2>
        <ul>
          <li onClick={() => setActiveTab("userManagement")}>
            User Management
          </li>
          <li onClick={() => setActiveTab("quizManagement")}>
            Quiz Management
          </li>
          <li onClick={() => setActiveTab("analytics")}>Analytics & Reports</li>
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
  );
};

export default AdminDashboard;
