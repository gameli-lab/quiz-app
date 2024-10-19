// HomePage.js
import React from 'react';
import Header from './header';
// import Main from './Main';
import Footer from './footer';
import './homepage.css';
import Home from './home';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default HomePage;
