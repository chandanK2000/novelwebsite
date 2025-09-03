import React, { useRef } from 'react';
import Slider from 'react-slick';
import './DataNovelLeadership.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import datanovelleadershipImage from '../../../../assets/images/datanovelleadershipImage.png';
import leftarrow from '../../../../assets/icons/leftarrow.png';
import rightarrow from '../../../../assets/icons/rightarrow.png';

const leadershipData = [
    { project: "AI Analytics Platform", description: "Experience in building innovative tech solutions.", image: datanovelleadershipImage },
    { project: "Cybersecurity Enhancement", description: "Visionary leader with expertise in AI.", image: datanovelleadershipImage },
    { project: "Cloud Migration Initiative", description: "Expert in operations and business strategy.", image: datanovelleadershipImage },
    { project: "Blockchain Integration", description: "Specialist in finance and tech integration.", image: datanovelleadershipImage },
];

const DataNovelLeadership = ({headerContent}) => {
    const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                centerMode: true,      // centers the single card
                centerPadding: "30px",  // removes extra padding on sides
            }
        }
    ],
};


    return (
        <section className='datanovel-leadership-section'>
            {headerContent ? headerContent : (
                <div className="leadership-header text-center">
                    <h2>The DataNovel Leadership Team</h2>
                    <p>Experience. Vision. Integrity. Each member of the leadership team has uncommon experience in building companies dedicated to customer success.</p>
                </div>
            )}
            <Slider {...settings} ref={sliderRef} className='datanovel-leadership-cards'>
                {leadershipData.map((member, index) => (
                    <div className='datanovel-leadership-card' key={index}>
                        <div className='datanovel-leadership-image'>
                            <img src={member.image} alt={member.project} />
                        </div>
                        <div className='datanovel-leadership-info'>
                            <h3>{member.project}</h3>
                            <p>{member.description}</p>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Custom arrows using images */}
            <div className="custom-arrows-wrapper">
                <button
                    className="custom-arrow prev-arrows"
                    onClick={() => sliderRef.current.slickPrev()}
                >
                    <img src={leftarrow} alt="Previous" />
                </button>
                <button
                    className="custom-arrow next-arrows"
                    onClick={() => sliderRef.current.slickNext()}
                >
                    <img src={rightarrow} alt="Next" />
                </button>
            </div>
        </section>
    );
};

export default DataNovelLeadership;
