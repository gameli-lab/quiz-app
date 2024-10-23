// Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import "./layout.css";
import Navbar from "./navbar";

const Layout = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("userRole");

  return (
    <div className="layout">
      {/* <Navbar isLoggedIn={isLoggedIn} role={role} /> */}
      <Navbar />

      <main className="main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
