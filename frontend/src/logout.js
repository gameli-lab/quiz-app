import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await fetch("http://localhost:5000/disconnect", {
          method: "POST",
          headers: {
            "x-token": token
          }
        });
        // Remove token and user role from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");

        // Redirect to login page
        navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error);
        // Optionally handle any logout errors
      }
    } else {
      // If no token is found, just redirect to login
      navigate("/login");
    }
  };

  return (
    <div>
      {/* Your component JSX here */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
