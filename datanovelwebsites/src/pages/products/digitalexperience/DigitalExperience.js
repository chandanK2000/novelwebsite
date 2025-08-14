import React from 'react';
import './DigitalExperience.css';
import heroImage from '../../../assets/images/Illustration.png';

const DigitalExperience = () => {
    return (
        <section className="digital_experience_section py-5">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-8 text-section">
                        <h2>Transforming Ideas into Digital Experiences</h2>
                        <p>
                            Welcome to DataNovel, your partner in building modern, high-impact web solutions.
                            We specialize in crafting scalable websites, intelligent platforms, and user-focused
                            digital products tailored to your business goals. Whether you're a startup looking
                            to launch fast or an enterprise streamlining your digital presence, DataNovel brings
                            together design, development, and innovation to help you thrive online.
                        </p>
                    </div>
                    <div className="col-md-4 text-center">
                        <img alt="Hero Graphic" src={heroImage} className="hero-image img-fluid" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DigitalExperience;
