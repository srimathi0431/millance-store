import React from 'react';
import { Truck, MapPin, DollarSign, Clock, Package, AlertCircle, PhoneCall } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const Shipping = () => {
  return (
    <div className="footer-page">
      <MillanceHeader />

      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Shipping & Delivery</h1>
          <p className="footer-page-subtitle">
            Fast, Convenient Delivery From Millance Store
          </p>
        </div>
      </div>

      <div className="footer-page-content">
        <div className="footer-page-card">
          
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <MapPin size={28} />
              Delivery Areas
            </h2>
            <div className="footer-page-section-content">
              <p>
                Delivery availability depends on the selected location and service coverage.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <DollarSign size={28} />
              Delivery Charges
            </h2>
            <div className="footer-page-section-content">
              <p>
                Applicable delivery charges, if any, will be displayed during the shopping or checkout process.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Clock size={28} />
              Delivery Time
            </h2>
            <div className="footer-page-section-content">
              <p>
                Estimated delivery time can vary based on:
              </p>
              <ul className="footer-page-list">
                <li>Product availability</li>
                <li>Seller location</li>
                <li>Customer location</li>
                <li>Courier/logistics conditions</li>
                <li>Holidays</li>
                <li>Unexpected delays</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Package size={28} />
              Order Tracking
            </h2>
            <div className="footer-page-section-content">
              <p>
                Once tracking information is available, customers can view the applicable order/delivery status through the Orders section.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Truck size={28} />
              Delivery Attempts
            </h2>
            <div className="footer-page-section-content">
              <p>
                If delivery cannot be completed, the delivery partner may make another attempt or provide further instructions.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <AlertCircle size={28} />
              Delayed Orders
            </h2>
            <div className="footer-page-section-content">
              <p>
                If an order is delayed beyond the expected timeframe, contact customer support with your order information.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <PhoneCall size={28} />
              Need Help with Delivery?
            </h2>
            <div className="footer-page-section-content">
              <p>
                For questions about delivery, tracking, or shipping issues, our customer support team is ready to assist you.
              </p>
              <div style={{ marginTop: '24px' }}>
                <button 
                  onClick={() => window.location.href = '/contact'}
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
                  Contact Support
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shipping;
