import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Star, ShoppingCart, Heart } from 'lucide-react';
import { ALL_PRODUCTS } from '@/constants/mockData';
import { useApp } from '@/context/AppContext';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const Offers = () => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist } = useApp();

  // Get products with discounts
  const offersProducts = ALL_PRODUCTS.filter(product => product.discount && product.discount > 0);

  return (
    <div className="footer-page">
      <MillanceHeader />

      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Offers & Deals</h1>
          <p className="footer-page-subtitle">
            Save More on Your Favorite Products
          </p>
        </div>
      </div>

      <div className="footer-page-content">
        
        {offersProducts.length > 0 ? (
          <>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <Tag size={32} style={{ color: '#FF7A00' }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#0F172A', 
                  margin: '0 0 8px 0' 
                }}>
                  {offersProducts.length} Active Offers
                </h2>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#64748B', 
                  margin: '0' 
                }}>
                  Limited time deals on quality products. Shop now and save!
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {offersProducts.map((product) => (
                <div 
                  key={product.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  {/* Discount Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#EF4444',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    zIndex: 2,
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                  }}>
                    {product.discount}% OFF
                  </div>

                  {/* Wishlist Button */}
                  <button
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist(product);
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#FFF5EB'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <Heart size={20} color="#FF7A00" />
                  </button>

                  {/* Product Image */}
                  <div style={{
                    width: '100%',
                    height: '240px',
                    background: '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                  }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '20px' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#0F172A',
                      marginBottom: '8px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4',
                      minHeight: '44px'
                    }}>
                      {product.name}
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: '#64748B',
                      marginBottom: '12px'
                    }}>
                      {product.category}
                    </div>

                    {/* Rating */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '12px'
                    }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < 4 ? '#FFA500' : 'none'} 
                          color="#FFA500" 
                        />
                      ))}
                      <span style={{ 
                        fontSize: '13px', 
                        color: '#64748B',
                        marginLeft: '4px'
                      }}>
                        (4.0)
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#FF7A00'
                        }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span style={{
                            fontSize: '16px',
                            color: '#94A3B8',
                            textDecoration: 'line-through'
                          }}>
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <div style={{
                          fontSize: '13px',
                          color: '#10B981',
                          fontWeight: '600',
                          marginTop: '4px'
                        }}>
                          You save ₹{(product.originalPrice - product.price).toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #FF7A00, #FF3D8D)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 122, 0, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="footer-page-card">
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <Tag size={64} style={{ color: '#E2E8F0', margin: '0 auto 24px' }} />
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#0F172A',
                margin: '0 0 12px 0'
              }}>
                No Active Offers Right Now
              </h2>
              <p style={{
                fontSize: '17px',
                color: '#64748B',
                margin: '0 0 32px 0',
                lineHeight: '1.6'
              }}>
                Check back soon for new deals.
              </p>
              <button 
                onClick={() => navigate('/products')}
                style={{
                  background: 'linear-gradient(135deg, #FF7A00, #FF3D8D)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Browse All Products
              </button>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Offers;
