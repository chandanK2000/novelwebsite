import React from 'react';
import './OurClients.css'
import logo1 from '../../../assets/icons/Logo1.png'
import logo2 from '../../../assets/icons/Logo2.png'
import logo3 from '../../../assets/icons/Logo3.png'
import logo4 from '../../../assets/icons/Logo4.png'
import logo5 from '../../../assets/icons/Logo5.png'
import logo6 from '../../../assets/icons/Logo6.png'
import icon1 from '../../../assets/icons/icon1.png'
import icon2 from '../../../assets/icons/icon2.png'
import icon3 from '../../../assets/icons/icon3.png'

// import logo1 from '../../../assets/icons/Logo1.png'
// import logo2 from '../../../assets/icons/Logo2.png'
// import logo3 from '../../../assets/icons/Logo3.png'

const OurClients = () => {
    return (
        <section className="our-clients-wrapper">
            <div className="our-clients-container">

                <div className="our-clients-text">
                    <h3 className="our-clients-heading">Our Clients</h3>
                    <p>We have been working with some Fortune 500+ clients</p>
                </div>

                <div className="icons-wrapper">
                    <img src={logo1} alt="Client Icon 1" className="client-icon" />
                    <img src={logo2} alt="Client Icon 2" className="client-icon" />
                    <img src={logo3} alt="Client Icon 3" className="client-icon" />
                    <img src={logo4} alt="Client Icon 4" className="client-icon" />
                    <img src={logo5} alt="Client Icon 5" className="client-icon" />
                    <img src={logo6} alt="Client Icon 6" className="client-icon" />
                </div>

                <div className="key-stats-section">
                    <div className="key-stat-block">
                        <h3>Key Stats & Achievements</h3>
                        <p>Some paragraph about key stats and achievements here.</p>
                    </div>

                    <div className="key-stats-multiple d-flex">
                        <div className="key-stat-block">
                            <img src={icon1} alt="Icon" className="key-stat-icon" />
                            <h4>200+ Projects Delivered</h4>
                            <p>Track your progress and motivate your efforts everyday.</p>
                        </div>

                        <div className="key-stat-block">
                            <img src={icon2} alt="Icon" className="key-stat-icon" />
                            <h4>99% Client Satisfaction</h4>
                            <p>Set and track goals with manageable task breakdowns.</p>
                        </div>
                        <div className="key-stat-block">
                            <img src={icon3} alt="Icon" className="key-stat-icon" />
                            <h4>5M+ Records Processed</h4>
                            <p>Get alerts on tasks and deadlines that matter most.</p>
                        </div>
                        
                     
                    </div>
                </div>

            </div>
        </section>
    );
};

export default OurClients;
