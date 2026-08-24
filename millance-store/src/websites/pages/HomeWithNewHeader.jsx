import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Zap, Heart } from 'lucide-react';
import { ALL_PRODUCTS } from '@/constants/mockData';
import { useApp } from '@/context/AppContext';
import MillanceHeader, { PromoStrip } from '@/components/common/MillanceHeader';
import CategoryGrid from '@/components/home/CategoryGrid';
import Footer from '@/layouts/Footer';
import Toast from '@/components/common/Toast';
import WhatsAppButton from '@/components/WhatsAppButton';
import PremiumSections from '@/components/PremiumSections';
import '../pages/AmazonHome.css';

// Import carousel images
import carsol1 from '@/assets/images/carsol1.png';
import carsol2 from '@/assets/images/carsol2.png';
import carsol3 from '@/assets/images/carsol3.png';

const ProductCard = ({ product, navigate, addToCart, addToWishlist }) => (
  <div className="product-card-amazon" onClick={() => navigate(`/product/${product.id}`)}>
    <div className="product-image-wrapper">
      <img src={product.image} alt={product.name} className="product-img" />
      <button 
        className="wishlist-icon"
        onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}
      >
        <Heart size={18} />
      </button>
      {product.discount && (
        <div className="product-badge-amazon">{product.discount}% OFF</div>
      )}
    </div>
    <div className="product-details-amazon">
      <div className="product-name-amazon">{product.name}</div>
      <div className="product-rating-amazon">
        <div className="stars">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} color="#FFA500" />
          ))}
        </div>
        <span className="rating-count">(2,345)</span>
      </div>
      <div className="product-price-amazon">
        <span className="price-symbol">₹</span>
        <span className="price-whole">{product.price.toLocaleString()}</span>
        {product.originalPrice && (
          <>
            <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
            <span className="price-discount">({product.discount}% off)</span>
          </>
        )}
      </div>
      <div className="delivery-info-amazon">FREE Delivery</div>
      <button 
        className="add-to-cart-amazon"
        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
      >
        Add to Cart
      </button>
    </div>
  </div>
);

const HomeWithNewHeader = () => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useApp();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const banners = [
    { image: carsol1, title: 'Premium Jewelry Collection' },
    { image: carsol2, title: 'Luxury Accessories' },
    { image: carsol3, title: 'Designer Collection' },
  ];

  React.useEffect(() => {
    if (isCarouselPaused) return; // Pause when hovering
    
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000); // Auto-slide every 4 seconds
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  // Handle touch swipe for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }
    if (isRightSwipe) {
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
    }
    
    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`✓ ${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    setToastMessage(`♥ ${product.name} added to wishlist!`);
  };

  return (
    <div className="amazon-home">
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="success" 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* New Responsive Mobile-First Header */}
      <MillanceHeader />

      {/* Promotional Offer Strip - Above Carousel */}
      <PromoStrip />

      {/* Hero Banner Carousel */}
      <section className="hero-banner-section">
        <div 
          className="hero-carousel"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentBanner ? 'active' : ''}`}
            >
              <img src={banner.image} alt={banner.title} />
              <div className="hero-gradient"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="main-content">
        <div className="container-fluid">
          
          {/* Category Grid - First 4 Categories */}
          <CategoryGrid />

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
              {ALL_PRODUCTS.filter(p => p.discount).slice(0, 8).map((product) => (
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

          {/* Best Sellers Section */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <TrendingUp size={24} className="section-icon" />
                Best Sellers
              </h2>
              <button className="see-all-btn" onClick={() => navigate('/categories')}>
                See all
              </button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.slice(0, 6).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  navigate={navigate} 
                  addToCart={handleAddToCart} 
                  addToWishlist={handleAddToWishlist} 
                />
              ))}
            </div>
          </div>

          {/* Trending Products */}
          <div className="products-section">
            <div className="section-header-amazon">
              <h2 className="section-title-amazon">
                <Star size={24} className="section-icon" fill="currentColor" />
                Trending Now
              </h2>
              <button className="see-all-btn">See all</button>
            </div>
            <div className="products-carousel">
              {ALL_PRODUCTS.slice(6, 12).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  navigate={navigate} 
                  addToCart={handleAddToCart} 
                  addToWishlist={handleAddToWishlist} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Premium Sections */}
      <PremiumSections />

      {/* Footer - New 4-Column Footer */}
      <Footer />

      <WhatsAppButton />
    </div>
  );
};

export default HomeWithNewHeader;
