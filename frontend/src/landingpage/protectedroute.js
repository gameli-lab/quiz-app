/* import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return isLoggedIn === "true" ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
 */

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // If logged in but doesn't have the required role, redirect to home or an unauthorized page
    return <Navigate to="/" />;
  }

  // If logged in and has the correct role, render the protected component(s)
  return <Outlet />;
};

export default ProtectedRoute;
