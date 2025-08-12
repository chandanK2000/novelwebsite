import React from 'react';
import Slider from 'react-slick';
import './ClientTestonomial.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    img: 'https://media.istockphoto.com/id/1372065700/photo/portrait-of-a-confident-young-businessman-working-in-a-modern-office.jpg?s=612x612&w=0&k=20&c=oPRp9aiGEb_00Y0Q_eR40MiOisM2eFfeP7lDf0IqJDw=',
    text: 'This is an amazing platform. It helped me grow quickly.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    img: 'https://media.istockphoto.com/id/1413766112/photo/successful-mature-businessman-looking-at-camera-with-confidence.jpg?s=612x612&w=0&k=20&c=NJSugBzNuZqb7DJ8ZgLfYKb3qPr2EJMvKZ21Sj5Sfq4=',
    text: 'Incredible support and community. Love it!',
  },
  {
    id: 3,
    name: 'Emily Rose',
    img: 'https://images.pexels.com/photos/2955376/pexels-photo-2955376.jpeg?cs=srgb&dl=pexels-teddyjmodel-2955376.jpg&fm=jpg',
    text: 'Highly recommend it to anyone looking to expand.',
  },
  {
    id: 4,
    name: 'Michael Scott',
    img: 'https://static.vecteezy.com/system/resources/thumbnails/053/630/749/small/a-beautiful-young-business-woman-in-a-suit-and-tie-photo.jpeg',
    text: 'Simply the best experience I’ve had.',
  },
];

const ClientTestonomial = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  let sliderRef = React.useRef(null);

  return (
    <section className='clientTestonomail_section'>
      <h3>Client Testimonial Example</h3>
      <p>
The Nextcent blog is the best place to read about the latest membership insights, trends and more. See who's joining the community, read about how our community are increasing their membership income and lot's more.​      </p>

      <Slider {...settings} ref={sliderRef} className="testimonial-slider">
        {testimonials.map((item) => (
          <div key={item.id} className="testimonial-card">
            <img src={item.img} alt={item.name} />
            <h4>{item.name}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </Slider>

      {/* Arrows below the slider */}
      <div className="testimonial-arrows">
        <button onClick={() => sliderRef.current?.slickPrev()} className="custom-arrow">‹</button>
        <button onClick={() => sliderRef.current?.slickNext()} className="custom-arrow">›</button>
      </div>
    </section>
  );
};

export default ClientTestonomial;
