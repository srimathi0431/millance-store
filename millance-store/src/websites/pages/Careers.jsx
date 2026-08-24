import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Coffee, Award, Mail, Heart } from 'lucide-react';
import MillanceHeader from '@/components/common/MillanceHeader';
import Footer from '@/layouts/Footer';
import './FooterPages.css';

const Careers = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-page">
      <MillanceHeader />

      {/* Hero Section */}
      <div className="footer-page-hero">
        <div className="footer-page-hero-content">
          <h1 className="footer-page-title">Careers at Millance</h1>
          <p className="footer-page-subtitle">
            Join the Millance team and help us build a better shopping experience for millions of customers.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="footer-page-content">
        <div className="footer-page-card">
          
          {/* Why Work With Us */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Heart size={28} />
              Why Work With Us
            </h2>
            <div className="footer-page-section-content">
              <p>
                At Millance, we're building more than just an ecommerce platform—we're creating a culture where innovation meets impact. Our team is passionate about making online shopping accessible, reliable, and enjoyable for everyone.
              </p>
              <p>
                When you join Millance, you become part of a dynamic team that values creativity, collaboration, and continuous learning. We believe in empowering our people to take ownership, experiment with new ideas, and grow alongside the company.
              </p>
            </div>
            
            <div className="footer-page-grid" style={{ marginTop: '32px' }}>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Growth Opportunities</h3>
                <p className="footer-page-box-content">
                  We invest in your professional development with learning resources, mentorship programs, and clear career progression paths.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Innovation-Driven</h3>
                <p className="footer-page-box-content">
                  Work with cutting-edge technology and contribute to building scalable solutions that impact thousands of users daily.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Collaborative Culture</h3>
                <p className="footer-page-box-content">
                  Join a team that values diverse perspectives, open communication, and collective problem-solving.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Work-Life Balance</h3>
                <p className="footer-page-box-content">
                  We understand the importance of balance and offer flexible working arrangements to support your wellbeing.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Competitive Benefits</h3>
                <p className="footer-page-box-content">
                  Attractive compensation packages, performance bonuses, and comprehensive benefits that recognize your contributions.
                </p>
              </div>
              <div className="footer-page-box">
                <h3 className="footer-page-box-title">Impact & Purpose</h3>
                <p className="footer-page-box-content">
                  Your work directly improves the shopping experience for customers and contributes to the company's growth.
                </p>
              </div>
            </div>
          </div>

          {/* What We Look For */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Users size={28} />
              What We Look For
            </h2>
            <div className="footer-page-section-content">
              <ul className="footer-page-list">
                <li><strong>Passion for Excellence:</strong> You take pride in your work and strive to deliver high-quality results consistently.</li>
                <li><strong>Customer Focus:</strong> You understand that our success depends on creating value for our customers.</li>
                <li><strong>Collaborative Spirit:</strong> You work well with others, share knowledge, and contribute to team success.</li>
                <li><strong>Problem-Solving Mindset:</strong> You approach challenges with creativity and persistence to find effective solutions.</li>
                <li><strong>Adaptability:</strong> You're comfortable with change and can thrive in a fast-paced, evolving environment.</li>
                <li><strong>Continuous Learning:</strong> You're curious, eager to learn new skills, and open to feedback.</li>
                <li><strong>Ownership:</strong> You take initiative, follow through on commitments, and deliver on your responsibilities.</li>
              </ul>
            </div>
          </div>

          {/* Current Opportunities */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Briefcase size={28} />
              Available Opportunities
            </h2>
            <div className="footer-page-section-content">
              <div style={{
                background: '#FFF5EB',
                border: '2px solid #FFB76B',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                marginTop: '24px'
              }}>
                <Coffee size={48} style={{ color: '#FF7A00', margin: '0 auto 16px' }} />
                <h3 style={{ 
                  fontSize: '22px', 
                  fontWeight: '700', 
                  color: '#0F172A', 
                  margin: '0 0 12px 0' 
                }}>
                  No Open Positions at the Moment
                </h3>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#64748B', 
                  margin: '0 0 24px 0',
                  lineHeight: '1.6'
                }}>
                  We don't have any open positions right now, but we're always looking for talented individuals who share our vision. Send us your resume and we'll reach out when opportunities arise that match your skills.
                </p>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#475569', 
                  margin: '0'
                }}>
                  Check back regularly for new opportunities as we continue to grow.
                </p>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Mail size={28} />
              How to Apply
            </h2>
            <div className="footer-page-section-content">
              <p>
                Even though we don't have current openings, we're always interested in connecting with talented professionals who are passionate about ecommerce and technology.
              </p>
              
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#0F172A', 
                  margin: '0 0 16px 0' 
                }}>
                  Submit Your Resume
                </h3>
                <p style={{ 
                  fontSize: '15px', 
                  color: '#64748B', 
                  margin: '0 0 16px 0',
                  lineHeight: '1.7'
                }}>
                  Send your resume and a brief cover letter to:
                </p>
                <div style={{
                  background: '#F8FAFC',
                  border: '2px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <Mail size={24} style={{ color: '#FF7A00', flexShrink: 0 }} />
                  <span style={{ 
                    fontSize: '17px', 
                    fontWeight: '600', 
                    color: '#FF7A00' 
                  }}>
                    careers@millancestore.com
                  </span>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#94A3B8', 
                  margin: '0',
                  fontStyle: 'italic'
                }}>
                  Please include your area of expertise and the type of role you're interested in.
                </p>
              </div>

              <div style={{ marginTop: '32px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#0F172A', 
                  margin: '0 0 16px 0' 
                }}>
                  What to Include
                </h3>
                <ul className="footer-page-list">
                  <li><strong>Updated Resume/CV:</strong> Include your education, work experience, skills, and relevant achievements.</li>
                  <li><strong>Cover Letter:</strong> Tell us why you're interested in Millance and what you can bring to our team.</li>
                  <li><strong>Portfolio (if applicable):</strong> For design, development, or creative roles, share examples of your work.</li>
                  <li><strong>Expected Role:</strong> Mention the type of position you're seeking (engineering, marketing, operations, etc.).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Our Team Values */}
          <div className="footer-page-section">
            <h2 className="footer-page-section-title">
              <Award size={28} />
              Our Team Values
            </h2>
            <div className="footer-page-section-content">
              <div className="footer-page-grid">
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Customer Obsession</h3>
                  <p className="footer-page-box-content">
                    We start with the customer and work backward. Every decision is guided by their needs and experience.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Ownership</h3>
                  <p className="footer-page-box-content">
                    We act on behalf of the entire company. We think long-term and never say "that's not my job."
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Innovation</h3>
                  <p className="footer-page-box-content">
                    We embrace new ideas, experiment boldly, and aren't afraid to fail while learning and improving.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Bias for Action</h3>
                  <p className="footer-page-box-content">
                    We value calculated risk-taking and quick decision-making. Speed matters in business.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Earn Trust</h3>
                  <p className="footer-page-box-content">
                    We listen attentively, speak candidly, and treat others with respect. Trust is earned, not given.
                  </p>
                </div>
                <div className="footer-page-box">
                  <h3 className="footer-page-box-title">Deliver Results</h3>
                  <p className="footer-page-box-content">
                    We focus on key outputs, deliver with quality, and never compromise on our commitments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Our Journey */}
          <div className="footer-page-section">
            <div className="footer-page-section-content">
              <div style={{
                background: 'linear-gradient(135deg, #FF7A00, #FF3D8D)',
                borderRadius: '16px',
                padding: '48px 40px',
                textAlign: 'center',
                color: 'white'
              }}>
                <TrendingUp size={48} style={{ margin: '0 auto 20px' }} />
                <h3 style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  margin: '0 0 16px 0',
                  color: 'white'
                }}>
                  Ready to Join Our Journey?
                </h3>
                <p style={{ 
                  fontSize: '17px', 
                  margin: '0 0 32px 0',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  Send us your resume and let's explore how you can contribute to building India's premier online shopping destination.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => window.location.href = 'mailto:careers@millancestore.com'}
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
                    Send Your Resume
                  </button>
                  <button 
                    onClick={() => navigate('/about')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '2px solid white',
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
                    Learn More About Us
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;
