import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/constants/mockData';
import './Categories.css';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="categories-section">
      <div className="section-header">
        <h2 className="section-title">Shop by Category</h2>
        <div className="scroll-buttons hide-mobile">
          <button 
            className="scroll-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            className="scroll-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="categories-scroll" ref={scrollRef}>
        {CATEGORIES.map((category) => (
          <button 
            key={category.id} 
            className="category-card"
            onClick={() => navigate(`/categories/${category.id}`)}
          >
            <div className="category-icon-wrapper">
              <span className="category-icon-large">{category.icon}</span>
            </div>
            <h3 className="category-name">{category.name}</h3>
            <p className="category-count">{category.count}+ Products</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
