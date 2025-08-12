import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './HeroSection.css';
import heroSlides from './HeroSlidesData';
import './HeroCarousel.css'
const HeroCarousel = () => {
    return (
        // <Swiper
        //   modules={[Pagination, Autoplay]}
        //   pagination={{ clickable: true }}
        //   autoplay={{ delay: 5000 }}
        //   loop={true}
        //   spaceBetween={0}
        //   slidesPerView={1}
        // >

        <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{
                clickable: true,
                dynamicBullets: true,
            }}
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
                    <div className="hero-container">
                        {/* Left */}
                        <div className="hero-left">
                            <h1 className="hero-heading">{slide.title}</h1>
                            <p className="hero-subtext">{slide.subtitle}</p>
                            <button className="hero-button">Register</button>
                        </div>

                        {/* Right */}
                        <div className="hero-right">
                            <img src={slide.image} alt={`Slide ${index + 1}`} className="hero-image" />
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default HeroCarousel;
