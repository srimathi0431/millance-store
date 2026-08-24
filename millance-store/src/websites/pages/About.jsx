import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Users, Award, TrendingUp, Heart, Shield } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-page">
      <MillanceHeader />

      {/* Hero Section */}
      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">About Millance Store</h1>
          <p className="footer-page-subtitle">
            An online shopping platform designed to bring quality products, trusted brands, attractive prices, and convenient delivery together in one place.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="footer-page-content">
        <div className="footer-page-card">
          
          {/* Who We Are */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Store size={28} />
              Who We Are
            </h2>
            <div className="footer-page-section-content">
              <p>
                Millance Store is your trusted online shopping destination, bringing together a carefully curated selection of quality products across multiple categories. From electronics and fashion to home essentials and beauty products, we offer everything you need in one convenient platform.
              </p>
              <p>
                Founded with the vision of making online shopping simple, secure, and satisfying, Millance Store combines the best of technology with customer-first service. We partner with verified sellers and trusted brands to ensure that every product meets our quality standards.
              </p>
              <p>
                Our platform is built to serve customers across India, with a focus on delivering exceptional value, reliable service, and a seamless shopping experience from browsing to delivery.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Award size={28} />
              What We Offer
            </h2>
            <div className="footer-page-grid">
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Wide Product Selection</h3>
                <p className="footer-page-box-content">
                  Thousands of products across electronics, fashion, beauty, home & kitchen, appliances, and more. Everything you need, all in one place.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Trusted Brands</h3>
                <p className="footer-page-box-content">
                  We partner with verified sellers and authentic brands to ensure you receive genuine products every time you shop with us.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Competitive Pricing</h3>
                <p className="footer-page-box-content">
                  Great deals, exclusive offers, and attractive discounts. We work hard to bring you the best prices on quality products.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Secure Payments</h3>
                <p className="footer-page-box-content">
                  Multiple payment options with industry-standard security. Shop with confidence knowing your transactions are protected.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Fast Delivery</h3>
                <p className="footer-page-box-content">
                  Reliable shipping with real-time tracking. Get your orders delivered quickly and conveniently to your doorstep.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Easy Returns</h3>
                <p className="footer-page-box-content">
                  Hassle-free return and refund policy. Not satisfied? We make returns simple and straightforward.
                </p>
              </div>
            </div>
          </div>

          {/* Why Shop With Us */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Heart size={28} />
              Why Shop With Us
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Customer First:</strong> Your satisfaction is our priority. We're here to help at every step of your shopping journey.</li>
                <li><strong>Quality Assurance:</strong> Every product is verified for authenticity and quality before it reaches you.</li>
                <li><strong>Transparent Pricing:</strong> No hidden charges. What you see is what you pay, with clear product descriptions and honest reviews.</li>
                <li><strong>Secure Shopping:</strong> Industry-standard encryption and secure payment gateways protect your personal and financial information.</li>
                <li><strong>Responsive Support:</strong> Our customer service team is ready to assist you with any questions or concerns.</li>
                <li><strong>Regular Updates:</strong> New products, fresh deals, and exciting offers added regularly to keep your shopping experience interesting.</li>
              </ul>
            </div>
          </div>

          {/* Our Mission */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <TrendingUp size={28} />
              Our Mission
            </h2>
            <div className="footer-page-section-content">
              <p>
                <strong>To make quality products accessible and affordable for everyone.</strong>
              </p>
              <p>
                We believe that great shopping experiences shouldn't be complicated or expensive. Our mission is to create a platform where customers can discover, compare, and purchase products with confidence, knowing they're getting genuine quality at fair prices.
              </p>
              <p>
                By continuously improving our platform, expanding our product range, and maintaining strong relationships with our sellers and customers, we aim to become India's most trusted online shopping destination.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Shield size={28} />
              Our Values
            </h2>
            <div className="footer-page-section-content">
              <div className="footer-page-grid">
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Integrity</h3>
                  <p className="footer-page-box-content">
                    We operate with honesty and transparency in every interaction, from product listings to customer service.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Trust</h3>
                  <p className="footer-page-box-content">
                    Building and maintaining trust with our customers and partners is the foundation of everything we do.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Excellence</h3>
                  <p className="footer-page-box-content">
                    We strive for excellence in product quality, service delivery, and customer satisfaction at every touchpoint.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Innovation</h3>
                  <p className="footer-page-box-content">
                    We continuously improve our platform and services using technology to enhance your shopping experience.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Responsibility</h3>
                  <p className="footer-page-box-content">
                    We take responsibility for our products, our promises, and our impact on customers and communities.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Customer Focus</h3>
                  <p className="footer-page-box-content">
                    Every decision we make is guided by one question: How does this benefit our customers?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Users size={28} />
              Join the Millance Community
            </h2>
            <div className="footer-page-section-content">
              <p>
                Whether you're shopping for yourself, your family, or your business, Millance Store is here to serve you. Join thousands of satisfied customers who trust us for their online shopping needs.
              </p>
              <p style={{ marginTop: '24px' }}>
                <button 
                  onClick={() => navigate('/')}
                  style={{
                    background: 'linear-gradient(135deg, #FF7A00, #FF3D8D)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginRight: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Start Shopping
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  style={{
                    background: 'white',
                    color: '#FF7A00',
                    border: '2px solid #FF7A00',
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
                  Contact Us
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
