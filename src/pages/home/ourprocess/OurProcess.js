import React from 'react';
import './OurProcess.css';
import discoveryIcon from '../../../assets/icons/discoveries.png';
import planningIcon from '../../../assets/icons/plannings.png';
import executeIcon from '../../../assets/icons/executes.png';
import deliverIcon from '../../../assets/icons/delivers.png';

const processSteps = [
  {
    title: 'Discovery',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    icon: discoveryIcon, 
  },
  {
    title: 'Planning',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    icon: planningIcon,
  },
  {
    title: 'Execute',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    icon: executeIcon,
  },
  {
    title: 'Deliver',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
    icon: deliverIcon,
  },
];

const OurProcess = () => {
  return (
    <section className='ourprocess_section'>
      <h3>Our Process</h3>
      <div className='ourprocess_block'>
        {processSteps.map((step, index) => (
          <div className='card-with-arrow' key={index}>
            <div className='process-card'>
              <img src={step.icon} alt={step.title} />
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
            {index !== processSteps.length - 1 && (
              <div className="arrow">→</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurProcess;
