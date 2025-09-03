import React from 'react'
import './ContactUs.css';
import ContactusBanner from './ContactusBanner';
import ContactUsForm from './ContactUsForm';
const ContactUs = () => {
    return (
      <div style={{ marginTop: '80px' }}>
        <ContactusBanner />
        <ContactUsForm/>
      </div>
    )
}

export default ContactUs;
