import React from 'react';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* <div className="footer-socials">
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon facebook"
        >
          <i className="fab fa-facebook-square"></i>
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon twitter"
        >
          <i className="fab fa-twitter-square"></i>
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon linkedin"
        >
          <i className="fab fa-linkedin"></i>
        </a>
      </div> */}

      <div className="footer-bottom">
        <p>&copy; 2025 Wipro Kawasaki Precision Machinery Pvt Ltd</p>
      </div>
    </footer>
  );
};

export default Footer;
