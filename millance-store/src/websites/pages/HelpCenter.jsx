import React, { useState } from 'react';
import { HelpCircle, ShoppingCart, CreditCard, Truck, RefreshCw, User, ChevronDown } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const HelpCenter = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      category: 'Orders',
      icon: <ShoppingCart size={24} />,
      questions: [
        {
          q: 'How do I place an order?',
          a: 'Browse products, select the product you want, add it to your cart, review your order, and complete the checkout process.'
        },
        {
          q: 'How can I track my order?',
          a: 'Open your Orders section to view available order and delivery information.'
        },
        {
          q: 'Can I cancel an order?',
          a: 'Cancellation availability depends on the current order status. Check your order details or contact customer support.'
        }
      ]
    },
    {
      category: 'Payments',
      icon: <CreditCard size={24} />,
      questions: [
        {
          q: 'What payment methods are supported?',
          a: 'Available payment methods will be displayed during checkout.'
        },
        {
          q: 'What happens if my payment fails?',
          a: 'Check your payment method and try again. If the amount was deducted but the order was not created, contact customer support with the transaction details.'
        }
      ]
    },
    {
      category: 'Delivery',
      icon: <Truck size={24} />,
      questions: [
        {
          q: 'How long does delivery take?',
          a: 'Delivery time depends on the product, availability, and delivery location. The applicable delivery information will be shown during the order process.'
        },
        {
          q: 'Can I change my delivery address?',
          a: 'Address changes may depend on the current order status. Contact support as soon as possible if a change is required.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      icon: <RefreshCw size={24} />,
      questions: [
        {
          q: 'How do I request a return?',
          a: 'Open your order details and follow the available return process, if the product is eligible.'
        },
        {
          q: 'When will I receive my refund?',
          a: 'Refund timing depends on the return process and payment method.'
        }
      ]
    },
    {
      category: 'Account',
      icon: <User size={24} />,
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Use the account registration option available on the website.'
        },
        {
          q: 'I forgot my password.',
          a: 'Use the available password recovery option on the login page.'
        }
      ]
    }
  ];

  let questionIndex = 0;

  return (
    <div className="footer-page">
      <MillanceHeader />

      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Help Center</h1>
          <p className="footer-page-subtitle">
            How Can We Help You?
          </p>
        </div>
      </div>

      <div className="footer-page-content">
        <div className="footer-page-card">
          
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="footer-page-section">
              <h2 className="footer-page-section-title">
                {category.icon}
                {category.category}
              </h2>
              
              <div style={{ marginTop: '20px' }}>
                {category.questions.map((faq, qIndex) => {
                  const currentIndex = questionIndex++;
                  return (
                    <div 
                      key={qIndex} 
                      className={`faq-item ${activeIndex === currentIndex ? 'active' : ''}`}
                    >
                      <button 
                        className="faq-question"
                        onClick={() => toggleFAQ(currentIndex)}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={20} className="faq-icon" />
                      </button>
                      <div className="faq-answer">
                        <div className="faq-answer-content">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still Need Help */}
          <div className="footer-page-section" style={{ marginTop: '48px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #FF7A00, #FF3D8D)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: 'white'
            }}>
              <HelpCircle size={48} style={{ margin: '0 auto 20px' }} />
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                margin: '0 0 12px 0',
                color: 'white'
              }}>
                Still Need Help?
              </h3>
              <p style={{ 
                fontSize: '16px', 
                margin: '0 0 24px 0',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                Our customer support team is here to assist you.
              </p>
              <button 
                onClick={() => window.location.href = '/contact'}
                style={{
                  background: 'white',
                  color: '#FF7A00',
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

      <Footer />
    </div>
  );
};

export default HelpCenter;
