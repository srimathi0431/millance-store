import React from 'react';
import { RefreshCw, Package, CheckCircle, AlertTriangle, Mail } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const Returns = () => {
  return (
    <div className="footer-page">
      <MillanceHeader />

      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Returns & Refunds</h1>
          <p className="footer-page-subtitle">
            Simple and Transparent Return Information
          </p>
        </div>
      </div>

      <div className="footer-page-content">
        <div className="footer-page-card">
          
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <RefreshCw size={28} />
              Return Eligibility
            </h2>
            <div className="footer-page-section-content">
              <p>
                Products may be eligible for return depending on their category, condition, seller policy, and applicable return terms.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <CheckCircle size={28} />
              Before Requesting a Return
            </h2>
            <div className="footer-page-section-content">
              <p>
                Make sure:
              </p>
              <ul className="footer-page-list">
                <li>Product is in acceptable condition</li>
                <li>Original accessories are retained</li>
                <li>Packaging is retained where required</li>
                <li>Proof/order information is available</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <AlertTriangle size={28} />
              Damaged or Incorrect Product
            </h2>
            <div className="footer-page-section-content">
              <p>
                If you receive a damaged, defective, or incorrect product, contact customer support as soon as possible and provide the relevant order information and supporting photos where requested.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Package size={28} />
              Refunds
            </h2>
            <div className="footer-page-section-content">
              <p>
                Once an eligible return is approved and processed, the refund will be handled through the applicable payment method or refund process.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <AlertTriangle size={28} />
              Important
            </h2>
            <div className="footer-page-section-content">
              <p>
                Return eligibility and timelines may vary by product.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Mail size={28} />
              Need Help with a Return?
            </h2>
            <div className="footer-page-section-content">
              <p>
                If you have questions about returning a product or checking refund status, please contact our customer support team.
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

export default Returns;
