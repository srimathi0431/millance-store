import React from 'react';
import { Shield, Lock, Eye, Database, Users, FileText, AlertCircle, Mail } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="footer-page">
      <MillanceHeader />

      {/* Hero Section */}
      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Privacy Policy</h1>
          <p className="footer-page-subtitle">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="footer-page-content">
        <div className="footer-page-card">
          
          {/* Introduction */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Shield size={28} />
              Introduction
            </h2>
            <div className="footer-page-section-content">
              <p>
                At Millance Store, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, share, and protect information when you use our website and services.
              </p>
              <p>
                By using Millance Store, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Database size={28} />
              Information We Collect
            </h2>
            <div className="footer-page-section-content">
              <p>
                We collect several types of information to provide and improve our services:
              </p>
              
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', margin: '24px 0 16px 0' }}>
                Personal Information
              </h3>
              <ul className="footer-page-list">
                <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account.</li>
                <li><strong>Profile Information:</strong> Additional details you choose to provide such as date of birth, gender, and preferences.</li>
                <li><strong>Contact Information:</strong> Information you provide when contacting customer support or subscribing to newsletters.</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', margin: '24px 0 16px 0' }}>
                Order Information
              </h3>
              <ul className="footer-page-list">
                <li><strong>Purchase Details:</strong> Products ordered, quantities, prices, and order history.</li>
                <li><strong>Delivery Information:</strong> Shipping addresses, delivery preferences, and tracking information.</li>
                <li><strong>Order Communications:</strong> Messages related to order confirmations, shipping updates, and customer service.</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', margin: '24px 0 16px 0' }}>
                Payment Information
              </h3>
              <ul className="footer-page-list">
                <li><strong>Payment Details:</strong> Payment method information processed securely through our payment gateway partners.</li>
                <li><strong>Billing Information:</strong> Billing address and transaction history.</li>
                <li><strong>Security Note:</strong> We do not store complete credit card numbers on our servers.</li>
              </ul>

              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', margin: '24px 0 16px 0' }}>
                Usage Information
              </h3>
              <ul className="footer-page-list">
                <li><strong>Browsing Activity:</strong> Pages viewed, products searched, items added to cart or wishlist.</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers.</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address for delivery and service availability.</li>
              </ul>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Eye size={28} />
              How We Use Your Information
            </h2>
            <div className="footer-page-section-content">
              <p>
                We use the information we collect for the following purposes:
              </p>
              <ul className="footer-page-list">
                <li><strong>Order Processing:</strong> To process and fulfill your orders, manage deliveries, and handle returns or refunds.</li>
                <li><strong>Account Management:</strong> To create and maintain your account, verify your identity, and provide customer support.</li>
                <li><strong>Communication:</strong> To send order confirmations, shipping updates, promotional offers, and respond to your inquiries.</li>
                <li><strong>Personalization:</strong> To provide personalized product recommendations and customize your shopping experience.</li>
                <li><strong>Payment Processing:</strong> To process transactions securely and prevent fraud.</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns, improve our website, and develop new features.</li>
                <li><strong>Marketing:</strong> To send you promotional emails about products, offers, and events (you can opt out anytime).</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms and conditions.</li>
                <li><strong>Security:</strong> To protect against fraud, unauthorized transactions, and other security threats.</li>
              </ul>
            </div>
          </div>

          {/* Cookies and Tracking */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <FileText size={28} />
              Cookies and Tracking Technologies
            </h2>
            <div className="footer-page-section-content">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience and collect information about how you use our website.
              </p>
              
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', margin: '24px 0 16px 0' }}>
                Types of Cookies We Use
              </h3>
              <ul className="footer-page-list">
                <li><strong>Essential Cookies:</strong> Necessary for the website to function properly, including authentication and shopping cart.</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website to improve performance.</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings for a better user experience.</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness.</li>
              </ul>

              <p style={{ marginTop: '20px' }}>
                You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.
              </p>
            </div>
          </div>

          {/* Data Security */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Lock size={28} />
              Data Security
            </h2>
            <div className="footer-page-section-content">
              <p>
                We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.
              </p>
              <ul className="footer-page-list">
                <li><strong>Encryption:</strong> We use SSL/TLS encryption to secure data transmission between your browser and our servers.</li>
                <li><strong>Secure Storage:</strong> Personal information is stored on secure servers with restricted access.</li>
                <li><strong>Payment Security:</strong> Payment information is processed through PCI-DSS compliant payment gateways.</li>
                <li><strong>Access Controls:</strong> Only authorized personnel have access to personal data, and only when necessary.</li>
                <li><strong>Regular Audits:</strong> We regularly review and update our security practices to address emerging threats.</li>
              </ul>
              <p style={{ marginTop: '20px', padding: '16px', background: '#FFF5EB', borderRadius: '8px', borderLeft: '4px solid #FF7A00' }}>
                <strong>Note:</strong> While we take reasonable measures to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </div>

          {/* Information Sharing */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Users size={28} />
              Information Sharing and Disclosure
            </h2>
            <div className="footer-page-section-content">
              <p>
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="footer-page-list">
                <li><strong>Service Providers:</strong> With third-party vendors who help us operate our business (payment processors, shipping companies, marketing services).</li>
                <li><strong>Sellers:</strong> Order details are shared with sellers to fulfill your purchases.</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with appropriate safeguards).</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, property, safety, or that of our users and the public.</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to share information with specific third parties.</li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <AlertCircle size={28} />
              Your Rights and Choices
            </h2>
            <div className="footer-page-section-content">
              <p>
                You have several rights regarding your personal information:
              </p>
              <ul className="footer-page-list">
                <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
                <li><strong>Correction:</strong> You can update or correct inaccurate information through your account settings.</li>
                <li><strong>Deletion:</strong> You can request deletion of your account and associated personal data (subject to legal requirements).</li>
                <li><strong>Opt-Out:</strong> You can unsubscribe from marketing emails using the link in our communications.</li>
                <li><strong>Data Portability:</strong> You can request a copy of your data in a portable format.</li>
                <li><strong>Withdraw Consent:</strong> You can withdraw consent for certain data processing activities.</li>
                <li><strong>Restrict Processing:</strong> You can request that we limit how we use your information.</li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                To exercise these rights, please contact us at <strong>privacy@millancestore.com</strong> or through the contact information provided below.
              </p>
            </div>
          </div>

          {/* Children's Privacy */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Shield size={28} />
              Children's Privacy
            </h2>
            <div className="footer-page-section-content">
              <p>
                Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can delete such information.
              </p>
            </div>
          </div>

          {/* Changes to Policy */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <FileText size={28} />
              Changes to This Privacy Policy
            </h2>
            <div className="footer-page-section-content">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by:
              </p>
              <ul className="footer-page-list">
                <li>Posting the updated policy on this page with a new "Last Updated" date</li>
                <li>Sending an email notification to registered users (for material changes)</li>
                <li>Displaying a notice on our website homepage</li>
              </ul>
              <p style={{ marginTop: '20px' }}>
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </div>

          {/* Contact Us */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Mail size={28} />
              Contact Us
            </h2>
            <div className="footer-page-section-content">
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div style={{ marginTop: '24px', display: 'grid', gap: '16px' }}>
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
                      privacy@millancestore.com
                    </div>
                  </div>
                </div>
                
                <div style={{
                  background: '#F8FAFC',
                  border: '2px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <FileText size={24} style={{ color: '#FF7A00', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>Subject Line</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>
                      Privacy Policy Inquiry
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ marginTop: '24px', fontSize: '15px', color: '#64748B' }}>
                We will respond to your inquiry within a reasonable timeframe, typically within 30 days.
              </p>
            </div>
          </div>

        </div>

        {/* Last Updated */}
        <div className="last-updated">
          <strong>Last Updated:</strong> {currentDate}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
