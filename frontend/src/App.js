/* import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./landingpage/layout";
import Home from "./landingpage/home";
import RoleSelection from "./landingpage/role";
import Signup from "./landingpage/signup";
import Login from "./landingpage/login";
import AdminDashboard from "./admin/AdminDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import StudentDashboard from "./student/StudentDashboard";
import ProtectedRoute from "./landingpage/protectedroute";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="role" element={<RoleSelection />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected Routes *}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="teacher" />}>
          <Route path="teacher/dashboard" element={<TeacherDashboard />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
 */

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./landingpage/layout";
import Home from "./landingpage/home";
import RoleSelection from "./landingpage/role";
import Signup from "./landingpage/signup";
import Login from "./landingpage/login";
import AdminDashboard from "./admin/AdminDashboard";
import TeacherDashboard from "./teacher/TeacherDashboard";
import StudentDashboard from "./student/StudentDashboard";
import QuizSection from "./student/QuizSection";
import QuizPage from "./quizpage";
import ProtectedRoute from "./landingpage/protectedroute";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="role" element={<RoleSelection />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="teacher" />}>
          <Route path="teacher/dashboard" element={<TeacherDashboard />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="student/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* Quiz Routes */}
        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="quizzes" element={<QuizSection />} />{" "}
          <Route path="quizzes/:subjectId" element={<QuizPage />} />{" "}
        </Route>
      </Routes>
    </>
  );
};

export default App;
