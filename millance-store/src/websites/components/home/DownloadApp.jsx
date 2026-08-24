import React from 'react';
import { Smartphone, Download } from 'lucide-react';
import './DownloadApp.css';

const DownloadApp= () => {
 return (
 <section className="download-app-section">
 <div className="download-content">
 <div className="download-info">
 <div className="app-icon">
 <Smartphone size={48} />
 </div>
 <h2 className="download-title">Download Our Mobile App</h2>
 <p className="download-description">
 Shop on the go Get exclusive app-only deals, faster checkout, and easy order tracking.
 </p>

 <div className="app-features">
 <div className="feature">
 <span className="feature-icon">✓</span>
 <span>Exclusive App Offers</span>
 </div>
 <div className="feature">
 <span className="feature-icon">✓</span>
 <span>Lightning Fast Checkout</span>
 </div>
 <div className="feature">
 <span className="feature-icon">✓</span>
 <span>Real-time Order Tracking</span>
 </div>
 <div className="feature">
 <span className="feature-icon">✓</span>
 <span>Push Notifications for Deals</span>
 </div>
 </div>

 <div className="store-buttons">
 <button className="store-btn playstore">
 <Download size={24} />
 <div className="store-text">
 <span className="store-label">Get it on</span>
 <span className="store-name">Play Store</span>
 </div>
 </button>
 <button className="store-btn appstore">
 <Download size={24} />
 <div className="store-text">
 <span className="store-label">Download on the</span>
 <span className="store-name">App Store</span>
 </div>
 </button>
 </div>
 </div>

 <div className="qr-code-wrapper">
 <div className="qr-code">
 <div className="qr-placeholder">
 <Smartphone size={64} />
 <p>Scan QR Code<br />to Download</p>
 </div>
 </div>
 </div>
 </div>
 </section>
 );
};

export default DownloadApp;
