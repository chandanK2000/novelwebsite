import React from 'react';
import './AboutUs.css';
import AboutBanner from './aboutbanner/AboutBanner';
import DatanovelVision from './datanovelvision/DatanovelVision';
import DataNovelLeadership from './dataNovelLeadership/DataNovelLeadership';

const AboutUs = () => {
  return (
      <div className="about-us-container">
        <AboutBanner/>
        <DatanovelVision/>
        <DataNovelLeadership/>
      </div>
  );
};

export default AboutUs;
