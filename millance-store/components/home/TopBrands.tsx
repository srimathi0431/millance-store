import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOP_BRANDS } from '@/constants/mockData';
import './TopBrands.css';

const TopBrands: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="top-brands-section">
      <div className="section-header">
        <h2 className="section-title">Top Brands</h2>
        <button className="view-all-btn" onClick={() => navigate('/brands')}>
          View All
        </button>
      </div>

      <div className="brands-grid">
        {TOP_BRANDS.map((brand) => (
          <div 
            key={brand.id} 
            className="brand-card"
            onClick={() => navigate(`/brand/${brand.id}`)}
          >
            <div className="brand-logo">
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="brand-logo-img"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const span = document.createElement('span');
                    span.className = 'brand-letter';
                    span.textContent = brand.name[0];
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
            <h3 className="brand-name">{brand.name}</h3>
            {brand.description && (
              <p className="brand-description">{brand.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopBrands;
