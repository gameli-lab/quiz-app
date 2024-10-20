import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Routter from './router'; // Use a common App component for routes
// import HomePage from './Homepage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routter />
     {/* <HomePage /> */}
     </Router>


  </React.StrictMode>
);
