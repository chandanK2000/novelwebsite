import React from 'react';
import './MegaMenuSolutions.css';
import { Link } from 'react-router-dom';

const MegaMenuSolutions = ({ closeMenus }) => {
  return (
    <div className="dropdown-menu mega-menu show" aria-labelledby="solutionsDropdown">
      <div className="mega-container">
        <div className="mega-block">
          <h6 className="mega-title">Services</h6>
          <p className="mega-description">
            Explore our diverse portfolio – built to help organizations thrive in the digital age...
          </p>
          <button onClick={closeMenus}>Learn More &rarr;</button>
        </div>

        <div className="mega-block">
          <h6 className="mega-title">Technologies</h6>
          <ul className="mega-list list-unstyled">
            <li><Link to="/data-architecture" onClick={closeMenus}>Data Architecture</Link></li>
            <li><Link to="/data-engineering" onClick={closeMenus}>Data Engineering</Link></li>
            <li><Link to="/data-visualization" onClick={closeMenus}>Data Visualization</Link></li>
            <li><Link to="/ai" onClick={closeMenus}>AI</Link></li>
            <li><Link to="/dataQuality" onClick={closeMenus}>Data Quality</Link></li>
            <li><Link to="/data-migration" onClick={closeMenus}>Data Migration</Link></li>
          </ul>
        </div>

        <div className="mega-block">
          <h6 className="mega-title">More Info</h6>
          <p className="mega-description">Additional information or calls to action can go here.</p>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuSolutions;
