import React from 'react'
import './TechnologyStack.css'
import broserUpdatedOutlined from '../../../../assets/icons/BrowserUpdatedOutlined.png'

const techStackData = [
  {
    id: 1,
    icon: broserUpdatedOutlined,
    title: 'Data-driven decision',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: 2,
    icon: broserUpdatedOutlined,
    title: 'Scalable Infrastructure',
    description: 'We build solutions that grow with your business needs.'
  },
  {
    id: 3,
    icon: broserUpdatedOutlined,
    title: 'AI-Powered Insights',
    description: 'Harness AI to uncover patterns and make smarter decisions.'
  },
  {
    id: 4,
    icon: broserUpdatedOutlined,
    title: 'Secure & Reliable',
    description: 'Ensuring your data is safe with top-notch security measures.'
  }
]

const TechnologyStack = () => {
  return (
    <section className="technology-stack">
      <div className="technology-stack__header">
        <h2 className="technology-stack__title">Technology Stack</h2>
        <p className="technology-stack__description">
          We use an expanded technology tool stack to make a difference in your data
        </p>
      </div>

      <div className="technology-stack__container">
        {techStackData.map(item => (
          <div key={item.id} className="technology-stack__item">
            <img src={item.icon} alt={item.title} className="technology-stack__icon" />
            <h3 className="technology-stack__item-title">{item.title}</h3>
            <p className="technology-stack__item-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TechnologyStack
