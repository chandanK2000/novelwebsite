// import React from 'react';
// import './ProductBanner.css'; 

// const ProductBanner = () => {
//   return (
//     <div className="product-banner">
//       <div className="banner-content">
//         <h3>DataNovel: Powering the Future of Digital Intelligence</h3>
//         <p>Smart Web & AI Solutions That Drive Results</p>
//       </div>
//     </div>
//   );
// };

// export default ProductBanner;
import React, { useState, useEffect } from 'react';
import './ProductBanner.css';

const images = [
  'https://img.freepik.com/free-photo/gradient-stripes-with-shadows-abstract-composition_125964-4588.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-vector/abstract-blue-background_698452-1028.jpg?semt=ais_hybrid&w=740&q=80',
  'https://img.freepik.com/free-vector/blue-wall-with-black-background-that-says-blue_483537-4569.jpg?semt=ais_hybrid&w=740&q=80',
];

const ProductBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade out
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
        setFade(true);  // fade in new image
      }, 1000); // match with CSS transition duration
    }, 6000); // 5s visible + 1s fade transition

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="product-banner">
      <div
        className={`background-image ${fade ? 'fade-in' : 'fade-out'}`}
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />
      <div className="banner-content">
        <h3>DataNovel: Powering the Future of Digital Intelligence</h3>
        <p>Smart Web & AI Solutions That Drive Results</p>
      </div>
    </div>
  );
};

export default ProductBanner;
