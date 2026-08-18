import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Company Section */}
          <div className="footer-section">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/careers'); }}>Careers</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/press'); }}>Press</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/blog'); }}>Blog</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact Us</a></li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="footer-section">
            <h3 className="footer-title">Help</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/shipping'); }}>Shipping</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/returns'); }}>Returns</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/track-order'); }}>Track Order</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/support'); }}>Support</a></li>
            </ul>
          </div>

          {/* Policy Section */}
          <div className="footer-section">
            <h3 className="footer-title">Policy</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/refund'); }}>Refund Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/security'); }}>Security</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/sitemap'); }}>Sitemap</a></li>
            </ul>
          </div>

          {/* Sell Section */}
          <div className="footer-section">
            <h3 className="footer-title">Sell With Us</h3>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/seller/register'); }}>Become a Seller</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/seller/guide'); }}>Seller Guide</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/seller/fees'); }}>Fees & Pricing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/seller/support'); }}>Seller Support</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/seller/dashboard'); }}>Seller Dashboard</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li>
                <Phone size={18} />
                <span>1800-123-4567</span>
              </li>
              <li>
                <Mail size={18} />
                <span>support@millancestore.com</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="social-links">
              <a href="#" className="social-btn" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-btn" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-btn" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-btn" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-logo">
            <h3>Millance Store</h3>
            <p>Everything You Need. One Trusted Store.</p>
          </div>
          
          <div className="footer-payment">
            <span>We Accept:</span>
            <div className="payment-methods">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">🏦</span>
              <span className="payment-icon">📱</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>&copy; 2026 Millance Store. All rights reserved.</p>
          <p className="footer-tagline">Built with ❤️ for shoppers everywhere</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
