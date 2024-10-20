import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout'; 
import Home from './home';
import RoleSelection from './role';
import Signup from './signup';
import Login from './login';
import AdminDashboard from './admin/AdminDashboard';
import TeacherDashboard from './teacher/TeacherDashboard';
import StudentDashboard from './student/StudentDashboard';

const Routter = () => {
  return (
    <Routes>
      {/* Wrap all routes with the Layout */}
      <Route path="/" element={<Layout />}>
        {/* Define all the individual routes inside Layout */}
        <Route index element={<Home />} />
        <Route path="role" element={<RoleSelection />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="teacher" element={<TeacherDashboard />} />
        <Route path="student" element={<StudentDashboard />} />
      </Route>
    </Routes>
  );
};

export default Routter;
