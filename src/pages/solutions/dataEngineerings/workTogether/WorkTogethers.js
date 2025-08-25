import React from 'react'
import './WorkTogethers.css';
import expertDataEngineer from '../../../../assets/images/expertDataEngineer.png';

const WorkTogethers = () => {
    return (
        <section className='work-together-section py-5'>
            <div className='container'>
                <div className='row align-items-center'>
                    
                    {/* Left Content */}
                    <div className='col-lg-6 col-md-6 col-sm-12 mb-4 mb-md-0'>
                        <h2 className="mb-3">Let’s talk and work together</h2>
                        <p className="mb-4">
                            We’ll get back to you within 4 hours on working days 
                            <br /> <strong>(Mon – Fri, 9am – 5pm CET)</strong>.
                        </p>
                        <img 
                            className='img-fluid rounded shadow-sm' 
                            src={expertDataEngineer} 
                            alt='Work Together' 
                        />
                    </div>

                    {/* Right Form */}
                    <div className='col-lg-6 col-md-6 col-sm-12'>
                        <div className="form-wrapper p-4 rounded shadow-sm">
                            <form>
                                <div className="mb-2">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Enter your name" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" placeholder="Enter your email" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">Subject</label>
                                    <input type="text" className="form-control" id="subject" placeholder="Enter subject" />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea className="form-control" id="message" rows="4" placeholder="Enter your message"></textarea>
                                </div>

                                <button type="submit" className="submit-button">Submit</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default WorkTogethers;
