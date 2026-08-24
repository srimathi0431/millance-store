import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Heart, ShoppingCart, Search, X, Home, 
  Package, User, Store, Shield, ChevronRight, MapPin
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SearchAutocomplete from './SearchAutocomplete';
import logoImage from '@/assets/images/image.png';
import './MillanceHeader.css';

const CATEGORIES = [
  { id: 'mobiles', name: 'Mobiles' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'grocery', name: 'Grocery' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'appliances', name: 'Appliances' },
  { id: 'toys', name: 'Toys' },
  { id: 'sports', name: 'Sports' },
  { id: 'books', name: 'Books' }
];

const PROMO_MESSAGES = [
  { icon: '🎉', text: 'Grand Opening Sale — Up to 70% OFF' },
  { icon: '🚚', text: 'Free Delivery on Orders Above ₹499' },
  { icon: '💳', text: 'Extra 10% Cashback on Card Payments' },
  { icon: '⚡', text: 'Flash Sale Live Now — Limited Time' }
];

const MobileSideDrawer = ({ isOpen, onClose, navigate }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`drawer-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      
      {/* Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-logo">
            <img src={logoImage} alt="Millance" className="drawer-logo-img" />
            <span className="drawer-logo-text">MILLANCE</span>
          </div>
          <button 
            className="drawer-close" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="drawer-content">
          {/* Main Navigation */}
          <nav className="drawer-nav">
            <button className="drawer-item" onClick={() => { navigate('/'); onClose(); }}>
              <Home size={20} />
              <span>Home</span>
            </button>
            <button className="drawer-item" onClick={() => { navigate('/products'); onClose(); }}>
              <Package size={20} />
              <span>All Products</span>
            </button>
          </nav>

          {/* Categories */}
          <div className="drawer-section">
            <div className="drawer-section-title">Categories</div>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                className="drawer-subitem" 
                onClick={() => { navigate(`/categories/${cat.id}`); onClose(); }}
              >
                {cat.name}
                <ChevronRight size={16} />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="drawer-divider" />

          {/* Account Section */}
          <nav className="drawer-nav">
            <button className="drawer-item" onClick={() => { navigate('/signin'); onClose(); }}>
              <User size={20} />
              <span>My Account</span>
            </button>
            <button className="drawer-item" onClick={() => { navigate('/orders'); onClose(); }}>
              <Package size={20} />
              <span>My Orders</span>
            </button>
            <button className="drawer-item" onClick={() => { navigate('/wishlist'); onClose(); }}>
              <Heart size={20} />
              <span>Wishlist</span>
            </button>
          </nav>

          {/* Divider */}
          <div className="drawer-divider" />

          {/* Admin & Vendor */}
          <nav className="drawer-nav">
            <button className="drawer-item portal-item" onClick={() => { navigate('/admin/login'); onClose(); }}>
              <Shield size={20} />
              <span>Admin Login</span>
              <ChevronRight size={16} className="ml-auto" />
            </button>
            <button className="drawer-item portal-item" onClick={() => { navigate('/vendor/login'); onClose(); }}>
              <Store size={20} />
              <span>Vendor Login</span>
              <ChevronRight size={16} className="ml-auto" />
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

const PromoStrip = () => {
  return (
    <div className="promo-strip">
      <div className="promo-content">
        {PROMO_MESSAGES.map((promo, idx) => (
          <React.Fragment key={idx}>
            <div className="promo-item">
              <span className="promo-icon">{promo.icon}</span>
              <span className="promo-text">{promo.text}</span>
            </div>
            {idx < PROMO_MESSAGES.length - 1 && (
              <div className="promo-divider">|</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const CategoryNav = ({ activeCategory, onCategoryClick }) => {
  return (
    <div className="category-nav-wrapper">
      <div className="category-nav">
        <button 
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryClick('all')}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryClick(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const MobileHeader = ({ onMenuClick, navigate, cartCount, wishlistCount }) => {
  return (
    <div className="mobile-header">
      <button 
        className="mobile-icon-btn hamburger"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <div className="mobile-logo" onClick={() => navigate('/')}>
        <img 
          src={logoImage} 
          alt="Millance" 
          className="mobile-logo-img"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.querySelector('.mobile-logo-text')) {
              const text = document.createElement('span');
              text.className = 'mobile-logo-text';
              text.textContent = 'MILLANCE';
              parent.appendChild(text);
            }
          }}
        />
      </div>

      <div className="mobile-actions">
        <button 
          className="mobile-icon-btn"
          onClick={() => navigate('/wishlist')}
          aria-label="Wishlist"
        >
          <Heart size={22} />
          {wishlistCount > 0 && (
            <span className="mobile-badge wishlist-badge">{wishlistCount}</span>
          )}
        </button>

        <button 
          className="mobile-icon-btn"
          onClick={() => navigate('/cart')}
          aria-label="Cart"
        >
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="mobile-badge cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </div>
  );
};

const DesktopHeader = ({ navigate, cartCount, wishlistCount }) => {
  return (
    <div className="desktop-header">
      <div className="desktop-header-main">
        {/* Logo */}
        <div className="desktop-logo" onClick={() => navigate('/')}>
          <img 
            src={logoImage} 
            alt="Millance Store" 
            className="desktop-logo-img"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.desktop-logo-text')) {
                const text = document.createElement('div');
                text.className = 'desktop-logo-text';
                text.innerHTML = '<span style="font-size:32px;font-weight:800;color:white;">MILLANCE</span>';
                parent.appendChild(text);
              }
            }}
          />
        </div>

        {/* Location */}
        <button className="desktop-location">
          <MapPin size={20} />
          <div>
            <div className="location-label">Deliver to</div>
            <div className="location-name">Chennai 600001</div>
          </div>
        </button>

        {/* Search - Full Width */}
        <div className="desktop-search-wrapper">
          <SearchAutocomplete />
        </div>

        {/* Actions */}
        <div className="desktop-actions">
          <button className="desktop-link" onClick={() => navigate('/signin')}>
            <span className="link-label">Hello, sign in</span>
            <span className="link-title">Account & Lists</span>
          </button>
          <button className="desktop-link" onClick={() => navigate('/orders')}>
            <span className="link-label">Returns</span>
            <span className="link-title">& Orders</span>
          </button>
          <button className="desktop-cart" onClick={() => navigate('/cart')}>
            <ShoppingCart size={30} />
            {cartCount > 0 && <span className="desktop-cart-count">{cartCount}</span>}
            <span className="cart-text">Cart</span>
          </button>
          <button className="desktop-portal-btn" onClick={() => navigate('/portal')}>
            <span className="portal-label">PORTAL</span>
            <span className="portal-title">Admin / Vendor</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileSearchBar = () => {
  return (
    <div className="mobile-search-wrapper">
      <SearchAutocomplete />
    </div>
  );
};

const MillanceHeader = () => {
  const navigate = useNavigate();
  const { cartCount, wishlistCount } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      navigate('/categories');
    } else {
      navigate(`/categories/${categoryId}`);
    }
  };

  return (
    <header className="millance-header">
      {/* Mobile Side Drawer */}
      <MobileSideDrawer 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        navigate={navigate}
      />

      {/* Main Header - Mobile or Desktop */}
      <div className="header-main-wrapper">
        {isMobile ? (
          <>
            <MobileHeader 
              onMenuClick={() => setDrawerOpen(true)}
              navigate={navigate}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
            />
            <MobileSearchBar />
          </>
        ) : (
          <DesktopHeader 
            navigate={navigate}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
          />
        )}
      </div>

      {/* Category Navigation */}
      <CategoryNav 
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
    </header>
  );
};

export { PromoStrip };
export default MillanceHeader;
