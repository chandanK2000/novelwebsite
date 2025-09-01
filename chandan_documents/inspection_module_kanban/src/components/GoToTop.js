import React, { useState, useEffect } from 'react';
import './GoToTop.css'; 
const GoToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const checkScrollTop = () => {
        if (!isVisible && window.pageYOffset > 100) {
            setIsVisible(true);
        } else if (isVisible && window.pageYOffset <= 100) {
            setIsVisible(false);
        }
    };

    // Scroll to top when the button is clicked
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Adding scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop);
        return () => {
            window.removeEventListener('scroll', checkScrollTop);
        };
    });

    return (
        <div
            className={`go-to-top ${isVisible ? 'show' : ''}`}
            onClick={scrollToTop}
        >
            ↑
        </div>
    );
};

export default GoToTop;
