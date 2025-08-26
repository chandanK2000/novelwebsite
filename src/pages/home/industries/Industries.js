import React from 'react';
import './Industries.css';
import finance from '../../../assets/images/finance.png';
import ecommerce from '../../../assets/images/e-commerce.png';
import technology from '../../../assets/images/technology.png';
import education from '../../../assets/images/education.png';
import manufacturing from '../../../assets/images/manufacturing.png';
import healthcare from '../../../assets/images/health-care.png';
import { FaArrowRight } from 'react-icons/fa';

const Industries = () => {
    return (
        <section className="industries-section">
            <h3 className="industries-heading">Industries We Empower</h3>
            <div className="industries-grid">
                <div className="industry-card" style={{ backgroundColor: '#C5FFE4' }}>
                    <img src={finance} alt="Finance" />
                    <h4>Finance</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/finance" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>                </div>

                <div className="industry-card" style={{ backgroundColor: '#F5F7FA' }}>
                    <img src={ecommerce} alt="E-commerce" />
                    <h4>E-commerce</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/finance" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>
                <div className="industry-card" style={{ backgroundColor: '#E7FFBC' }}>
                    <img src={technology} alt="Technology" />
                    <h4>Technology</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/finance" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>
                <div className="industry-card" style={{ backgroundColor: '#E2F4FF' }}>
                    <img src={education} alt="Education" />
                    <h4>Education</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/finance" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>
                <div className="industry-card" style={{ backgroundColor: '#FFEECF' }}>
                    <img src={manufacturing} alt="Manufacturing" />
                    <h4>Manufacturing</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/finance" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>
                <div className="industry-card" style={{ backgroundColor: '#E8E2FF' }}>
                    <img src={healthcare} alt="Healthcare" />
                    <h4>Healthcare</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/finance" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Industries;
