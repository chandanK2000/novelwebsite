import React from 'react';
import './Faqs.css';

const Faqs = () => {
  return (
    <section className='faqs-section' style={{ margin: '120px 40px' }}>
      <h2>Frequently Asked Questions</h2>
      <div className='faq-item'>
        <h3>Question 1</h3>
        <p>Answer to question 1.</p>
      </div>
      <div className='faq-item'>
        <h3>Question 2</h3>
        <p>Answer to question 2.</p>
      </div>
    </section>
  )
}

export default Faqs;
