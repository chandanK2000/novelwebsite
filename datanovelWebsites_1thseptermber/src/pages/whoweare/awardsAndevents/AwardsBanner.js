import React from 'react'
import awardsandevents from '../../../assets/images/awards&events.png';
import './AwardsBanner.css';

const AwardsBanner = () => {
    return (
        <section className="awards-banner-section">
            <div className="awards-banner-container">
                <div className="awards-banner-text">
                    <h3>Awards</h3>
                    <p>
                        From Global Recognition to Industry Accolades <br/>Explore Our Journey
                    </p>
                </div>
                <div className="awards-banner-image">
                    <img src={awardsandevents} alt="Awards and Events" />
                </div>
            </div>
        </section>
    )
}

export default AwardsBanner;
