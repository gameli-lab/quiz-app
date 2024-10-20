import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
// import Routter from './router'; // Use a common App component for routes
import Home from './home';
import Header from './header';
import Footer from './footer';
// import Layout from './layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      {/* <Layout /> */}
     <Header />
     <Home />
     <Footer />
     {/* <Routter /> */}
     </Router>


  </React.StrictMode>
);
