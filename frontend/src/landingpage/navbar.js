import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "./logo.jpg";
import { handleLogout } from "./logout";
import "./css/homepage.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setRole(localStorage.getItem("userRole"));
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setRole(localStorage.getItem("userRole"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="branding">
        <Link to="/">
          <img src={logo} alt="Quiz App Logo" className="logo" />
        </Link>
        <h1>QuizMaster</h1>
      </div>
      <nav>
        {!isLoggedIn ? (
          <>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/#about"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              About
            </NavLink>
            <NavLink
              to="/role"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Sign Up
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Sign In
            </NavLink>
          </>
        ) : (
          <>
            {role && (
              <NavLink
                to={`/${role}/dashboard`}
                className={({ isActive }) => (isActive ? "navlink-active" : "")}
              >
                Dashboard
              </NavLink>
            )}
            <button
              onClick={() => handleLogout(navigate)}
              className="logout-button"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
