import React from 'react';
import './teacher-dashboard.css';

const Sidebar = ({ setActiveSection }) => {
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => setActiveSection('createQuiz')}>Create Quiz</li>
        <li onClick={() => setActiveSection('manageQuizzes')}>Manage Quizzes</li>
        <li onClick={() => setActiveSection('viewResults')}>View Results</li>
      </ul>
    </div>
  );
};

export default Sidebar;
