import React from 'react';
import './DataNovelInvation.css';
import finances from '../../../../assets/images/finances.png';
import technologies from '../../../../assets/images/technologies.png';
import educations from '../../../../assets/images/educations.png';
import ecommerces from '../../../../assets/images/ecommerces.png';
import manufacturings from '../../../../assets/images/manufacturings.png';


const DataNovelInvation = () => {
 const items = [
  { 
    id: 1, 
    serial: "01", 
    title: "An AI Vision solution with no limitations", 
    points: [
      "Build secure, scalable platforms for online banking, investments, and financial services.",
      "Integrate real-time data dashboards and analytics for better insights and reporting",
      "Automate workflows for transactions, compliance, and customer onboarding."
    ], 
    img: finances 
  },
  { 
    id: 2, 
    serial: "02", 
    title: "Air gap data isolation technology", 
    points: [
      "Design and deploy cutting-edge SaaS platforms, dashboards, and developer tools.",
      "Integrate EHR systems with analytics for smarter diagnostics and planning.",
      "Prioritize performance, UX, and scalability across digital ecosystems."
    ], 
    img: technologies 
  },
  { 
    id: 3, 
    serial: "03", 
    title: "Active continuous learning.", 
    points:[
      "Build HIPAA-compliant platforms for telemedicine, scheduling, and patient data.",
      "Integrate EHR systems with analytics for smarter diagnostics and planning.",
      "Enhance patient experience through intuitive interfaces and mobile access."
    ], 
    img: ecommerces 
  },
  { 
    id: 4, 
    serial: "04", 
    title: "Smart annotation", 
    points: [
      "Develop interactive e-learning portals and student management systems.",
      "Enable virtual classrooms, live assessments, and smart content delivery.",
      "Improve accessibility and engagement through mobile-first, user-friendly platforms."
    ], 
    img: educations 
  },
  { 
    id: 5, 
    serial: "05", 
    title: "DataNovel’s exclusive ReadyNow solution sets", 
    points: [
      "Build HIPAA-compliant platforms for telemedicine, scheduling, and patient data.",
      "Integrate EHR systems with analytics for smarter diagnostics and planning.",
      "Enhance patient experience through intuitive interfaces and mobile access."
    ],  
    img: manufacturings 
  },
];


  const renderCard = (item) => (
  <div className="innovation-card" key={item.id}>
    <h5>
      <span className="card-number">{item.serial}</span>
      {item.title}
    </h5>
    <div className="d-flex align-items-center innovation-item-description">
      <ul className="flex-grow-1">
        {item.points.map((point, idx) => <li key={idx}>{point}</li>)}
      </ul>
      <img src={item.img} alt={item.title} className="ms-3" />
    </div>
  </div>
);


    return (
        <section className="datanovel-innovation-section">
            <div className="heading_section">
                <h2>DataNovel innovation drives unparalleled performance</h2>
                <p>Innovation at every step. It’s foundational to everything we do.</p>
            </div>
            <div className="innovation-grid container">
                <div className="left-column">
                    {[1,3,5].map(id => renderCard(items.find(i=>i.id===id)))}
                </div>
                <div className="right-column">
                    {[2,4].map(id => renderCard(items.find(i=>i.id===id)))}
                </div>
            </div>
        </section>
    );
}

export default DataNovelInvation;
