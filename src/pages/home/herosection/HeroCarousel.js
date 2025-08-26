import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HeroCarousel.css';
import heroSlides from './HeroSlidesData';

const HeroCarousel = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true, dynamicBullets: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      loop={true}
      speed={800}
      slidesPerView={1}
      spaceBetween={0}
      grabCursor={true}
    >
      {heroSlides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="hero-image-only">
            <img src={slide.image} alt={`Slide ${index + 1}`} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousel;
