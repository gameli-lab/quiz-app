/* import React, { useState } from "react";
import UserManagement from "./UserManagement";
import QuizManagement from "./QuizManagement";
import Analytics from "./Analytics";
import SystemSettings from "./SystemSettings";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("userManagement");

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

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
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
      <main className="dashboard-content">{renderActiveTab()}</main>
    </div>
  );
};

export default AdminDashboard;
 */

import React, { useState } from "react";
import UserManagement from "./UserManagement";
import QuizManagement from "./QuizManagement";
import Analytics from "./Analytics";
import SystemSettings from "./SystemSettings";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("userManagement");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="admin-dashboard">
      {/* Hamburger Icon */}
      <div
        className="hamburger-icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        &#9776; {/* Unicode for hamburger icon */}
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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

      {/* Main Content */}
      <main className="dashboard-content">{renderActiveTab()}</main>
    </div>
  );
};

export default AdminDashboard;
