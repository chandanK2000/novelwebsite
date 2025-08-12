import React from 'react';
import './MegaMenuWhoWeAre.css'
import { Link } from 'react-router-dom';

const MegaMenuWhoWeAre = () => {
    return (
        <div className="dropdown-menu mega-menu" aria-labelledby="solutionsDropdown">
            <div className="mega-container">
                <div className="mega-block">
                    <h6 className="mega-title">Services</h6>
                    <p className="mega-description">Explore our diverse portfolio – built to help organizations thrive in the digital age. From advanced cloud systems to AI-driven solutions, DataNovel delivers scalable, secure, and intelligent technologies tailored to meet the growing demands of every industry.</p>
                    <button>Learn More &rarr;	</button>
                </div>
                <div className="mega-block">
                    <h6 className="mega-title">Our Company</h6>
                    <ul className="mega-list list-unstyled">
                        {/* <li><a className="dropdown-item" href="/"></a></li> */}

                        {/* Industries with submenu */}
                        <li className="dropdown-submenu position-relative">
                            <Link className="dropdown-item dropdown-toggle" to="#" data-bs-toggle="dropdown">
                                Industries
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="#">Software</Link></li>
                                <li><Link className="dropdown-item" to="#">Healthcare</Link></li>
                                <li><Link className="dropdown-item" to="#">Finance</Link></li>
                                <li><Link className="dropdown-item" to="#">E-commerce</Link></li>
                                <li><Link className="dropdown-item" to="#">Education</Link></li>
                            </ul>
                        </li>

                        <li><Link className="dropdown-item" to="/casestudies">Case Studies</Link></li>
                        <li><Link className="dropdown-item" to="/awardsandevents">Awards & Events</Link></li>
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

export default MegaMenuWhoWeAre;
