import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Package, MapPin, CheckCircle } from 'lucide-react';
import { FEATURED_STORES } from '@/constants/mockData';
import './FeaturedStores.css';

const FeaturedStores: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="featured-stores-section">
      <div className="section-header">
        <h2 className="section-title">Featured Stores</h2>
        <button className="view-all-btn" onClick={() => navigate('/stores')}>
          View All Stores
        </button>
      </div>

      <div className="stores-grid">
        {FEATURED_STORES.map((store) => (
          <div 
            key={store.id} 
            className="store-card"
            onClick={() => navigate(`/store/${store.id}`)}
          >
            {/* Store Banner */}
            <div className="store-banner">
              <img 
                src={store.banner} 
                alt={store.name}
                className="store-banner-img"
                loading="lazy"
              />
            </div>

            {/* Store Logo */}
            <div className="store-logo">
              <div className="logo-placeholder">
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="store-logo-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.textContent = store.name[0];
                  }}
                />
              </div>
              {store.verified && (
                <div className="verified-badge">
                  <CheckCircle size={16} fill="currentColor" />
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="store-info">
              <h3 className="store-name">{store.name}</h3>
              <p className="store-description">{store.description}</p>

              {/* Store Stats */}
              <div className="store-stats">
                <div className="stat">
                  <Star size={16} fill="currentColor" />
                  <span>{store.rating}</span>
                </div>
                <div className="stat">
                  <Package size={16} />
                  <span>{store.totalProducts}+ Products</span>
                </div>
              </div>

              {/* Location */}
              {store.location && (
                <div className="store-location">
                  <MapPin size={14} />
                  <span>{store.location}</span>
                </div>
              )}

              {/* Categories */}
              <div className="store-categories">
                {store.categories.slice(0, 3).map((category: string, index: number) => (
                  <span key={index} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>

              {/* Visit Button */}
              <button 
                className="visit-store-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/store/${store.id}`);
                }}
              >
                Visit Store
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedStores;
