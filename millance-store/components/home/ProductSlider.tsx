import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';
import type { Product } from '@/types';
import './ProductSlider.css';

interface ProductSliderProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products, viewAllLink }) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="product-slider-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="slider-controls">
          <button 
            className="slider-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="slider-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
          {viewAllLink && (
            <button 
              className="view-all-btn hide-mobile" 
              onClick={() => navigate(viewAllLink)}
            >
              View All
            </button>
          )}
        </div>
      </div>

      <div className="products-slider" ref={scrollRef}>
        {products.map((product) => (
          <div key={product.id} className="slider-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;
