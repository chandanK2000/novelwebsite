import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import dataMigration from '../../../../assets/images/datamigration.png';
import dataActivation from '../../../../assets/images/dataActivation.jfif';
import dataplatform from '../../../../assets/images/dataplatform.jfif';
import dataquality from '../../../../assets/images/dataquality.jfif';
import './OurCoreOfferings.css'; 
const offeringsData = [
  {
    title: 'Data Migration',
    image: dataMigration,
    description: 'Migrate data faster, better, and cost-effectively',
    points: [
      {
        heading: 'Seamless legacy-to-modern migration',
        text: 'Bridge the gap between outdated infrastructure and cutting-edge technology, future-proofing your data management.'
      },
      {
        heading: 'Minimal downtime migration',
        text: 'Ensure business continuity with efficient migration processes.'
      },
      {
        heading: 'Cost-effective solutions',
        text: 'Optimize resources while delivering high-quality results.'
      }
    ]
  },
  {
    title: 'Data Activation',
    image: dataActivation,
    description: 'Activate your data to drive actionable insights',
    points: [
      {
        heading: 'Real-time data activation',
        text: 'Turn your data into actionable insights instantly.'
      },
      {
        heading: 'Cross-platform integration',
        text: 'Seamlessly integrate data across platforms.'
      },
      {
        heading: 'Enhanced decision making',
        text: 'Empower teams with data-driven strategies.'
      }
    ]
  },
  {
    title: 'Data Platform Modernization',
    image: dataplatform,
    description: 'Modernize your data platform for scalability and efficiency',
    points: [
      {
        heading: 'Cloud-native architecture',
        text: 'Move to modern cloud platforms for efficiency and scale.'
      },
      {
        heading: 'Optimized performance',
        text: 'Reduce latency and improve data processing speed.'
      },
      {
        heading: 'Future-proof systems',
        text: 'Adopt flexible architectures for evolving business needs.'
      }
    ]
  },
  {
    title: 'Data Quality',
    image: dataquality,
    description: 'Ensure high-quality and reliable data for your business',
    points: [
      {
        heading: 'Data validation & cleansing',
        text: 'Maintain accurate and consistent data.'
      },
      {
        heading: 'Compliance & governance',
        text: 'Ensure data meets regulatory standards.'
      },
      {
        heading: 'Continuous monitoring',
        text: 'Proactively track and improve data quality.'
      }
    ]
  }
];

const OurCoreOfferings = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
  <section className='our-core-offerings'>
  <h2 className=''>Our Core Offerings</h2>

  {/* Tabs */}
  <div className="offerings-tabs">
    {offeringsData.map((item, index) => (
      <div
        key={index}
        className={`offerings-tab ${activeTab === index ? 'active' : ''}`}
        onClick={() => setActiveTab(index)}
      >
        {item.title}
      </div>
    ))}
  </div>

  {/* Tab Content */}
  <div className="tab-content-custom">
    <div className="tab-image">
      <img
        src={offeringsData[activeTab].image}
        alt={offeringsData[activeTab].title}
      />
    </div>
    <div className="tab-details">
      <h3>{offeringsData[activeTab].title}</h3>
      <p>{offeringsData[activeTab].description}</p>
      <ul className="list-unstyled">
        {offeringsData[activeTab].points.map((point, idx) => (
          <li key={idx} className="mb-3">
            <h5>{point.heading}</h5>
            <p>{point.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>

  );
};

export default OurCoreOfferings;
