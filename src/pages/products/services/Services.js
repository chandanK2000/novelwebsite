import React from 'react';
import './Services.css';

import arithmetic from '../../../assets/icons/arithmetic-buttons.png';
import cpu from '../../../assets/icons/cpu.png';
import red from '../../../assets/icons/red-cross.png';
import degreehat from '../../../assets/icons/degree-hat.png';
import vector from '../../../assets/icons/Vector.png';
import factory_building from '../../../assets/icons/factory-building.png';

import finances from '../../../assets/images/finances.png';
import technologies from '../../../assets/images/technologies.png';
import healthcares from '../../../assets/images/healthcares.png';
import educations from '../../../assets/images/educations.png';
import ecommerces from '../../../assets/images/ecommerces.png';
import manufacturings from '../../../assets/images/manufacturings.png';



const servicesData = [
  {
    icon: arithmetic,
    title: "Finance",
    items: [
      "Build secure, scalable platforms for online banking, investments, and financial services.",
      "Integrate real-time data dashboards and analytics for better insights and reporting.",
      "Automate workflows for transactions, compliance, and customer onboarding."
    ],
    image: finances
  },
  {
    icon: cpu,
    title: "Technology",
    items: [
      "Design and deploy cutting-edge SaaS platforms, dashboards, and developer tools.",
      "Integrate APIs, AI/ML modules, and cloud services into custom-built systems.",
      "Prioritize performance, UX, and scalability across digital ecosystems."
    ],
    image: technologies
  },
  {
    icon: red,
    title: "Healthcare",
    items: [
      "Build HIPAA-compliant platforms for telemedicine, scheduling, and patient data.",
      "Integrate EHR systems with analytics for smarter diagnostics and planning.",
      "Enhance patient experience through intuitive interfaces and mobile access."
    ],
    image: healthcares
  },
  {
    icon: degreehat,
    title: "Education",
    items: [
      "Develop interactive e-learning portals and student management systems.",
      "Enable virtual classrooms, live assessments, and smart content delivery.",
      "Improve accessibility and engagement through mobile-first, user-friendly platforms."
    ],
    image: educations
  },
  {
    icon: vector,
    title: "e-Commerce",
    items: [
      "Build high-conversion storefronts with secure payments and inventory management.",
      "Integrate ERP/CRM, real-time analytics, and recommendation engines.",
      "Optimize search, checkout, and mobile UX to boost conversions."
    ],
    image: ecommerces
  },
  {
    icon: factory_building,
    title: "Manufacturing",
    items: [
      "Implement IoT monitoring, predictive maintenance, and quality control.",
      "Digitize the supply chain with MES/ERP integrations and live dashboards.",
      "Automate production planning, inventory, and compliance workflows."
    ],
    image: manufacturings
  }
];


const Services = () => {
  return (
    <section className="services_section container">
      <div className="services_grid">
        {servicesData.map((service, index) => (
          <div className="service_card" key={index}>
            <div className="service_icon">
              <img src={service.icon} alt={service.title} />
            </div>
            <h3>{service.title}</h3>
            <div className="service_content">
              <ul>
                {service.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="service_image">
                <img src={service.image} alt={service.title} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services;
