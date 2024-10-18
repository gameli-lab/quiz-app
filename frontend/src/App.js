import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Homepage';
import RoleSelection from './role';
import Signup from './signup';
import Login from './login';
import AdminDashboard from './admin/AdminDashboard'; // Assuming you have this component
import TeacherDashboard from './teacher/TeacherDashboard'; // Assuming you have this component
import StudentDashboard from './student/StudentDashboard'; // Assuming you have this component

const App = () => {
  return (
    <Routes>
      {/* Home route */}
      <Route path="/" element={<HomePage />} />

      {/* Role selection route */}
      <Route path="/role" element={<RoleSelection />} />
      
      {/* Signup route */}
      <Route path="/signup" element={<Signup />} />

      {/* Login route */}
      <Route path="/login" element={<Login />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Teacher Dashboard */}
      <Route path="/teacher" element={<TeacherDashboard />} />

      {/* Student Dashboard */}
      <Route path="/student" element={<StudentDashboard />} />

    </Routes>
  );
}

export default App;
