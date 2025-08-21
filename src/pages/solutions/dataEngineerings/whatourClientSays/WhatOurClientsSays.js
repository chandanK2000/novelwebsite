import React from 'react'
import './WhatOurClientsSays.css'

const WhatOurClientsSays = () => {
  const testimonials = [
    {
      text: "DS STREAM provided an expert team from day one, automating over 90% of our work to boost efficiency and reduce errors. Their expertise and seamless workflow make them a valued partner.",
      author: "Anonymous",
      role: "CEO, Sports Analytics Company"
    },
    {
      text: "The professionalism and technical knowledge DS STREAM brought to the table were outstanding. We’ve achieved faster results with minimal manual intervention.",
      author: "Anonymous",
      role: "CEO, Sports Analytics Company"
    }
   
  ];

  return (
    <section className='what-our-clients-say'>
      <h2 className='clients-title'>What our clients say</h2>
      <div className='clients-testimonials'>
        {testimonials.map((item, index) => (
          <div key={index} className="testimonial-cards">
            <p className="testimonial-text">"{item.text}"</p>
            <footer className="testimonial-footer">
              <p className='testimonial-author'>{item.author}</p>
              <p className="testimonial-role">{item.role}</p>
            </footer>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhatOurClientsSays
