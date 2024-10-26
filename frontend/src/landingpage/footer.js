// Footer.js
import React from 'react';
import './css/homepage.css'; 

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <ul>
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
        <p>© 2024 QuizMaster. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
