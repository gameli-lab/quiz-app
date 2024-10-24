import { NavLink, Link } from "react-router-dom";
import logo from "./logo.jpg";
import "./homepage.css";

const Navbar = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Ensure boolean value
  const role = localStorage.getItem("userRole");

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
          // Links for non-logged in users
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
              to="/logout"
              className={({ isActive }) => (isActive ? "navlink-active" : "")}
            >
              Sign In
            </NavLink>
          </>
        ) : (
          // Links for logged-in users based on their role
          <>
            {role && (
              <NavLink
                to={`/${role}/dashboard`}
                className={({ isActive }) => (isActive ? "navlink-active" : "")}
              >
                Dashboard
              </NavLink>
            )}
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
