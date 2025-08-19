import React, { useRef } from 'react';
import Slider from 'react-slick';
import './DataNovelLeadership.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import datanovelleadershipImage from '../../../../assets/images/datanovelleadershipImage.png';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Custom arrows
const NextArrow = (props) => {
    const { onClick } = props;
    return <div className="slick-arrow custom-next" onClick={onClick}>Next</div>;
};

const PrevArrow = (props) => {
    const { onClick } = props;
    return <div className="slick-arrow custom-prev" onClick={onClick}>Prev</div>;
};

const leadershipData = [
    { project: "AI Analytics Platform", description: "Experience in building innovative tech solutions.", image: datanovelleadershipImage },
    { project: "Cybersecurity Enhancement", description: "Visionary leader with expertise in AI.", image: datanovelleadershipImage },
    { project: "Cloud Migration Initiative", description: "Expert in operations and business strategy.", image: datanovelleadershipImage },
    { project: "Blockchain Integration", description: "Specialist in finance and tech integration.", image: datanovelleadershipImage },
];

const DataNovelLeadership = () => {
    const sliderRef = useRef(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
    };
    return (
        <section className='datanovel-leadership-section'>
            <div className="leadership-header text-center">
                <h2>The DataNovel Leadership Team</h2>
                <p>Experience. Vision. Integrity. Each member of the leadership team has uncommon experience in building companies dedicated to customer success.</p>
            </div>

            <Slider {...settings} ref={sliderRef} className='datanovel-leadership-cards'>
                {leadershipData.map((member, index) => (
                    <div className='datanovel-leadership-card' key={index}>
                        <div className='datanovel-leadership-image'>
                            <img src={member.image} alt={member.project} />
                        </div>
                        <div className='datanovel-leadership-info'>
                            <h3>{member.project}</h3>
                            <p><strong>{member.role}</strong></p>
                            <p>{member.description}</p>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Custom arrows below carousel */}
            <div className="custom-arrows-wrapper">
                <button className="custom-arrow big-arrow" onClick={() => sliderRef.current.slickPrev()}>
                    <FaArrowLeft size={50} className='leftarrow' />
                </button>
                <button className="custom-arrow big-arrow" onClick={() => sliderRef.current.slickNext()}>
                    <FaArrowRight size={50} />
                </button>
            </div>

        </section>
    );
};

export default DataNovelLeadership;
