import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await fetch("http://localhost:5000/connect", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("isLoggedIn", true);

        // Redirect based on role
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.role === "teacher") {
          navigate("/teacher/dashboard");
        } else if (data.role === "student") {
          navigate("/student/dashboard");
        } else {
          setError("Unknown user role. Please contact support.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
