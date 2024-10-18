import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import CreateQuizSection from './CreateQuizSection';
import ManageQuizzesSection from './ManageQuizzesSection';
import ViewResultsSection from './ViewResultsSection';
// import './teacher-dashboard.css';

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState('createQuiz'); // Default section

  const renderSection = () => {
    switch (activeSection) {
      case 'createQuiz':
        return <CreateQuizSection />;
      case 'manageQuizzes':
        return <ManageQuizzesSection />;
      case 'viewResults':
        return <ViewResultsSection />;
      default:
        return <CreateQuizSection />;
    }
  };

  return (
    <div className="teacher-dashboard">
      <Header />
      <div className="dashboard-container">
        <Sidebar setActiveSection={setActiveSection} />
        <div className="dashboard-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
