import React, { useState, useEffect } from 'react';
import './AwardsReviews.css';

const AwardsReviews = () => {
    const testimonials = [
        {
            text: "DS STREAM provided an expert team from day one, automating over 90% of our work to boost efficiency and reduce errors. Their expertise and seamless workflow make them a valued partner.",
            author: "Anonymous",
            role: "CEO, Sports Analytics Company"
        },
        {
            text: "The professionalism and technical knowledge DS STREAM brought to the table were outstanding. We’ve achieved faster results with minimal manual intervention.",
            author: "Anonymous",
            role: "CEO, Sports Analytics Company"
        },
        {
            text: "Working with DS STREAM has been amazing. They simplified complex processes and improved our workflow efficiency by 70%.",
            author: "Anonymous",
            role: "CTO, Tech Solutions"
        },
        {
            text: "The DS STREAM team is proactive, responsive, and technically strong. We highly recommend them.",
            author: "Anonymous",
            role: "Manager, Analytics Co."
        },
        {
            text: "The DS STREAM team is proactive, responsive, and technically strong. We highly recommend them.",
            author: "Anonymous",
            role: "Manager, Analytics Co."
        },
        {
            text: "The DS STREAM team is proactive, responsive, and technically strong. We highly recommend them.",
            author: "Anonymous",
            role: "Manager, Analytics Co."
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex < testimonials.length - 2 ? prevIndex + 1 : 0
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : testimonials.length - 2
        );
    };

    // ✅ Auto slide every 3 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className='awards-reviews-section'>
            <h2 className='awards-reviews-title'>What our clients say</h2>
            <div className='awards-reviews-carousel'>
                <div className='awards-reviews-testimonials'>
                    {testimonials.slice(currentIndex, currentIndex + 2).map((item, index) => (
                        <div key={index} className="awards-reviews-card">
                            <p className="awards-reviews-text">"{item.text}"</p>
                            <footer className="awards-reviews-footer">
                                <p className='awards-reviews-author'>{item.author}</p>
                                <p className="awards-reviews-role">{item.role}</p>
                            </footer>
                        </div>
                    ))}
                </div>
            </div>
            <div className='carousel-controls'>
                <button className='carousel-arrow left' onClick={prevSlide}>&lt;</button>
                <button className='carousel-arrow right' onClick={nextSlide}>&gt;</button>
            </div>
        </section>
    )
}

export default AwardsReviews;
