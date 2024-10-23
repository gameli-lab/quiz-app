import { NavLink, Link } from "react-router-dom";
import logo from "./logo.jpg";
import "./homepage.css";

const Navbar = ({ isLoggedIn, role }) => {
  return (
    <div className="navbar">
      <div className="branding">
        <Link to="/">
          <img src={logo} alt="Quiz App Logo" className="logo" />
        </Link>
        <h1>QuizMaster</h1>
      </div>
      <nav>
        {!isLoggedIn && (
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
        )}

        {isLoggedIn && role === "admin" && (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Logout
            </NavLink>
          </>
        )}

        {isLoggedIn && role === "teacher" && (
          <>
            <NavLink
              to="/teacher/dashboard"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Logout
            </NavLink>
          </>
        )}
        {isLoggedIn && role === "student" && (
          <>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Logout
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
