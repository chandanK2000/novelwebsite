import React from 'react';
import './PageNotFoundPage.css';
import { Link } from 'react-router-dom';  // If you want to link back to the home page
import imagenogfound from '../assets/images/pagenotfound.jpg'
const PageNotFound = () => {
    return (
        <div className="not-found">
            <h2>404 - Page Not Found</h2>
            <p>Oops! The page you're looking for doesn't exist.</p>
            {/* Link to the homepage */}
            <Link to="/" className="home-link">Go back to the homepage</Link>
            {/* Optional image */}
            <img src={imagenogfound} alt="page not found"/>
        </div>
    );
};

export default PageNotFound;
