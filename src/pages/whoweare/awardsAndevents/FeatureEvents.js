import React from 'react'
import './FeatureEvents.css';
import featureEventOne from '../../../assets/images/featureEventOne.png';
import featureEventTwo from '../../../assets/images/featureEventTwo.png';
import featureEventThree from '../../../assets/images/featureEventThree.png';
const FeatureEvents = () => {
    return (
        <section className='feature-events-container'>
            <div className='feature-events-blockOne mt-5'>
                <div className='feature-events-left'>
                    <img src={featureEventOne} alt='Event 1' />
                </div>
                <div>
                    <h3>Learn from industry leaders</h3>
                    <ul>
                        <li>Hear from Microsoft executives and other leaders on their vision for AI.</li>
                        <li>Explore the latest in cloud, AI, and security. </li>
                        <li>See how customers and partners drive industry change.  </li>
                        <li>Watch on-demand content from anywhere. </li>
                    </ul>
                </div>
            </div>
            <div className='feature-events-blockTwo d-flex'>

                <div>
                    <h3>Connect and grow your network</h3>
                    <ul>
                        <li>Meet with Microsoft leaders.  </li>
                        <li>Socialize with peers at evening events.  </li>
                        <li>Engage one-on-one with experts.   </li>
                        <li>Enjoy dynamic community spaces.  </li>
                    </ul>
                </div>
                <div className='feature-events-left'>
                    <img src={featureEventTwo} alt='Event 2' />
                </div>
            </div>

            <div className='feature-events-blockThree d-flex'>
                <div className='feature-events-left'>
                    <img src={featureEventThree} alt='Event 3' />
                </div>
                <div>
                    <h3>Explore cutting-edge technologies</h3>
                    <ul>
                        <li>Get hands-on experience during labs. </li>
                        <li>Test cloud solutions with experts at the Microsoft Showcase.  </li>
                        <li>Check out Microsoft and partner solutions in the Hub </li>
                        <li>Attend presentations designed for partners.  </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default FeatureEvents;
