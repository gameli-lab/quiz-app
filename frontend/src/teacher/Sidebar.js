import React from "react";
import "./teacher-dashboard.css";

const Sidebar = ({ setActiveSection, isOpen, toggleSidebar }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        ×
      </button>
      <ul>
        <li onClick={() => setActiveSection("createQuiz")}>Create Quiz</li>
        <li onClick={() => setActiveSection("manageQuizzes")}>
          Manage Quizzes
        </li>
        <li onClick={() => setActiveSection("viewResults")}>View Results</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
