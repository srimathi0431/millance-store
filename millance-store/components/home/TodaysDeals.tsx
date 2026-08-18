import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import ProductCard from '@/components/common/ProductCard';
import './TodaysDeals.css';

const TodaysDeals: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="todays-deals-section">
      <div className="section-header">
        <h2 className="section-title">Today's Best Deals</h2>
        <button className="view-all-btn" onClick={() => navigate('/deals')}>
          View All
        </button>
      </div>

      <div className="deals-grid">
        {MOCK_PRODUCTS.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default TodaysDeals;
