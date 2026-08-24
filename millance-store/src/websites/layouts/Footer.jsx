import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="millance-footer">
      <div className="container">
        {/* Brand */}
        <div className="footer-brand">
          <h2 className="footer-brand-name">MILLANCE</h2>
          <p className="footer-brand-tagline">Everything You Need, Delivered</p>
        </div>

        {/* 4 Columns - Always Visible */}
        <div className="footer-columns">
          {/* ABOUT */}
          <div className="footer-column">
            <h3 className="footer-column-title">ABOUT</h3>
            <ul className="footer-column-links">
              <li><button onClick={() => navigate('/about')}>About Us</button></li>
              <li><button onClick={() => navigate('/careers')}>Careers</button></li>
              <li><button onClick={() => navigate('/privacy-policy')}>Privacy</button></li>
              <li><button onClick={() => navigate('/terms-and-conditions')}>Terms</button></li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="footer-column">
            <h3 className="footer-column-title">CUSTOMER CARE</h3>
            <ul className="footer-column-links">
              <li><button onClick={() => navigate('/contact')}>Contact Us</button></li>
              <li><button onClick={() => navigate('/help-center')}>Help Center</button></li>
              <li><button onClick={() => navigate('/returns')}>Returns</button></li>
              <li><button onClick={() => navigate('/shipping')}>Shipping</button></li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h3 className="footer-column-title">QUICK LINKS</h3>
            <ul className="footer-column-links">
              <li><button onClick={() => navigate('/')}>Home</button></li>
              <li><button onClick={() => navigate('/products')}>Products</button></li>
              <li><button onClick={() => navigate('/categories')}>Categories</button></li>
              <li><button onClick={() => navigate('/offers')}>Offers</button></li>
            </ul>
          </div>

          {/* FOLLOW US */}
          <div className="footer-column">
            <h3 className="footer-column-title">FOLLOW US</h3>
            <ul className="footer-column-links">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram size={14} /> Instagram
                </a>
              </li>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook size={14} /> Facebook
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube size={14} /> YouTube
                </a>
              </li>
              <li>
                <a href="https://wa.me" target="_blank" rel="noopener noreferrer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <span className="footer-copyright-text">© MILLANCE STORE</span>
          <span className="footer-copyright-divider"></span>
          <span className="footer-copyright-rights">All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
