import React from 'react';
import './role.css';
import { useNavigate } from 'react-router-dom';
import NavBar from './navbar';


const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    // Redirect to signup page with the selected role
    navigate(`/signup?role=${role}`);
  };

  return (
    
    <div className="role-selection">
      {/* Add NavBar component */}
      <NavBar />

      <h2>Select Your Role</h2>
      <div className="role-cards">
        <div
          className="role-card student-card"
          onClick={() => handleSelection('student')}
        >
          <h3>Student</h3>
          <p>Join as a student to take quizzes and track your progress.</p>
        </div>
        <div
          className="role-card teacher-card"
          onClick={() => handleSelection('teacher')}
        >
          <h3>Teacher</h3>
          <p>Join as a teacher to create quizzes and monitor students' performance.</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
