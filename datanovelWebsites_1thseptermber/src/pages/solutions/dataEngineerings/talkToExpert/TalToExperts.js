import React from 'react';
import './TalToExperts.css';
import expertDataEngineer from '../../../../assets/images/expertDataEngineer.png';
import { Link } from 'react-router-dom';
import  contactarrow from '../../../../assets/icons/contactArrow.png'

const TalToExperts = () => {
    return (
        <section className='experts-section'>
            <div className='experts-container'>
                {/* Left Side */}
                <div className='experts-content'>
                    <h2 className='experts-heading'>
                        Drop us a line and check how Data<br />
                        <span> Engineering, Machine Learning, and AI <br />experts</span>  can boost your business.
                    </h2>
                </div>

                {/* Right Side */}
                <div className='experts-card'>
                    <img src={expertDataEngineer} alt='Talk to Experts' className='experts-image' />
                    <div className='experts-info'>
                        <h4 className='experts-name'>Expert Name</h4>
                        <p className='experts-role'>Chandan Kumar</p>
                        <button className='experts-btn'>Talk to Expert</button>
                    </div>
                </div>
                <div className='experts-link-section'>
                    <Link to='/talk-to-expert' className='experts-link'>Talk to expert – It’s free <img src={contactarrow} alt='Contact Arrow' className='contact-arrow' /></Link>
                </div>
            </div>

        </section>
    )
}

export default TalToExperts;
