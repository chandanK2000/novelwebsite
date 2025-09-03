import React from 'react';
import './DigitalTransformation.css';
import broserUpdatedOutlined from '../../../../assets/icons/BrowserUpdatedOutlined.png';
import pricecCheckedOutlined from '../../../../assets/icons/PriceCheckOutlined.png';
import verifiedOutlined from '../../../../assets/icons/VerifiedOutlined.png';
import handshakeOutlined from '../../../../assets/icons/HandshakeOutlined.png';

const advantagesData = [
  {
    id: 1,
    icon: broserUpdatedOutlined,
    title: "Data-driven decision",
    description: "Leverage insights from gathered data to make more informed, impactful decisions that drive business success."
  },
  {
    id: 2,
    icon: verifiedOutlined,
    title: "High quality of the product",
    description: "Ensure high-quality outcomes by reducing human errors through automated and verified processes."
  },
  {
    id: 3,
    icon: handshakeOutlined,
    title: "Shorten project duration",
    description: "Empower teams to work together seamlessly with digital tools and enhanced workflow transparency."
  },
  {
    id: 4,
    icon: pricecCheckedOutlined,
    title: "Reducing cost",
    description: "Reduce operational costs and maximize ROI through optimized digital solutions and automation."
  },
];

const DigitalTransformation = () => {
  return (
    <section className='digital-transformation-section'>
      <div className='digital-transformation-container'>
        <h2 className="digital-title">Advantages of Digital Transformation</h2>
        <div className='digital-grid'>
          {advantagesData.map((item) => (
            <div className='digital-card' key={item.id}>
              <img src={item.icon} alt={item.title} className="digital-icon" />
              <h3 className="digital-heading">{item.title}</h3>
              <p className="digital-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DigitalTransformation;
