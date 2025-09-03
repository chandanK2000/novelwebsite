import React from 'react'
import './AboutBanner.css'
import databaseimage from '../../../../assets/images/databaseImage.png';

const AboutBanner = () => {
  return (
       <section className="about-us-section">
      <div className="about-us-content">
        
        {/* Left Side */}
        <div className="about-us-left">
          <h2>About DataNovel</h2>
          <p>Powerful. Ingenious. Trustworthy.</p>
          <button className="about-us-button">See How It Works</button>
        </div>

        {/* Right Side */}
        <div className="about-us-right">
          <img
            src={databaseimage}
            alt="About DataNovel"
            className="about-us-image"
          />
        </div>
      </div>
    </section>
  )
}

export default AboutBanner;
