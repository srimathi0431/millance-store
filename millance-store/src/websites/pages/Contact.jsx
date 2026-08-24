import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call when backend is ready)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    
    // Hide success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="footer-page">
      <MillanceHeader />

      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Contact Millance Store</h1>
          <p className="footer-page-subtitle">
            We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="footer-page-content">
        
        {/* Contact Info Grid */}
        <div className="contact-info-grid">
          <div className="contact-info-item">
            <div className="contact-info-icon">
              <Phone size={24} />
            </div>
            <div className="contact-info-details">
              <h3>Customer Support</h3>
              <p>1800-123-4567</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Toll-free (9 AM - 9 PM, Mon-Sat)</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <Mail size={24} />
            </div>
            <div className="contact-info-details">
              <h3>Email Support</h3>
              <p>support@millancestore.com</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>We'll respond within 24 hours</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <MapPin size={24} />
            </div>
            <div className="contact-info-details">
              <h3>Head Office</h3>
              <p>Mumbai, Maharashtra</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>India</p>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <Clock size={24} />
            </div>
            <div className="contact-info-details">
              <h3>Business Hours</h3>
              <p>Monday - Saturday</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>9:00 AM - 9:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="footer-page-card" style={{ marginTop: '40px' }}>
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Send size={28} />
              Send Us a Message
            </h2>
            <div className="footer-page-section-content">
              <p>
                Fill out the form below and our customer support team will get back to you as soon as possible.
              </p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your 10-digit phone number"
              />
              {errors.phone && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.phone}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Subject <span className="required">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                placeholder="What is your message about?"
              />
              {errors.subject && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.subject}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Message <span className="required">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Please describe your inquiry in detail..."
              />
              {errors.message && (
                <div className="form-error">
                  <AlertCircle size={14} />
                  {errors.message}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="form-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid white', 
                    borderTopColor: 'transparent', 
                    borderRadius: '50%', 
                    animation: 'spin 0.6s linear infinite' 
                  }} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>

            {submitSuccess && (
              <div className="form-success">
                <CheckCircle size={24} />
                <span>
                  Thank you for contacting us! We've received your message and will respond within 24 hours.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Additional Info */}
        <div className="footer-page-card" style={{ marginTop: '32px' }}>
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              Other Ways to Reach Us
            </h2>
            <div className="footer-page-section-content">
              <div className="footer-page-grid">
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Order Support</h3>
                  <p className="footer-page-box-content">
                    For questions about your order, shipment tracking, or delivery issues, visit your Orders page or call our support line.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Product Inquiries</h3>
                  <p className="footer-page-box-content">
                    Have questions about a specific product? Check the product page for details or contact the seller directly.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Returns & Refunds</h3>
                  <p className="footer-page-box-content">
                    For return requests or refund status, visit our Returns page or contact support with your order number.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Technical Issues</h3>
                  <p className="footer-page-box-content">
                    Experiencing website issues? Email us at tech@millancestore.com with details about the problem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <Footer />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Contact;
