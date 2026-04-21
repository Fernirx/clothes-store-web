import React, { useState, useEffect } from 'react';
import './AdsBanner.css'; // Đảm bảo bạn đã import file CSS này

export default function AdsBanner({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showArrows, setShowArrows] = useState(false);


  useEffect(() => {
    let intervalId;
    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isAutoPlaying, images.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="ad-banner-container"
      data-aos="fade-up"
      onMouseEnter={() => {
        setIsAutoPlaying(false);
        setShowArrows(true);
      }}
      onMouseLeave={() => {
        setIsAutoPlaying(true);
        setShowArrows(false);
      }}
    >
      <div className="image-wrapper">
        {/* Render tất cả ảnh, dùng CSS để ẩn/hiện tạo hiệu ứng mờ dần */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Ad ${index + 1}`}
            className={`banner-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      {showArrows && (
        <div className="navigation-arrows">
          <button onClick={goToPrev} className="prev-btn">❮</button>
          <button onClick={goToNext} className="next-btn">❯</button>
        </div>
      )}
    </div>
  );
}