import React from 'react'
import './BusinessSupport.css'
import  contactarrow from '../../../../assets/icons/contactArrow.png'
const BusinessSupport = () => {
  return (
    <section className='business-support-section'>
      <div className='business-support-container'>
        <h2>Curious on how we can support your business<br/> with data engineering?</h2>
        <button className='business-support-button'>CONTACT US<img src={contactarrow} alt="Contact Arrow" /></button>
        <div className='extra-box bottom-right'></div>
      </div>
    </section>
  )
}

export default BusinessSupport;
