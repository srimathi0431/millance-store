// ═══════════════════════════════════════════════════════════════════
// MILLANCE STORE - AMAZON INDIA STYLE HOME PAGE
// ═══════════════════════════════════════════════════════════════════
// Exact Amazon India layout with Millance premium branding
// ═══════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, MapPin, Menu, ChevronLeft, ChevronRight,
  Heart, Star, TrendingUp, Zap
} from 'lucide-react';
import { ALL_PRODUCTS } from '@/constants/mockData';
import { useApp } from '@/context/AppContext';
import SearchAutocomplete from '@/components/common/SearchAutocomplete';
import Toast from '@/components/common/Toast';
import WhatsAppButton from '@/components/WhatsAppButton';
import PremiumSections from '@/components/PremiumSections';
import './AmazonHome.css';

// Import carousel images
import carsol1 from '@/assets/images/carsol1.png';
import carsol2 from '@/assets/images/carsol2.png';
import carsol3 from '@/assets/images/carsol3.png';
import logoImage from '@/assets/images/image.png';

const AmazonHome: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, cartCount } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navItemsRef = React.useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const banners = [
    {
      image: carsol1,
      title: 'Premium Jewelry Collection',
      subtitle: 'Exclusive Designs | Limited Edition',
    },
    {
      image: carsol2,
      title: 'Luxury Accessories',
      subtitle: 'Trending Styles | Best Offers',
    },
    {
      image: carsol3,
      title: 'Designer Collection',
      subtitle: 'Elegant & Affordable | Shop Now',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Horizontal scroll with mouse wheel + Shift
  useEffect(() => {
    const navItems = navItemsRef.current;
    if (!navItems) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if horizontal scrolling is possible
      if (navItems.scrollWidth > navItems.clientWidth) {
        // Enable horizontal scroll with Shift + wheel OR just wheel when over nav
        if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          navItems.scrollLeft += e.deltaY || e.deltaX;
        }
      }
    };

    navItems.addEventListener('wheel', handleWheel, { passive: false });
    return () => navItems.removeEventListener('wheel', handleWheel);
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setToastMessage(`✓ ${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product: any) => {
    addToWishlist(product);
    setToastMessage(`♥ ${product.name} added to wishlist!`);
  };

  return (
    <div className="amazon-home">
      {/* Toast Notification */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success" 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* Amazon-Style Header */}
      <header className="amazon-header">
        <div className="header-top">
          <div className="container-fluid">
            <div className="header-main">
              {/* Logo */}
              <div className="logo-section" onClick={() => navigate('/')}>
                <img 
                  src={logoImage} 
                  alt="Millance" 
                  className="logo-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.logo-text')) {
                      const textLogo = document.createElement('div');
                      textLogo.className = 'logo-text-fallback';
                      textLogo.innerHTML = '<h1 class="logo-text">Millance</h1><span class="logo-domain">.in</span>';
                      parent.appendChild(textLogo);
                    }
                  }}
                />
              </div>

              {/* Delivery Location */}
              <button className="delivery-location">
                <MapPin size={18} />
                <div className="location-text">
                  <span className="location-label">Deliver to</span>
                  <span className="location-name">Chennai 600001</span>
                </div>
              </button>

              {/* Search Bar with Autocomplete */}
              <SearchAutocomplete className="search-section" />

              {/* Right Actions */}
              <div className="header-actions">
                <button className="header-link" onClick={() => navigate('/signin')}>
                  <span className="link-label">Hello, sign in</span>
                  <span className="link-title">Account & Lists</span>
                </button>
                <button className="header-link" onClick={() => navigate('/orders')}>
                  <span className="link-label">Returns</span>
                  <span className="link-title">& Orders</span>
                </button>
                <button className="cart-btn" onClick={() => navigate('/cart')}>
                  <ShoppingCart size={32} />
                  <span className="cart-count">{cartCount}</span>
                  <span className="cart-text">Cart</span>
                </button>

                {/* Admin / Vendor Portal Button */}
                <button
                  onClick={() => navigate('/portal')}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 2,
                    background: 'linear-gradient(135deg, #FF7A00, #FF3D8D, #7B2FF7)',
                    color: 'white', border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: 8, padding: '6px 14px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 2px 10px rgba(123,47,247,0.4)',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.9, letterSpacing: '0.3px' }}>Portal</span>
                  <span style={{ fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap' }}>Admin / Vendor</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="header-nav">
          <div className="container-fluid">
            <div className="nav-items" ref={navItemsRef}>
              <button 
                className={`nav-item all-menu ${activeCategory === 'all' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('all'); navigate('/categories'); }}
              >
                <Menu size={20} />
                <span>All</span>
              </button>
              <button 
                className={`nav-item ${activeCategory === 'deals' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('deals'); navigate('/deals'); }}
              >
                Today's Deals
              </button>
              <button 
                className={`nav-item ${activeCategory === 'mobiles' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('mobiles'); navigate('/categories/mobiles'); }}
              >
                Mobiles
              </button>
              <button 
                className={`nav-item ${activeCategory === 'electronics' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('electronics'); navigate('/categories/electronics'); }}
              >
                Electronics
              </button>
              <button 
                className={`nav-item ${activeCategory === 'fashion' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('fashion'); navigate('/categories/fashion'); }}
              >
                Fashion
              </button>
              <button 
                className={`nav-item ${activeCategory === 'beauty' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('beauty'); navigate('/categories/beauty'); }}
              >
                Beauty
              </button>
              <button 
                className={`nav-item ${activeCategory === 'grocery' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('grocery'); navigate('/categories/grocery'); }}
              >
                Grocery
              </button>
              <button 
                className={`nav-item ${activeCategory === 'home' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('home'); navigate('/categories/home'); }}
              >
                Home & Kitchen
              </button>
              <button 
                className={`nav-item ${activeCategory === 'appliances' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('appliances'); navigate('/categories/appliances'); }}
              >
                Appliances
              </button>
              <button 
                className={`nav-item ${activeCategory === 'toys' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('toys'); navigate('/categories/toys'); }}
              >
                Toys & Games
              </button>
              <button 
                className={`nav-item ${activeCategory === 'sports' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('sports'); navigate('/categories/sports'); }}
              >
                Sports & Fitness
              </button>
              <button 
                className={`nav-item ${activeCategory === 'books' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('books'); navigate('/categories/books'); }}
              >
                Books
              </button>
              <button 
                className={`nav-item ${activeCategory === 'jewelry' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('jewelry'); navigate('/categories/jewelry'); }}
              >
                Jewelry
              </button>
              <button 
                className={`nav-item ${activeCategory === 'automotive' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('automotive'); navigate('/categories/automotive'); }}
              >
                Automotive
              </button>
              <button 
                className={`nav-item ${activeCategory === 'pet-supplies' ? 'active' : ''}`} 
                onClick={() => { setActiveCategory('pet-supplies'); navigate('/categories/pet-supplies'); }}
              >
                Pet Supplies
              </button>
              <button 
                className="nav-item seller-btn" 
                onClick={() => navigate('/sell')}
              >
                Become a Seller
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner Strip */}
      <div className="promo-banner-strip">
        <div className="container-fluid">
          <div className="promo-content">
            <div className="promo-item">
              <span className="promo-icon">🎉</span>
              <span className="promo-text">Grand Opening Sale - Up to 70% OFF</span>
            </div>
            <div className="promo-divider">|</div>
            <div className="promo-item">
              <span className="promo-icon">🚚</span>
              <span className="promo-text">Free Delivery on Orders Above ₹499</span>
            </div>
            <div className="promo-divider">|</div>
            <div className="promo-item">
              <span className="promo-icon">💳</span>
              <span className="promo-text">Extra 10% Cashback on Card Payments</span>
            </div>
            <div className="promo-divider">|</div>
            <div className="promo-item">
              <span className="promo-icon">⚡</span>
              <span className="promo-text">Flash Sale Live Now - Limited Time Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <section className="hero-banner-section">
        <div className="hero-carousel">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentBanner ? 'active' : ''}`}
            >
              <img 
                src={banner.image} 
                alt={banner.title}
              />
              <div className="hero-gradient"></div>
            </div>
          ))}
          <button
            className="carousel-btn prev"
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="carousel-btn next"
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <div className="container-fluid">
          {/* Category Grid Cards (Amazon Style 8 Cards) - Diverse Product Categories */}
          <div className="category-grid-section">
            {[
              { 
                title: 'Beauty & Personal Care', 
                items: [
                  { name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Face Wash', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/beauty' 
              },
              { 
                title: "Women's Fashion", 
                items: [
                  { name: 'Dresses', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Tops & Shirts', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Ethnic Wear', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/13' 
              },
              { 
                title: "Men's Fashion", 
                items: [
                  { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Formal Shirts', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/12' 
              },
              { 
                title: 'Fashion Accessories', 
                items: [
                  { name: 'Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/accessories' 
              },
              { 
                title: 'Grocery & Fresh', 
                items: [
                  { name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Dairy Products', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Packaged Food', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/grocery' 
              },
              { 
                title: 'Home & Kitchen', 
                items: [
                  { name: 'Kitchen Appliances', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Cookware', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/home' 
              },
              { 
                title: 'Mobiles & Tablets', 
                items: [
                  { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1592286927505-2fd27df8db82?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4bcaaa337?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Cases & Covers', image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Power Banks', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/mobiles' 
              },
              { 
                title: 'Electronics & TVs', 
                items: [
                  { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Smart TVs', image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&q=80&auto=format' },
                  { name: 'Cameras', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop&q=80&auto=format' }
                ], 
                link: '/categories/electronics' 
              },
            ].map((cat, idx) => (
              <div key={idx} className="category-card" onClick={() => navigate(cat.link)}>
                <h3 className="category-card-title">{cat.title}</h3>
                <div className="category-grid-items">
                  {cat.items.map((item, i) => (
                    <div key={i} className="category-item">
                      <div className="category-item-image">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="category-real-image"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error(`Failed to load image for ${item.name}`);
                            e.currentTarget.style.opacity = '0.5';
                          }}
                        />
                      </div>
                      <span className="category-item-name">{item.name}</span>
                    </div>
                  ))}
                </div>
                <button className="see-more-link">See all products</button>
              </div>
            ))}
          </div>

          {/* Today's Deals */}
          <div className="deals-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Zap size={24} className="section-icon" />
                Today's Deals
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/deals')}>
                See all deals
              </button>
            </div>
            <div className="horizontal-scroll">
              {ALL_PRODUCTS.filter(p => p.discount).map((product) => (
                <div key={product.id} className="deal-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="deal-badge">{product.discount}% off</div>
                  <img src={product.image} alt={product.name} className="deal-image" />
                  <div className="deal-info">
                    <span className="deal-label">Deal of the day</span>
                    <span className="deal-price">₹{product.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Sellers in Mobiles (REDUCED - Only 4 products) */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <TrendingUp size={24} className="section-icon" />
                Best Sellers in Mobiles
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/mobiles')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Mobiles').slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Beauty & Personal Care */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Star size={24} className="section-icon" fill="currentColor" />
                Beauty & Personal Care
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/beauty')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Beauty').slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Fashion Collection */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <TrendingUp size={24} className="section-icon" />
                Trending in Fashion
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/fashion')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === "Men's Clothing" || p.category === "Women's Clothing" || p.category === "Shoes" || p.category === "Bags").slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Fresh Fruits & Vegetables */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Zap size={24} className="section-icon" />
                Fresh Fruits & Vegetables
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/fresh')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Fruits' || p.category === 'Vegetables' || p.category === 'Fresh').slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Grocery Essentials */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Star size={24} className="section-icon" fill="currentColor" />
                Grocery Essentials
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/grocery')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Grocery' || p.category === 'Snacks' || p.category === 'Dairy' || p.category === 'Bakery').slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Home & Kitchen */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <TrendingUp size={24} className="section-icon" />
                Home & Kitchen Essentials
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/home')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Kitchen Appliances' || p.category === 'Home Appliances' || p.category === 'Furniture').slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Laptops (REDUCED - Only 4 products) */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Star size={24} className="section-icon" fill="currentColor" />
                Laptops & Computers
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/laptops')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Laptops').slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Books & Stationery */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <TrendingUp size={24} className="section-icon" />
                Books & Stationery
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/books')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Books').slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Sports & Fitness */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Zap size={24} className="section-icon" />
                Sports & Fitness
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/sports')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Sports' || p.category === 'Health').slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Toys & Games */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Star size={24} className="section-icon" fill="currentColor" />
                Toys & Games
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories/toys')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.filter(p => p.category === 'Toys').slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>

          {/* Recommended For You */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Heart size={24} className="section-icon" />
                Recommended For You
              </h2>
              <button className="see-all-btn">See all</button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.slice(10, 16).map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} addToCart={handleAddToCart} addToWishlist={handleAddToWishlist} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Sections - Gold Vault & Newsletter */}
      <PremiumSections />

      {/* Millance Footer */}
      <footer className="amazon-footer">
        <div className="footer-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top
        </div>
        <div className="footer-content">
          <div className="container-fluid">
            {/* Footer Description */}
            <div className="footer-about">
              <img 
                src={logoImage} 
                alt="Millance" 
                className="footer-logo-image"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <p className="footer-tagline">
                Tamil Nadu's Premium Marketplace for fresh groceries, premium electronics, and daily essentials. Delivering quality at your doorstep.
              </p>
              <div className="footer-social-icons">
                <button className="social-icon" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="social-icon" aria-label="Twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="social-icon" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </button>
                <button className="social-icon" aria-label="YouTube">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Footer Columns */}
            <div className="footer-columns">
              <div className="footer-column">
                <h4>Millance Store</h4>
                <ul>
                  <li><button onClick={() => navigate('/about')}>About Us</button></li>
                  <li><button onClick={() => navigate('/products')}>All Products</button></li>
                  <li><button onClick={() => navigate('/membership')}>Gold Vault Rewards</button></li>
                  <li><button onClick={() => navigate('/careers')}>Careers</button></li>
                  <li><button onClick={() => navigate('/press')}>Press & Media</button></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Help & Support</h4>
                <ul>
                  <li><button onClick={() => navigate('/contact')}>Contact Us</button></li>
                  <li><button onClick={() => navigate('/faq')}>FAQ</button></li>
                  <li><button onClick={() => navigate('/shipping')}>Shipping Policy</button></li>
                  <li><button onClick={() => navigate('/returns')}>Returns & Refunds</button></li>
                  <li><button onClick={() => navigate('/terms')}>Terms & Conditions</button></li>
                  <li><button onClick={() => navigate('/privacy')}>Privacy Policy</button></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4>Customer Service</h4>
                <ul className="footer-contact-info">
                  <li className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>124, Omalur Main Road, Salem, Tamil Nadu 636004</span>
                  </li>
                  <li className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                    <span>1800 123 4567</span>
                  </li>
                  <li className="contact-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="contact-icon">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>support@millance.in</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-brand-name">MILLANCE</p>
          <p className="footer-copyright">© 2025 Millance Store | Tamil Nadu, India. All rights reserved.</p>
          <div className="footer-bottom-links">
            <button onClick={() => navigate('/privacy')}>Privacy Policy</button>
            <span className="link-separator">•</span>
            <button onClick={() => navigate('/terms')}>Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
};

// Product Card Component (Amazon Style)
const ProductCard: React.FC<any> = ({ product, navigate, addToCart, addToWishlist }) => {
  return (
    <motion.div
      className="product-card-amazon"
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-img" />
        <button
          className="wishlist-icon"
          onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}
        >
          <Heart size={20} />
        </button>
        {product.badge && (
          <span className={`product-badge-amazon ${product.badge}`}>
            {product.badge === 'bestseller' && 'Bestseller'}
            {product.badge === 'new' && 'New'}
            {product.badge === 'sale' && 'Limited Deal'}
          </span>
        )}
      </div>
      <div className="product-details-amazon">
        <h3 className="product-name-amazon">{product.name}</h3>
        <div className="product-rating-amazon">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating) ? '#C8A23A' : '#E5E5E5'} color="transparent" />
            ))}
          </div>
          <span className="rating-count">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-price-amazon">
          <span className="price-symbol">₹</span>
          <span className="price-whole">{Math.floor(product.price).toLocaleString()}</span>
          {product.originalPrice && (
            <>
              <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
              <span className="price-discount">({product.discount}% off)</span>
            </>
          )}
        </div>
        <div className="delivery-info-amazon">Get it by <strong>Tomorrow</strong></div>
        <button
          className="add-to-cart-amazon"
          onClick={(e) => { 
            e.stopPropagation(); 
            console.log('Add to cart clicked:', product.name);
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default AmazonHome;
