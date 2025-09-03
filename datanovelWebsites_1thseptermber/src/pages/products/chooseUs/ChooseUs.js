import React from 'react'
import './ChooseUs.css'
import discoveryIcon from '../../../assets/icons/discoveries.png';
import planningIcon from '../../../assets/icons/plannings.png';
import executeIcon from '../../../assets/icons/executes.png';
import deliverIcon from '../../../assets/icons/delivers.png';

const ChooseUs = () => {
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

  return (
    <section className='chooseus-section'>
      <h3 className='chooseus-title'>Why Choose DataNovel</h3>
      <div className='chooseus-block'>
        {processSteps.map((step, index) => (
          <div className='chooseus-card-with-arrow' key={index}>
            <div className='chooseus-card'>
              <img src={step.icon} alt={step.title} />
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
            {index !== processSteps.length - 1 && (
              <div className="chooseus-arrow">→</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ChooseUs;
