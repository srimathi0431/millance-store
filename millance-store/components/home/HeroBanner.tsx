import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_BANNERS } from '@/constants/mockData';
import './HeroBanner.css';

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-banner">
      <div className="banner-slider">
        <div 
          className="banner-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_BANNERS.map((banner) => (
            <div key={banner.id} className="banner-slide">
              <img 
                src={banner.image} 
                alt={banner.title}
                className="banner-image"
                loading="lazy"
              />
              <div className="banner-content glass">
                <h2 className="banner-title">{banner.title}</h2>
                <p className="banner-subtitle">{banner.subtitle}</p>
                <button 
                  className="banner-btn btn btn-accent"
                  onClick={() => banner.link && navigate(banner.link)}
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="banner-dots">
        {HERO_BANNERS.map((_, index) => (
          <button
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
