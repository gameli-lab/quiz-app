import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Home from "./home";
import RoleSelection from "./role";
import Signup from "./signup";
import Login from "./login";
import AdminDashboard from "./admin/AdminDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import StudentDashboard from "./student/StudentDashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="role" element={<RoleSelection />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
