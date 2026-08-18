// ═══════════════════════════════════════════════════════════════════
// MILLANCE STORE - PREMIUM LUXURY NAVIGATION HEADER
// ═══════════════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, ShoppingCart, Heart, Bell, User, MapPin, 
  ChevronDown, Menu
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import './LuxuryHeader.css';

const LuxuryHeader: React.FC = () => {
  const navigate = useNavigate();
  const { 
    searchQuery, setSearchQuery, cartCount, wishlistCount, 
    unreadNotificationsCount, isAuthenticated 
  } = useApp();
  
  const [scrolled, setScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <motion.header 
        className={`luxury-header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Bar - Location & Utilities */}
        <div className="header-top-bar">
          <div className="container">
            <div className="top-bar-content">
              <button className="location-selector">
                <MapPin size={16} />
                <span>Chennai, Tamil Nadu 600001</span>
                <ChevronDown size={14} />
              </button>
              
              <div className="top-bar-actions">
                <button className="top-link">Become Seller</button>
                <span className="divider">|</span>
                <button className="top-link">Download App</button>
                <span className="divider">|</span>
                <button className="top-link">Help & Support</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="header-main-nav">
          <div className="container">
            <div className="nav-content">
              {/* Logo */}
              <div className="nav-logo" onClick={() => navigate('/')}>
                <h1>MILLANCE</h1>
                <span className="tagline">Premium Store</span>
              </div>

              {/* Search Bar */}
              <form className="search-container" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <Search size={20} />
                </button>
              </form>

              {/* Action Buttons */}
              <div className="nav-actions">
                <button className="action-btn" onClick={() => navigate('/wishlist')}>
                  <Heart size={22} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                </button>

                <button className="action-btn" onClick={() => navigate('/notifications')}>
                  <Bell size={22} />
                  <span>Alerts</span>
                  {unreadNotificationsCount > 0 && <span className="badge">{unreadNotificationsCount}</span>}
                </button>

                <button className="action-btn" onClick={() => navigate(isAuthenticated ? '/profile' : '/signin')}>
                  <User size={22} />
                  <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
                </button>

                <button className="action-btn cart-btn" onClick={() => navigate('/cart')}>
                  <ShoppingCart size={22} />
                  <span>Cart</span>
                  {cartCount > 0 && <span className="badge">{cartCount}</span>}
                </button>

                <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="header-categories-bar">
          <div className="container">
            <div className="categories-scroll">
              <button className="category-btn">Electronics</button>
              <button className="category-btn">Fashion</button>
              <button className="category-btn">Beauty</button>
              <button className="category-btn">Home & Kitchen</button>
              <button className="category-btn">Grocery</button>
              <button className="category-btn">Sports</button>
              <button className="category-btn">Books</button>
              <button className="category-btn">Toys</button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button onClick={() => setShowMobileMenu(false)}>×</button>
            </div>
            <nav className="mobile-menu-nav">
              <a href="/">Home</a>
              <a href="/categories">Categories</a>
              <a href="/cart">Cart ({cartCount})</a>
              <a href="/wishlist">Wishlist ({wishlistCount})</a>
              <a href="/orders">Orders</a>
              <a href="/profile">Profile</a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default LuxuryHeader;
