import React, { useEffect, useState } from 'react';
import './TopScrollIndicator.css';

const TopScrollIndicator = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrolled / height) * 100;
    setScrollWidth(scrollPercent);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="top-scroll-indicator">
      <div className="top-scroll-bar" style={{ width: `${scrollWidth}%` }}></div>
    </div>
  );
};

export default TopScrollIndicator;
