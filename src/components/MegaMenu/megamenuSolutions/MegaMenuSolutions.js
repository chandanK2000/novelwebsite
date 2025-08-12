import React from 'react';
import './MegaMenuSolutions.css';
import { Link } from 'react-router-dom';

const MegaMenuSolutions = () => {
    return (
        <div className="dropdown-menu mega-menu" aria-labelledby="solutionsDropdown">
            <div className="mega-container">
                <div className="mega-block">
                    <h6 className="mega-title">Services</h6>
                    <p className="mega-description">Explore our diverse portfolio – built to help organizations thrive in the digital age. From advanced cloud systems to AI-driven solutions, DataNovel delivers scalable, secure, and intelligent technologies tailored to meet the growing demands of every industry.</p>
                    <button>Learn More &rarr;	</button>
                </div>
                <div className="mega-block">
                    <h6 className="mega-title">Technologies</h6>
                    <ul className="mega-list list-unstyled">
                        <li><a href="/">Data Architecture</a></li>
                        <li><a href="#">Data Engineering</a></li>
                        <li><a href="#">Data Visualization</a></li>
                        <li><a href="#">AI</a></li>
                        <li><Link to="/dataQuality">Data Quality</Link></li>
                        <li><a href="#">Data Migration</a></li>
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
