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

        {/* <div className="mega-block">
          <h6 className="mega-title">Technologies</h6>
          <ul className="mega-list list-unstyled">
            <li><Link to="/dataarchitecture" onClick={closeMenus}>Data Architecture</Link></li>
            <li><Link to="/dataengineering" onClick={closeMenus}>Data Engineering</Link></li>
            <li><Link to="/data-visualization" onClick={closeMenus}>Data Visualization</Link></li>
            <li><Link to="/ai" onClick={closeMenus}>AI</Link></li>
            <li><Link to="/dataQuality" onClick={closeMenus}>Data Quality</Link></li>
            <li><Link to="/data-migration" onClick={closeMenus}>Data Migration</Link></li>
          </ul>
        </div> */}
        <div className="mega-block">
  <h6 className="mega-title">Technologies</h6>
  <ul className="mega-list list-unstyled">

    {/* Enterprise submenu */}
    <li className="dropdown-submenu position-relative">
      <Link className="dropdown-item dropdown-toggle" to="#" data-bs-toggle="dropdown">
        Enterprise
      </Link>
      <ul className="dropdown-menu">
        <li><Link className="dropdown-item" to="/digital-transformation" onClick={closeMenus}>Digital Transformation</Link></li>
        <li><Link className="dropdown-item" to="/application-development" onClick={closeMenus}>Application Development and Management</Link></li>
        <li><Link className="dropdown-item" to="/package-implementation" onClick={closeMenus}>Package Implementation</Link></li>
        <li><Link className="dropdown-item" to="/cloud" onClick={closeMenus}>Cloud</Link></li>
      </ul>
    </li>

    {/* AI submenu */}
    <li className="dropdown-submenu position-relative">
      <Link className="dropdown-item dropdown-toggle" to="#" data-bs-toggle="dropdown">
        AI
      </Link>
      <ul className="dropdown-menu">
        <li><Link className="dropdown-item" to="/generative-ai" onClick={closeMenus}>Generative AI</Link></li>
        <li><Link className="dropdown-item" to="/agentic-ai" onClick={closeMenus}>Agentic AI</Link></li>
        <li><Link className="dropdown-item" to="/nlp" onClick={closeMenus}>NLP</Link></li>
        <li><Link className="dropdown-item" to="/computer-vision" onClick={closeMenus}>Computer Vision</Link></li>
      </ul>
    </li>

    {/* Data Management submenu */}
    <li className="dropdown-submenu position-relative">
      <Link className="dropdown-item dropdown-toggle" to="#" data-bs-toggle="dropdown">
        Data Management
      </Link>
      <ul className="dropdown-menu">
        <li><Link className="dropdown-item" to="/data-architecture" onClick={closeMenus}>Data Architecture</Link></li>
        <li><Link className="dropdown-item" to="/data-engineering" onClick={closeMenus}>Data Engineering</Link></li>
        <li><Link className="dropdown-item" to="/data-visualization" onClick={closeMenus}>Data Visualization</Link></li>
        <li><Link className="dropdown-item" to="/data-governance" onClick={closeMenus}>Data Governance</Link></li>
      </ul>
    </li>

    {/* Cyber Security submenu */}
    <li className="dropdown-submenu position-relative">
      <Link className="dropdown-item dropdown-toggle" to="#" data-bs-toggle="dropdown">
        Cyber Security
      </Link>
      <ul className="dropdown-menu">
        <li><Link className="dropdown-item" to="/identity-access-management" onClick={closeMenus}>Identity & Access Management</Link></li>
        <li><Link className="dropdown-item" to="/data-privacy-security" onClick={closeMenus}>Data Privacy & Security</Link></li>
        <li><Link className="dropdown-item" to="/application-security" onClick={closeMenus}>Application Security</Link></li>
        <li><Link className="dropdown-item" to="/risk-compliance" onClick={closeMenus}>Risk & Compliance Management</Link></li>
      </ul>
    </li>

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
