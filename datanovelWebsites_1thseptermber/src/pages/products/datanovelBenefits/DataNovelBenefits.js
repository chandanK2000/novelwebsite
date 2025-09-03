import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import finance from '../../../assets/images/finance.png';
import ecommerce from '../../../assets/images/e-commerce.png';
import technology from '../../../assets/images/technology.png';
import education from '../../../assets/images/education.png';
import manufacturing from '../../../assets/images/manufacturing.png';
import healthcare from '../../../assets/images/health-care.png';
import './DataNovelBenefits.css'

const DataNovelBenefits = () => {
    return (
        <section className="dataNovelBenefits-section">
            <h3 className="dataNovelBenefits-heading">
                Benefits of DataNovel / Tailored for Diverse Applications
            </h3>
            <div className="dataNovelBenefits-grid">
                <div className="dataNovelBenefits-card" style={{ backgroundColor: '#C5FFE4' }}>
                    <img src={finance} alt="Finance" />
                    <h4>Finance</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/finance" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>                
                </div>

                <div className="dataNovelBenefits-card" style={{ backgroundColor: '#F5F7FA' }}>
                    <img src={ecommerce} alt="E-commerce" />
                    <h4>E-commerce</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/e-commerce" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>

                <div className="dataNovelBenefits-card" style={{ backgroundColor: '#E7FFBC' }}>
                    <img src={technology} alt="Technology" />
                    <h4>Technology</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/technology" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>

                <div className="dataNovelBenefits-card" style={{ backgroundColor: '#E2F4FF' }}>
                    <img src={education} alt="Education" />
                    <h4>Education</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/education" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>

                <div className="dataNovelBenefits-card" style={{ backgroundColor: '#FFEECF' }}>
                    <img src={manufacturing} alt="Manufacturing" />
                    <h4>Manufacturing</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/manufacturing" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>

                <div className="dataNovelBenefits-card" style={{ backgroundColor: '#E8E2FF' }}>
                    <img src={healthcare} alt="Healthcare" />
                    <h4>Healthcare</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                    <a href="/industries/healthcare" className="learn-more-link">
                        Learn More <FaArrowRight style={{ marginLeft: '5px' }} />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default DataNovelBenefits;
