import React, { useEffect, useRef } from 'react';
import './Header.css';
import logo from '../../assets/images/companyLogo.png';
import MegaMenuSolutions from '../MegaMenu/megamenuSolutions/MegaMenuSolutions';
import MegaMenuWhoWeAre from '../MegaMenu/megawhoweAre/MegaMenuWhoWeAre';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // 🔸 Close sidebar when clicking outside (on small devices)
  useEffect(() => {
    const clearDropdowns = () => {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });

      document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    };

    // Close dropdowns on initial load
    clearDropdowns();

    // Close dropdowns on resize
    const handleResize = () => clearDropdowns();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const handleOutsideClick = (event) => {
      const sidebar = document.querySelector('.navbar-collapse.show');
      const toggler = document.querySelector('.navbar-toggler');
      const nav = document.getElementById('mainNav');

      // If sidebar is open, and click is outside the sidebar AND not on the toggler
      if (
        sidebar &&
        nav &&
        !nav.contains(event.target) &&
        !toggler.contains(event.target)
      ) {
        sidebar.classList.remove('show');

        // Also close dropdowns if any
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
          menu.classList.remove('show');
        });

        document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // 🔸 Helper to close mega menus + sidebar
  const closeMenus = () => {
    // Close dropdown menus
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });

    // Reset aria-expanded
    document.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
    });

    // Close mobile sidebar
    const sidebar = document.querySelector('.navbar-collapse');
    if (sidebar && sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
    }
  };

  const Contactus = () => {
    navigate('/contactus');
    closeMenus(); // optional: close sidebar if on mobile
  };

  const RegisterNow = () => {
    alert("Will register soon...");
    closeMenus(); // optional: close sidebar if on mobile
  };

  return (
    <div className="header-container fixed-top">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Brand */}
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
          <div className="collapse navbar-collapse" id="mainNav" ref={sidebarRef}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* Solutions Dropdown */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="solutionsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Services
                </a>
                <MegaMenuSolutions closeMenus={closeMenus} />
              </li>

              {/* Who We Are Dropdown */}
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
                <MegaMenuWhoWeAre closeMenus={closeMenus} />
              </li>

              {/* Products */}
              {/* <li className="nav-item">
                <Link className="nav-link" to="/products" onClick={closeMenus}>Solutions</Link>
              </li> */}

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="blogsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Solutions
                </a>
                <ul className="dropdown-menu" aria-labelledby="blogsDropdown">
                  <li><a className="dropdown-item" href="#" onClick={closeMenus}>Data Quality</a></li>
                  <li><a className="dropdown-item" href="#" onClick={closeMenus}>Data Migration</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#" onClick={closeMenus}>Video Analytics</a></li>
                </ul>
              </li>


              {/* Blogs */}
              {/* <li className="nav-item dropdown">
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
                  <li><a className="dropdown-item" href="#" onClick={closeMenus}>Action</a></li>
                  <li><a className="dropdown-item" href="#" onClick={closeMenus}>Another action</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#" onClick={closeMenus}>Something else</a></li>
                </ul>
              </li> */}

              {/* Blogs - Single Link */}
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/blogs"
                  onClick={closeMenus}
                >
                  Blogs
                </Link>
              </li>


              {/* Contact Us / Register */}
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
