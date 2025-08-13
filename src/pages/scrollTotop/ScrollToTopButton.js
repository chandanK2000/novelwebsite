import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css'; // Keep all styling here
import {  FaLinkedinIn, FaYoutube,FaTwitter, FaWhatsapp} from 'react-icons/fa';

// FaFacebookF, FaInstagram,
const ScrollElements = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isVisible && (
        <>
          <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
            ↑
          </button>


        </>
      )}
      <div className="social-iconsscroll">
        {/* <a href="#"><FaInstagram /></a> */}
        <a href="https://www.linkedin.com/company/datanoveltech/" target='_blank'><FaLinkedinIn /></a>
        {/* <a href="#"><FaFacebookF /></a> */}
        <a href="https://www.youtube.com/" target='_blank'><FaYoutube /></a>
        <a href="https://x.com/" target='_blank'><FaTwitter /></a>

        
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>
      </div>
    </>
  );
};

export default ScrollElements;
