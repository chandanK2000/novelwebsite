import React from 'react';
import './TechnologiesWork.css';
import techimage1 from '../../../assets/images/techimage1.png'
import techimage2 from '../../../assets/images/techimage2.png'
import techimage3 from '../../../assets/images/techimage3.png'
import techimage4 from '../../../assets/images/techimage4.png'

const TechnologiesWork = () => {
  return (
    <section className="technologies-section">
      <div className="technologies-container">
        <h3 className="technologies-heading">Technologies We Work With</h3>
      </div>
      <div className="tech-image-row">
          <img src={techimage1} alt="techimage not found" />
          <img src={techimage2} alt="techimage not found" />
          <img src={techimage3} alt="techimage not found" />
          <img src={techimage4} alt="techimage not found" />
        </div>
    </section>
  );
};

export default TechnologiesWork;
