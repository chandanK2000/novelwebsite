import React, { useEffect } from 'react';
import './Header.css';
import logo from '../../assets/images/companyLogo.png';
import MegaMenuSolutions from '../MegaMenu/megamenuSolutions/MegaMenuSolutions';
import MegaMenuWhoWeAre from '../MegaMenu/megawhoweAre/MegaMenuWhoWeAre';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Header = () => {

  useEffect(() => {
  const handleLinkClick = (e) => {
    const linkClicked = e.target.closest('a, .dropdown-item, .nav-link, .register_button');

    if (linkClicked) {
      const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
      openDropdowns.forEach((menu) => {
        menu.classList.remove('show');
      });

      // Also close parent dropdown toggles
      const toggles = document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]');
      toggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  };

  document.addEventListener('click', handleLinkClick);

  return () => {
    document.removeEventListener('click', handleLinkClick);
  };
}, []);


  const navigate=useNavigate();

  const Contactus=()=>{
    // alert("hello");
    navigate('/contactus');

  }

  const RegisterNow=()=>{
    alert("will register soon....");
  }
  return (
    <div className="header-container fixed-top">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Brand  */}
          <a className="navbar-brand d-flex align-items-center" href="#">
            <img src={logo} alt="Company Logo" height="50" width="80" />
            <span className="ms-2 fw-bold">DatanovelTech</span>
          </a>

          {/* Mobile toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav links */}
          <div className="collapse navbar-collapse" id="mainNav">
            {/* ms-auto pushes nav items to the right */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="solutionsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Solutions
                </a>
                <MegaMenuSolutions />
              </li>



              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="whoDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Who&nbsp;We&nbsp;Are
                </a>
                <MegaMenuWhoWeAre />
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Products</Link>
              </li>


              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="blogsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Blogs
                </a>
                <ul className="dropdown-menu" aria-labelledby="blogsDropdown">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Something else</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <button className='register_button' onClick={Contactus}>Contact Us</button>
              </li>
              <li>
                <button className='register_button' onClick={RegisterNow}>Register Now</button>
              </li>
            </ul>
          </div>
        </div>

      </nav>
    </div>
  );
};

export default Header;
