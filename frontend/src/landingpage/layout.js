// Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer";
import "./css/layout.css";
import Navbar from "./navbar";

const Layout = () => {
 
  return (
    <div className="layout">
      { <Navbar /> }
  

      <main className="main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
