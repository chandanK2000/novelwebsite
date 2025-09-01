import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import './Banner.css';
// import image1 from '../../assets/images/imageone.jpg';
import image2 from '../../assets/images/imagetwo.jpg';
import image3 from '../../assets/images/imagethree.jpg';


const Banner = () => {
  const images = [image2,image3];

  return (
    <div className="banner-container">
      <Carousel
      
        autoPlay
        infiniteLoop
        interval={3000}
        showThumbs={false}
        showStatus={false}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              className="custom-arrow prev"
              aria-label={label}
            >
              &#8249;
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              className="custom-arrow next"
              aria-label={label}
            >
              &#8250;
            </button>
          )
        }
        renderIndicator={(onClickHandler, isSelected, index) => (
          <li
            className={`custom-indicator ${isSelected ? 'selected' : ''}`}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            role="button"
            tabIndex={0}
            aria-label={`Slide ${index + 1}`}
          />
        )}
      >
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
