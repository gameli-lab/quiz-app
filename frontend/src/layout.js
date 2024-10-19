// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import './layout.css';

const Layout = () => {
  return (
    <div className="layout">
      {/* Header stays on top */}
      <Header />

      {/* This is where the routed content will be rendered */}
      <main className='main'>
        <Outlet />
      </main>

      {/* Footer stays at the bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
