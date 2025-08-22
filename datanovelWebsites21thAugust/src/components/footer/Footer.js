import React, { use } from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaPaperPlane } from 'react-icons/fa';
import logo from '../../assets/images/companyLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
const Footer = () => {
  const navigate = useNavigate();

  function scrollToTop(duration = 1000) {
    const start = window.scrollY;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  const Homepage = () => {
    navigate('/');
    // window.scrollTo(0, 0);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });


  }

  const ContactusPage = () => {
    navigate('/contactus');
    // window.scrollTo(0, 0);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  return (
    <footer className="footer">
      {/* Newsletter Banner */}
      <div className="footer-newsletter">
        <div className="newsletter-content">
          <button className="contact-btn" onClick={ContactusPage} >Contact Us</button>
          <h3>Newsletter</h3>
          <p>Keep up with our latest news and events. Subscribe to our newsletter.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Main Block */}
      <div className="footer-block">
        {/* Brand + Social */}
        <div className="footer-brand" onClick={Homepage}>
          <img src={logo} alt="DatanovelTech Logo" height={80} width={20} />
          {/* <p className="brand-name">DatanovelTech</p> */}
          <p>Copyright © 2020 Landify UI Kit.</p>
          <p>All rights reserved</p>
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            {/* <a href="#"><FaLinkedinIn /></a> */}
            <a href="https://www.linkedin.com/company/datanoveltech/" target='_blank'><FaLinkedinIn /></a>

            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Company Links */}
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/contactus">Contact Us</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            {/* <li><Link to="/pricing">Pricing</Link></li> */}
            {/* <li><Link to="/#"></Link></li> */}
            <li><HashLink smooth to="/#testimonial">Testimonials</HashLink></li>



          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><Link to="/faqs">Faq</Link></li>
            {/* <li><a href="#">Terms of Service</a></li> */}
            {/* <li><a href="#">Legal</a></li> */}
            <li> <Link to="/privacypolicy">Privacy Policy</Link></li>
            {/* <li><a href="#">Status</a></li> */}
          </ul>
        </div>

        {/* Subscribe Again with Send Icon */}
        <div className="footer-subscribe">
          <h4>Stay Up to Date</h4>
          <form>
            <div className="subscribe-input-wrapper">
              <input type="email" placeholder="Your email address" required />
              <button type="submit" aria-label="Send">
                <FaPaperPlane className='faplane' />
              </button>
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
