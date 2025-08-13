import React, { useRef } from 'react';
import Slider from 'react-slick';
import './RecentProjects.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const projects = [
  { id: 1, title: 'Project 1', image: 'https://prothoughts.co.in/wp-content/uploads/2024/09/Project-Reports.webp' },
  { id: 2, title: 'Project 2', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtHBOHm19UCoHXG2URkWTX0hgaBPg7JPagGA&s' },
  { id: 4, title: 'Project 4', image: 'https://media.istockphoto.com/id/1411195926/photo/project-manager-working-on-laptop-and-updating-tasks-and-milestones-progress-planning-with.jpg?s=612x612&w=0&k=20&c=5A0CEsRbIrgnci0Q7LSxbrUZ1pliXy8C04ffpnjnVIw=' },
  { id: 5, title: 'Project 5', image: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/project_management_coursefees.jpg' },
  { id: 6, title: 'Project 6', image: 'https://media.licdn.com/dms/image/v2/D4D12AQGVw0sVZ7Kj-g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1673636348357?e=2147483647&v=beta&t=PSpU4mZFpMBmE14oWDnDwf5a8_4rdQUiCUKF_U-x584' },
    { id: 7, title: 'Project 7', image: 'https://prothoughts.co.in/wp-content/uploads/2024/09/Project-Reports.webp' },

];

// Custom arrow components
const NextArrow = ({ onClick }) => (
  <button className="custom-arrow next-arrow" onClick={onClick} aria-label="Next slide">
    ›
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button className="custom-arrow prev-arrow" onClick={onClick} aria-label="Previous slide">
    ‹
  </button>
);

const RecentProjects = () => {
  const sliderRef = useRef(null);

const settings = {
  centerMode: true,
  centerPadding: '0px',
  slidesToShow: 5,
  infinite: true,
  speed: 700,
  autoplay: true,
  autoplaySpeed: 2500,
  cssEase: 'ease-in-out',
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        centerMode: false,
      },
    },
  ],
};


  return (
  <div style={{background:'#F5F7FA'}}>
      <section className="recent-projects-section">
      <h3>Recent Projects / Success Stories</h3>
      <Slider ref={sliderRef} {...settings} className='my-3'>
        {projects.map((project) => (
          <div key={project.id} className="project-slide">
            <img src={project.image} alt={project.title} />
            <h4 className='my-3'>{project.title}</h4>
          </div>
        ))}
      </Slider>

      <div className="arrow-container">
        <PrevArrow onClick={() => sliderRef.current?.slickPrev()} />
        <NextArrow onClick={() => sliderRef.current?.slickNext()} />
      </div>
    </section>
  </div>
  );
};

export default RecentProjects;
