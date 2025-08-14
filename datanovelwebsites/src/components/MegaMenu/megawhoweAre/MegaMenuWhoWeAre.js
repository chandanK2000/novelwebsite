import React from 'react';
import './MegaMenuWhoWeAre.css';
import { Link } from 'react-router-dom';

const MegaMenuWhoWeAre = ({ closeMenus }) => {
  return (
    <div className="dropdown-menu mega-menu show" aria-labelledby="whoDropdown">
      <div className="mega-container">
        {/* Block 1 */}
        <div className="mega-block">
          <h6 className="mega-title">Services</h6>
          <p className="mega-description">
            Explore our diverse portfolio – built to help organizations thrive in the digital age.
          </p>
          <button onClick={closeMenus}>Learn More &rarr;</button>
        </div>

        {/* Block 2 */}
        <div className="mega-block">
          <h6 className="mega-title">Our Company</h6>
          <ul className="mega-list list-unstyled">
            {/* Industries submenu */}
            <li className="dropdown-submenu position-relative">
              <Link className="dropdown-item dropdown-toggle" to="#" data-bs-toggle="dropdown">
                Industries
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/industries/software" onClick={closeMenus}>Software</Link></li>
                <li><Link className="dropdown-item" to="/industries/healthcare" onClick={closeMenus}>Healthcare</Link></li>
                <li><Link className="dropdown-item" to="/industries/finance" onClick={closeMenus}>Finance</Link></li>
                <li><Link className="dropdown-item" to="/industries/ecommerce" onClick={closeMenus}>E-commerce</Link></li>
                <li><Link className="dropdown-item" to="/industries/education" onClick={closeMenus}>Education</Link></li>
              </ul>
            </li>

            {/* Main links */}
            <li><Link className="dropdown-item" to="/casestudies" onClick={closeMenus}>Case Studies</Link></li>
            <li><Link className="dropdown-item" to="/awardsandevents" onClick={closeMenus}>Awards & Events</Link></li>
          </ul>
        </div>

        {/* Block 3 */}
        <div className="mega-block">
          <h6 className="mega-title">More Info</h6>
          <p className="mega-description">Additional information or calls to action can go here.</p>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuWhoWeAre;
