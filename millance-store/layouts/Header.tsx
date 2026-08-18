import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Bell, User, MapPin, Menu, Package } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/constants/mockData';
import './Header.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { 
    searchQuery, 
    setSearchQuery, 
    cartCount, 
    wishlistCount, 
    unreadNotificationsCount,
    setShowLoginModal,
    setShowProfileMenu,
    setShowNotifications,
    isAuthenticated
  } = useApp();
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="location-picker">
              <MapPin size={18} />
              <span>Deliver to: <strong>Mumbai 400001</strong></span>
            </div>
            
            <div className="header-actions hide-mobile" style={{ display:'flex', gap:8, alignItems:'center' }}>
              <button className="header-action-btn">
                Become Seller
              </button>
              <button
                className="header-action-btn"
                onClick={() => navigate('/portal')}
                style={{
                  background: 'linear-gradient(135deg,#FF7A00,#FF3D8D,#7B2FF7)',
                  color: 'white', border: 'none', borderRadius: 6,
                  padding: '5px 12px', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.5px',
                }}
              >
                Admin / Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-main-content">
            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-btn hide-desktop"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="logo" onClick={() => navigate('/')}>
              <h1>Millance Store</h1>
              <p className="tagline">Everything You Need. One Trusted Store.</p>
            </div>

            {/* Search Bar */}
            <form className="search-bar" onSubmit={handleSearch}>
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search for products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            {/* Action Icons */}
            <div className="header-icons">
              <button className="icon-btn hide-mobile" onClick={() => navigate('/orders')}>
                <Package size={22} />
                <span>Orders</span>
              </button>
              
              <button className="icon-btn" onClick={() => navigate('/wishlist')}>
                <Heart size={22} />
                <span className="hide-mobile">Wishlist</span>
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </button>
              
              <button className="icon-btn" onClick={() => navigate('/cart')}>
                <ShoppingCart size={22} />
                <span className="hide-mobile">Cart</span>
                {cartCount > 0 && <span className="badge">{cartCount}</span>}
              </button>
              
              <button className="icon-btn hide-mobile" onClick={() => setShowNotifications(true)}>
                <Bell size={22} />
                {unreadNotificationsCount > 0 && <span className="badge">{unreadNotificationsCount}</span>}
              </button>
              
              <button 
                className="icon-btn" 
                onClick={() => isAuthenticated ? setShowProfileMenu(true) : setShowLoginModal(true)}
              >
                <User size={22} />
                <span className="hide-mobile">Profile</span>
              </button>

              {/* Admin / Vendor Portal Button — always visible */}
              <button
                onClick={() => navigate('/portal')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'linear-gradient(135deg, #FF7A00, #FF3D8D, #7B2FF7)',
                  color: 'white', border: 'none', borderRadius: 8,
                  padding: '7px 13px', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.3px', whiteSpace: 'nowrap',
                  boxShadow: '0 3px 10px rgba(123,47,247,0.35)',
                  flexShrink: 0,
                }}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin / Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Nav */}
      <div className="header-categories">
        <div className="container">
          <nav className="categories-nav">
            {CATEGORIES.slice(0, 8).map((category) => (
              <button 
                key={category.id} 
                className="category-btn"
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
            <button className="category-btn" onClick={() => navigate('/categories')}>
              <span className="category-icon">➕</span>
              <span>More</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <button className="mobile-menu-item" onClick={() => { navigate('/orders'); setShowMobileMenu(false); }}>
              <Package size={20} />
              <span>Orders</span>
            </button>
            <button className="mobile-menu-item" onClick={() => { navigate('/wishlist'); setShowMobileMenu(false); }}>
              <Heart size={20} />
              <span>Wishlist</span>
            </button>
            <button className="mobile-menu-item" onClick={() => { navigate('/cart'); setShowMobileMenu(false); }}>
              <ShoppingCart size={20} />
              <span>Cart</span>
            </button>
            <button className="mobile-menu-item" onClick={() => { setShowNotifications(true); setShowMobileMenu(false); }}>
              <Bell size={20} />
              <span>Notifications</span>
            </button>
            <button className="mobile-menu-item" onClick={() => { isAuthenticated ? setShowProfileMenu(true) : setShowLoginModal(true); setShowMobileMenu(false); }}>
              <User size={20} />
              <span>Profile</span>
            </button>
            <button className="mobile-menu-item become-seller" onClick={() => { navigate('/seller/register'); setShowMobileMenu(false); }}>
              Become Seller
            </button>
            <button className="mobile-menu-item" onClick={() => { navigate('/portal'); setShowMobileMenu(false); }}
              style={{ background:'linear-gradient(135deg,#FF7A00,#FF3D8D,#7B2FF7)', color:'white', fontWeight:700 }}>
              Admin / Vendor Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
