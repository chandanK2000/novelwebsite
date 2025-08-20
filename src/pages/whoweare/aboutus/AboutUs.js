import React from 'react';
import './AboutUs.css';
import AboutBanner from './aboutbanner/AboutBanner';
import DatanovelVision from './datanovelvision/DatanovelVision';
import DataNovelLeadership from './dataNovelLeadership/DataNovelLeadership';
import DataNovelInvation from './datanovelInovation/DataNovelInvation';
import OurPartners from './ourPartners/OurPartners';
import ConnectOurExperts from './connectOurExperts/ConnectOurExperts';

const AboutUs = () => {
  return (
      <div className="about-us-container">
        <AboutBanner/>
        <DatanovelVision/>
        <DataNovelLeadership/>
        <DataNovelInvation/>
        <OurPartners/>
        <ConnectOurExperts/>
      </div>
  );
};

export default AboutUs;
