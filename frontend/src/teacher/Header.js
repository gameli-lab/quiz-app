import React from "react";
import "./teacher-dashboard.css";

const Header = ({ toggleSidebar }) => {
  return (
    <div className="header">
      {/* Hamburger menu button for mobile view */}
      <button className="hamburger-menu" onClick={toggleSidebar}>
        &#9776;
      </button>
      <h1>Teacher Dashboard</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/logout">Logout</a>
      </nav>
    </div>
  );
};

export default Header;
