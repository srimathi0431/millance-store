import React, { useState } from 'react';
import { Mail, Bell, CheckCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import './NewsletterSection.css';

const NewsletterSection= () => {
 const [email, setEmail] = useState('');
 const [loading, setLoading] = useState(false);
 const [subscribed, setSubscribed] = useState(false);
 const [error, setError] = useState('');

 const handleSubscribe = async (e) => {
 e.preventDefault();
 setError('');

 // Email validation
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!email) {
 setError('Please enter your email address');
 return;
 }
 if (!emailRegex.test(email)) {
 setError('Please enter a valid email address');
 return;
 }

 setLoading(true);

 // Simulate API call
 setTimeout(() => {
 // Save to localStorage
 const subscribers = JSON.parse(localStorage.getItem('millance-subscribers') || '[]');
 if (!subscribers.includes(email)) {
 subscribers.push(email);
 localStorage.setItem('millance-subscribers', JSON.stringify(subscribers));
 }

 setLoading(false);
 setSubscribed(true);
 setEmail('');

 // Reset after 5 seconds
 setTimeout(() => {
 setSubscribed(false);
 }, 5000);
 }, 1500);
 };

 return (
 <motion.div 
 className="newsletter-card"
 initial={{ opacity: 0, y: 50 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ duration: 0.6, delay: 0.2 }}
 >
 <div className="newsletter-icon-wrapper">
 <Bell size={48} className="newsletter-icon" />
 </div>
 
 <div className="newsletter-content">
 <h2 className="newsletter-title">Subscribe to Millance Deals</h2>
 <p className="newsletter-subtitle">Never Miss Amazing Offers</p>
 <p className="newsletter-description">
 Subscribe to receive exclusive deals, flash sale alerts, new arrivals, seasonal offers, 
 coupon codes, and personalized product recommendations directly to your inbox.
 </p>

 {!subscribed ? (
 <form onSubmit={handleSubscribe} className="newsletter-form">
 <div className="newsletter-input-wrapper">
 <Mail size={20} className="input-icon" />
 <input
 type="email"
 placeholder="Enter your email address"
 value={email}
 onChange={(e) => {
 setEmail(e.target.value);
 setError('');
 }}
 className={`newsletter-input ${error ? 'error' : ''}`}
 disabled={loading}
 />
 </div>
 {error && <p className="error-message">{error}</p>}
 
 <button 
 type="submit" 
 className="btn-newsletter-primary"
 disabled={loading}
 >
 {loading ? (
 <>
 <Loader size={20} className="spinner" />
 Subscribing...
 </>
 ) : (
 <>
 <Bell size={20} />
 Subscribe Now
 </>
 )}
 </button>
 </form>
 ) : (
 <motion.div 
 className="newsletter-success"
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 200, damping: 15 }}
 >
 <CheckCircle size={48} className="success-icon" />
 <h3>Thank you for subscribing!</h3>
 <p>You'll receive the latest offers and updates from Millance.</p>
 </motion.div>
 )}

 <div className="newsletter-features">
 <span className="feature-tag">✨ Exclusive Deals</span>
 <span className="feature-tag">⚡ Flash Sales</span>
 <span className="feature-tag">🎁 Personalized Offers</span>
 </div>
 </div>

 <div className="newsletter-decoration"></div>
 </motion.div>
 );
};

export default NewsletterSection;
