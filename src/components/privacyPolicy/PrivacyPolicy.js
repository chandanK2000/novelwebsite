import React from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div style={{ marginTop: '80px' }}>
      {/* Banner Section */}
      <div className="privacy-banner d-flex flex-column justify-content-center align-items-center text-white text-center">
        <h1>Privacy Policy</h1>
        <p>
          <Link to="/" className="home-link">Home</Link> / Privacy Policy
        </p>
      </div>

      {/* Content Section */}
      <div className="container" style={{ marginTop: '60px', marginBottom: '60px' }}>
        <h2 className="mb-4">Privacy Policy</h2>
        <p>
          At <strong>DatanovelTech</strong>, we respect your privacy and are committed to
          protecting your personal information. This Privacy Policy explains how we
          collect, use, and safeguard your data when you interact with our website,
          products, and services.
        </p>

        <h4 className="mt-4">1. Information We Collect</h4>
        <ul>
          <li><strong>Personal Information:</strong> Name, email, phone, company name, and other details you provide voluntarily.</li>
          <li><strong>Usage Data:</strong> IP address, browser type, device info, and activity logs.</li>
          <li><strong>Cookies & Tracking:</strong> We may use cookies and similar technologies to improve user experience.</li>
        </ul>

        <h4 className="mt-4">2. How We Use Your Information</h4>
        <ul>
          <li>To provide and improve our services.</li>
          <li>To respond to inquiries or demo requests.</li>
          <li>To send updates, newsletters, or marketing communications (with consent).</li>
          <li>To prevent fraudulent activities and enhance security.</li>
        </ul>

        <h4 className="mt-4">3. Data Sharing & Disclosure</h4>
        <p>
          We do not sell or rent your personal information. We may share your data with:
        </p>
        <ul>
          <li>Trusted third-party service providers assisting in operations.</li>
          <li>Legal authorities, if required to comply with laws.</li>
        </ul>

        <h4 className="mt-4">4. Data Security</h4>
        <p>
          We use industry-standard security practices to protect your data.
          However, please note that no system is completely secure.
        </p>

        <h4 className="mt-4">5. Your Rights</h4>
        <ul>
          <li>Access or request a copy of your data.</li>
          <li>Request corrections or updates to your data.</li>
          <li>Request deletion of your personal information.</li>
          <li>Opt out of marketing communications.</li>
        </ul>

        <h4 className="mt-4">6. Cookies Policy</h4>
        <p>
          Our website may use cookies to improve user experience.
          You can disable cookies in your browser, but some features may not work properly.
        </p>

        <h4 className="mt-4">7. Updates to This Policy</h4>
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          reflected on this page with a revised "last updated" date.
        </p>

        <h4 className="mt-4">8. Contact Us</h4>
        <p>
          If you have any questions, please contact us:
        </p>
        <p>
          📧 <a href="mailto:support@datanoveltech.com">support@datanoveltech.com</a> <br />
          📞 +1 (234) 567-8900
        </p>

        <p className="text-muted mt-5">
          <em>Last updated: August 20, 2025</em>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
