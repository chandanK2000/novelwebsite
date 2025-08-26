import React from 'react';
import './AwardsProcess.css';
import awardsandevents from '../../../assets/images/awardsandEvents2.png';

const AwardsProcess = () => {
    return (
        <section className="awards-process-section">
            <div className="awards-process-container d-flex">
                
                {/* Left Column */}
                <div className="awards-process-column left">
                    <div className="awards-process-item">
                        <h3>Award Name</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                    <div className="awards-process-item">
                        <h3>Planning</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                    <div className="awards-process-item">
                        <h3>Execute</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                    <div className="awards-process-item">
                        <h3>Deliver</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                </div>

                {/* Center Image */}
                <div className="awards-process-image">
                    <img src={awardsandevents} alt="Awards Process" />
                </div>

                {/* Right Column */}
                <div className="awards-process-column right">
                    <div className="awards-process-item">
                        <h3>Award Name</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                    <div className="awards-process-item">
                        <h3>Planning</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                    <div className="awards-process-item">
                        <h3>Execute</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                    <div className="awards-process-item">
                        <h3>Deliver</h3>
                        <p>Our membership management software provides full automation of membership renewals and</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AwardsProcess;
