import React from 'react';
import { FileText, ShoppingCart, CreditCard, Truck, RefreshCw, AlertTriangle, Scale, Mail } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const TermsAndConditions = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="footer-page">
      <MillanceHeader />

      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Terms and Conditions</h1>
          <p className="footer-page-subtitle">
            Please read these terms carefully before using Millance Store services.
          </p>
        </div>
      </div>

      <div className="footer-page-content">
        <div className="footer-page-card">
          
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <FileText size={28} />
              Introduction and Acceptance
            </h2>
            <div className="footer-page-section-content">
              <p>
                Welcome to Millance Store. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using Millance Store, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services.
              </p>
              <p>
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of our services after any changes constitutes acceptance of the updated Terms.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <ShoppingCart size={28} />
              Account Registration and Usage
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Account Creation:</strong> You must provide accurate, current, and complete information during registration.</li>
                <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li><strong>Age Requirement:</strong> You must be at least 18 years old to create an account and make purchases.</li>
                <li><strong>Account Responsibility:</strong> You are responsible for all activities that occur under your account.</li>
                <li><strong>Prohibited Activities:</strong> You may not use our services for any illegal or unauthorized purpose.</li>
                <li><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <ShoppingCart size={28} />
              Products, Pricing, and Availability
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Product Information:</strong> We strive to provide accurate product descriptions, but do not warrant that descriptions are error-free.</li>
                <li><strong>Pricing:</strong> All prices are in Indian Rupees (₹) and are subject to change without notice.</li>
                <li><strong>Product Availability:</strong> We cannot guarantee that all products will be available at all times.</li>
                <li><strong>Order Acceptance:</strong> We reserve the right to refuse or cancel any order for any reason.</li>
                <li><strong>Pricing Errors:</strong> If a product is listed at an incorrect price, we reserve the right to refuse or cancel orders.</li>
                <li><strong>Product Images:</strong> Product images are for illustration purposes. Actual products may vary slightly.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <ShoppingCart size={28} />
              Orders and Transactions
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Order Placement:</strong> By placing an order, you make an offer to purchase products at the listed prices.</li>
                <li><strong>Order Confirmation:</strong> Order confirmation does not guarantee acceptance; acceptance occurs upon shipment.</li>
                <li><strong>Order Modification:</strong> Once placed, orders cannot be modified but may be cancelled if not yet shipped.</li>
                <li><strong>Order Cancellation:</strong> We reserve the right to cancel orders for reasons including product unavailability or pricing errors.</li>
                <li><strong>Multiple Orders:</strong> We may limit the quantity of products ordered per customer.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <CreditCard size={28} />
              Payment Terms
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Payment Methods:</strong> We accept credit cards, debit cards, UPI, net banking, and other payment methods displayed at checkout.</li>
                <li><strong>Payment Authorization:</strong> By providing payment information, you authorize us to charge the total amount.</li>
                <li><strong>Payment Security:</strong> Payments are processed through secure, PCI-DSS compliant payment gateways.</li>
                <li><strong>Payment Failure:</strong> If payment fails, your order will be cancelled.</li>
                <li><strong>Taxes and Fees:</strong> All applicable taxes and fees are included in the displayed price unless otherwise stated.</li>
                <li><strong>Currency:</strong> All transactions are processed in Indian Rupees (₹).</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Truck size={28} />
              Delivery and Shipping
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Delivery Areas:</strong> We deliver to locations as specified during checkout.</li>
                <li><strong>Delivery Times:</strong> Estimated delivery times are approximate and not guaranteed.</li>
                <li><strong>Delivery Address:</strong> You must provide a complete and accurate delivery address.</li>
                <li><strong>Delivery Attempts:</strong> We will make reasonable attempts to deliver your order.</li>
                <li><strong>Failed Delivery:</strong> Orders may be returned to us if delivery fails due to incorrect address or unavailability.</li>
                <li><strong>Shipping Charges:</strong> Shipping fees, if applicable, will be displayed at checkout.</li>
                <li><strong>Risk of Loss:</strong> Risk of loss passes to you upon delivery.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <RefreshCw size={28} />
              Returns, Refunds, and Cancellations
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Return Policy:</strong> Returns are subject to our Return Policy available on the Returns page.</li>
                <li><strong>Return Window:</strong> Return requests must be initiated within the specified timeframe.</li>
                <li><strong>Condition:</strong> Products must be unused, in original packaging with tags attached.</li>
                <li><strong>Refund Processing:</strong> Approved refunds will be processed to the original payment method.</li>
                <li><strong>Refund Timeline:</strong> Refunds typically take 5-10 business days after approval.</li>
                <li><strong>Non-Returnable Items:</strong> Certain products may not be eligible for return (see Return Policy).</li>
                <li><strong>Order Cancellation:</strong> You may cancel orders before shipment through your account.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <AlertTriangle size={28} />
              User Responsibilities and Prohibited Activities
            </h2>
            <div className="footer-page-section-content">
              <p><strong>You agree NOT to:</strong></p>
              <ul className="footer-page-list">
                <li>Provide false or misleading information during registration or checkout.</li>
                <li>Use our services for any illegal or fraudulent purpose.</li>
                <li>Attempt to gain unauthorized access to our systems or accounts.</li>
                <li>Scrape, harvest, or collect data from our website using automated means.</li>
                <li>Post, transmit, or share harmful content including malware or viruses.</li>
                <li>Abuse, harass, or harm other users or our staff.</li>
                <li>Circumvent security measures or interfere with website operations.</li>
                <li>Resell products purchased from Millance Store for commercial purposes without authorization.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <FileText size={28} />
              Intellectual Property Rights
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Ownership:</strong> All content on Millance Store, including text, graphics, logos, and software, is our property or licensed to us.</li>
                <li><strong>Trademarks:</strong> Millance Store and related marks are our trademarks. Unauthorized use is prohibited.</li>
                <li><strong>License:</strong> We grant you a limited, non-exclusive license to access and use our services for personal shopping.</li>
                <li><strong>Restrictions:</strong> You may not reproduce, distribute, modify, or create derivative works without permission.</li>
                <li><strong>User Content:</strong> By submitting reviews or content, you grant us rights to use, display, and distribute that content.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Scale size={28} />
              Limitation of Liability
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Service Availability:</strong> We do not guarantee uninterrupted or error-free service.</li>
                <li><strong>Product Warranty:</strong> Products are subject to manufacturer warranties; we make no additional warranties.</li>
                <li><strong>Indirect Damages:</strong> We are not liable for indirect, incidental, or consequential damages.</li>
                <li><strong>Liability Cap:</strong> Our total liability shall not exceed the amount you paid for the specific product or service.</li>
                <li><strong>Third-Party Links:</strong> We are not responsible for content on third-party websites linked from our site.</li>
                <li><strong>Force Majeure:</strong> We are not liable for delays or failures caused by circumstances beyond our control.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <FileText size={28} />
              Dispute Resolution and Governing Law
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Governing Law:</strong> These Terms are governed by the laws of India.</li>
                <li><strong>Jurisdiction:</strong> Any disputes shall be subject to the exclusive jurisdiction of courts in [Your City], India.</li>
                <li><strong>Informal Resolution:</strong> We encourage resolving disputes through customer service before legal action.</li>
                <li><strong>Severability:</strong> If any provision is found invalid, the remaining provisions remain in effect.</li>
              </ul>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <FileText size={28} />
              Changes to Terms
            </h2>
            <div className="footer-page-section-content">
              <p>
                We may revise these Terms at any time. Material changes will be communicated through our website or via email. Your continued use of Millance Store after changes are posted constitutes acceptance of the revised Terms.
              </p>
            </div>
          </div>

          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Mail size={28} />
              Contact Information
            </h2>
            <div className="footer-page-section-content">
              <p>
                For questions or concerns regarding these Terms and Conditions, please contact us:
              </p>
              
              <div style={{ marginTop: '24px' }}>
                <div style={{
                  background: '#F8FAFC',
                  border: '2px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Mail size={24} style={{ color: '#FF7A00', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>Email</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                      legal@millancestore.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="last-updated">
          <strong>Last Updated:</strong> {currentDate}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
