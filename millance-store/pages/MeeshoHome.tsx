// ═══════════════════════════════════════════════════════════════════
// MILLANCE STORE - MEESHO-STYLE HOME PAGE
// ═══════════════════════════════════════════════════════════════════
// Inspired by Meesho.com layout with Millance luxury branding
// Grid-based product display, category tiles, infinite scroll
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORIES } from '@/constants/mockData';
import { useApp } from '@/context/AppContext';
import './MeeshoHome.css';

const MeeshoHome: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="meesho-home">
      {/* Simple Header */}
      <header className="meesho-header">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo" onClick={() => navigate('/')}>
              <h1>Millance</h1>
              <p className="tagline">Premium Shopping</p>
            </div>

            {/* Search Bar */}
            <form className="search-container" onSubmit={handleSearch}>
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Try searching for 'iPhone', 'Rice', 'Fresh Vegetables'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </form>

            {/* Header Actions */}
            <div className="header-actions">
              <button className="header-btn" onClick={() => navigate('/wishlist')}>
                <Heart size={22} />
                <span>Wishlist</span>
              </button>
              <button className="header-btn" onClick={() => navigate('/cart')}>
                <ShoppingCart size={22} />
                <span>Cart</span>
              </button>
              <button className="header-btn profile-btn" onClick={() => navigate('/profile')}>
                <div className="avatar">M</div>
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Horizontal Scroll */}
      <section className="category-scroll-section">
        <div className="container">
          <div className="category-scroll">
            {CATEGORIES.map((category) => (
              <motion.button
                key={category.id}
                className="category-pill"
                onClick={() => navigate(`/categories/${category.id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Product Grid */}
      <section className="products-grid-section">
        <div className="container">
          {/* Section Header */}
          <div className="section-header">
            <h2 className="section-title">Products For You</h2>
            <p className="section-subtitle">{MOCK_PRODUCTS.length}+ Premium Products</p>
          </div>

          {/* Product Grid (Meesho Style) */}
          <div className="products-grid">
            {MOCK_PRODUCTS.map((product) => (
              <motion.div
                key={product.id}
                className="product-card-meesho"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`product-badge ${product.badge}`}>
                      {product.badge === 'bestseller' ? '🔥 Bestseller' : 
                       product.badge === 'new' ? '✨ New' : 
                       product.badge === 'sale' ? '⚡ Sale' : 
                       product.badge === 'exclusive' ? '👑 Exclusive' : ''}
                    </div>
                  )}

                  {/* Wishlist Heart */}
                  <button
                    className="wishlist-btn-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist(product);
                    }}
                  >
                    <Heart size={18} />
                  </button>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  
                  {/* Price Section */}
                  <div className="price-section">
                    <span className="current-price">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <>
                        <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                        <span className="discount-badge">{product.discount}% OFF</span>
                      </>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="rating-section">
                    <div className="rating-stars">
                      <Star size={14} fill="#C8A23A" color="#C8A23A" />
                      <span className="rating-text">{product.rating}</span>
                    </div>
                    <span className="reviews-count">({product.reviews.toLocaleString()})</span>
                  </div>

                  {/* Free Delivery Tag */}
                  <div className="delivery-tag">
                    <span>🚚 Free Delivery</span>
                  </div>
                </div>

                {/* Add to Cart Quick Action */}
                <button
                  className="quick-add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="load-more-section">
            <button className="load-more-btn">
              View More Products
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Why Shop with Millance */}
      <section className="why-millance-section">
        <div className="container">
          <h2 className="section-title">Why Shop With Millance?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>100% Genuine Products</h3>
              <p>Only authentic brands</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Free Delivery</h3>
              <p>On orders above ₹499</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>7 days return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>100% safe & secure</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeeshoHome;
