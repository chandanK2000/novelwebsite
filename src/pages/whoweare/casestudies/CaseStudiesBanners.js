import React from 'react';
import './CaseStudiesBanners.css';
import casestudies from '../../../assets/images/casestudies1.webp';

const CaseStudiesBanners = () => {
  return (
    <section 
      className='case-studies-banners-section'
      style={{ backgroundImage: `url(${casestudies})` }}
    >
      <div className="content">
        <h2>Case Studies</h2>
        <h3>Real-world impact through smart data solutions</h3>
        <p>
          Discover how DataNovel transforms complex data challenges into measurable results. 
          Our case studies highlight tailored solutions that improved performance, unlocked insights, 
          and helped clients achieve strategic growth.
        </p>
      </div>
    </section>
  );
}

export default CaseStudiesBanners;
