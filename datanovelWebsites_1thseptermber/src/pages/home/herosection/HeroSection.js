import React from 'react';
import './HeroSection.css';
import heroImage from '../../assets/images/Illustration.png';

const HeroSection = () => {
  return (
    <div className="hero-container">
      {/* Left Side */}
      <div className="hero-left">
        <h1 className="hero-heading">Empower Your Data <br />Journey</h1>
        <p className="hero-subtext">
          Discover the future of Data Engineering <br />and AI with us
        </p>
        <button className="hero-button">Register</button>

      </div>


      {/* Right Side */}
      <div className="hero-right">
        <img alt="Hero Graphic" src={heroImage} className="hero-image" />
      </div>
    </div>
  );
};

export default HeroSection;
