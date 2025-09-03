import React from 'react';
import './Keycapabilities.css';
import checkboxes from '../../../assets/icons/Checkboxes.png';
import frame253 from '../../../assets/images/Frame 253.png';
import frame252 from '../../../assets/images/Frame 252.png';
import frame251 from '../../../assets/images/Frame 251.png';

const Keycapabilities = () => {
  return (
    <section className="keycapabilities_section">
      <div className="keycapabilities_container">
        {/* Left side (Frames) */}
        <div className="keycapabilities_left">
          <div className="frame_box">
            <img src={frame253} alt="Key Capabilities" />
          </div>
          <div className="frame_column">
              <img src={frame252} alt="Key Capabilities" />
              <img src={frame251} alt="Key Capabilities" />
          </div>
        </div>

        {/* Right side (Content) */}
        <div className="keycapabilities_right">
          <div className="keycapabilities_text">
            <h2>Key Capabilities That Define DataNovel</h2>
            <p>
              DataNovel is a forward-thinking digital solutions company that
              empowers businesses through innovative web development,
              intuitive design, and intelligent technology. By combining modern
              frameworks, scalable infrastructure, and a user-first approach.
            </p>
          </div>

          <div className="keycapabilities_list">
            <div className="capability_item">
              <img src={checkboxes} alt="Custom-Built Platforms" />
              <p>
                <span className="bold">Custom-Built Platforms</span> : We create fully customized websites and applications tailored to your brand, goals, and workflows—ensuring every element reflects your vision.
              </p>
            </div>
            <div className="capability_item">
              <img src={checkboxes} alt="Scalable Solutions" />
              <p>
                <span className="bold">AI-Enhanced Functionality</span> : Build solutions that grow with your business and adapt seamlessly to future needs.
              </p>
            </div>
            <div className="capability_item">
              <img src={checkboxes} alt="User-Centric Design" />
              <p>
                <span className="bold">Responsive, Cross-Device Design </span> :  Our products are built to perform flawlessly on any device—desktop, tablet, or mobile—ensuring a seamless user experience everywhere.

              </p>
            </div>
            <div className="capability_item">
              <img src={checkboxes} alt="AI-Driven Insights" />
              <p>
                <span className="bold">Performance-Optimized Code </span> : We prioritize speed, stability, and scalability—so your digital platform can grow with your business, not against it. giving you peace
              </p>
            </div>
                <div className="capability_item">
              <img src={checkboxes} alt="AI-Driven Insights" />
              <p>
                <span className="bold">Secure & Scalable Architecture </span> : : From user authentication to data privacy, our systems are built with security and scalability in mind, giving you peace of mind and room to expand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Keycapabilities;
