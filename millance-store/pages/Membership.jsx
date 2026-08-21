// ═══════════════════════════════════════════════════════════════════
// MILLANCE GOLD VAULT MEMBERSHIP PAGE
// ═══════════════════════════════════════════════════════════════════
// Premium membership with exclusive benefits and pricing plans
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
 Crown, Check, Zap, Gift, Truck, Shield, 
 Star, ArrowLeft, CreditCard, Sparkles
} from 'lucide-react';
import './Membership.css';

const Membership= () => {
 const navigate = useNavigate();
 const [selectedPlan, setSelectedPlan] = useState(null);
 const [showPayment, setShowPayment] = useState(false);

 const membershipPlans = [
 {
 id: 'monthly',
 name: 'Monthly',
 price: 199,
 duration: '/month',
 savings,
 popular: false,
 color: 'linear-gradient(135deg, #FF7A00 0%, #FFB000 100%)',
 },
 {
 id: 'quarterly',
 name: 'Quarterly',
 price: 499,
 duration: '/3 months',
 savings: 'Save ₹98',
 popular: false,
 color: 'linear-gradient(135deg, #FF3D8D 0%, #E91E63 100%)',
 },
 {
 id: 'yearly',
 name: 'Yearly',
 price: 1499,
 duration: '/year',
 savings: 'Save ₹889',
 popular: true,
 color: 'linear-gradient(135deg, #7B2FF7 0%, #5B1DBF 100%)',
 },
 ];

 const benefits = [
 {
 icon: <Truck size={24} />,
 title: 'Free Delivery',
 description: 'Unlimited free delivery on all orders, no minimum purchase required',
 },
 {
 icon: <Zap size={24} />,
 title: 'Priority Support',
 description: '24/7 dedicated customer support with instant response',
 },
 {
 icon: <Gift size={24} />,
 title: 'Exclusive Deals',
 description: 'Early access to sales and member-only discount offers',
 },
 {
 icon: <Star size={24} />,
 title: 'Extra Cashback',
 description: 'Earn 5% extra cashback on every purchase',
 },
 {
 icon: <Shield size={24} />,
 title: 'Extended Warranty',
 description: 'Additional 6 months warranty on electronics',
 },
 {
 icon: <Sparkles size={24} />,
 title: 'Birthday Rewards',
 description: 'Special birthday discount and surprise gifts',
 },
 ];

 const handleSelectPlan = (planId) => {
 setSelectedPlan(planId);
 setShowPayment(true);
 };

 const handlePayment = () => {
 const plan = membershipPlans.find(p => p.id === selectedPlan);
 if (plan) {
 alert(`Processing payment of ₹${plan.price} for ${plan.name} Gold Vault Membership...`);
 // Here you would integrate with a payment gateway
 // For now, we'll just show a success message
 setTimeout(() => {
 alert('Payment successful Welcome to Gold Vault 🎉');
 navigate('/');
 }, 1000);
 }
 };

 return (
 <div className="membership-page">
 {/* Header */}
 <div className="membership-header">
 <button className="back-button" onClick={() => navigate('/')}>
 <ArrowLeft size={20} />
 <span>Back to Home</span>
 </button>
 </div>

 {/* Hero Section */}
 <section className="membership-hero">
 <div className="membership-hero-content">
 <div className="crown-icon">
 <Crown size={80} />
 </div>
 <h1 className="membership-title">
 Gold Vault <span className="gradient-text">Membership</span>
 </h1>
 <p className="membership-subtitle">
 Join India's most exclusive shopping club and unlock unlimited benefits
 </p>
 <div className="membership-stats">
 <div className="stat-item">
 <span className="stat-number">500K+</span>
 <span className="stat-label">Active Members</span>
 </div>
 <div className="stat-divider"></div>
 <div className="stat-item">
 <span className="stat-number">₹2,400</span>
 <span className="stat-label">Avg. Annual Savings</span>
 </div>
 <div className="stat-divider"></div>
 <div className="stat-item">
 <span className="stat-number">4.9/5</span>
 <span className="stat-label">Member Rating</span>
 </div>
 </div>
 </div>
 </section>

 {/* Benefits Section */}
 <section className="membership-benefits">
 <div className="container">
 <h2 className="section-title">Exclusive Member Benefits</h2>
 <div className="benefits-grid">
 {benefits.map((benefit, index) => (
 <motion.div
 key={index}
 className="benefit-card"
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.1 }}
 >
 <div className="benefit-icon">{benefit.icon}</div>
 <h3 className="benefit-title">{benefit.title}</h3>
 <p className="benefit-description">{benefit.description}</p>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Pricing Section */}
 <section className="membership-pricing">
 <div className="container">
 <h2 className="section-title">Choose Your Plan</h2>
 <p className="section-subtitle">Select the perfect plan for your shopping needs</p>
 
 <div className="pricing-grid">
 {membershipPlans.map((plan, index) => (
 <motion.div
 key={plan.id}
 className={`pricing-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: index * 0.15 }}
 >
 {plan.popular && (
 <div className="popular-badge">
 <Star size={14} fill="currentColor" />
 <span>Most Popular</span>
 </div>
 )}
 
 <div className="pricing-header" style={{ background: plan.color }}>
 <h3 className="plan-name">{plan.name}</h3>
 <div className="plan-price">
 <span className="currency">₹</span>
 <span className="amount">{plan.price}</span>
 <span className="duration">{plan.duration}</span>
 </div>
 {plan.savings && (
 <div className="savings-badge">{plan.savings}</div>
 )}
 </div>

 <div className="pricing-body">
 <ul className="features-list">
 <li><Check size={18} /> Free unlimited delivery</li>
 <li><Check size={18} /> 24/7 priority support</li>
 <li><Check size={18} /> Exclusive deals & offers</li>
 <li><Check size={18} /> 5% extra cashback</li>
 <li><Check size={18} /> Extended warranty</li>
 <li><Check size={18} /> Birthday rewards</li>
 </ul>

 <button
 className="select-plan-btn"
 onClick={() => handleSelectPlan(plan.id)}
 >
 {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
 </button>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 {/* Payment Modal */}
 {showPayment && selectedPlan && (
 <div className="payment-overlay" onClick={() => setShowPayment(false)}>
 <motion.div
 className="payment-modal"
 onClick={(e) => e.stopPropagation()}
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 >
 <div className="payment-header">
 <h3>Complete Your Purchase</h3>
 <button className="close-modal" onClick={() => setShowPayment(false)}>×</button>
 </div>

 <div className="payment-summary">
 <div className="summary-item">
 <span>Plan:</span>
 <span className="summary-value">
 {membershipPlans.find(p => p.id === selectedPlan)?.name} Gold Vault
 </span>
 </div>
 <div className="summary-item">
 <span>Duration:</span>
 <span className="summary-value">
 {membershipPlans.find(p => p.id === selectedPlan)?.duration.replace('/', '')}
 </span>
 </div>
 <div className="summary-item total">
 <span>Total Amount:</span>
 <span className="summary-value">
 ₹{membershipPlans.find(p => p.id === selectedPlan)?.price}
 </span>
 </div>
 </div>

 <div className="payment-methods">
 <h4>Select Payment Method</h4>
 <div className="payment-options">
 <button className="payment-option">
 <CreditCard size={20} />
 <span>Credit/Debit Card</span>
 </button>
 <button className="payment-option">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
 </svg>
 <span>UPI</span>
 </button>
 <button className="payment-option">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
 <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
 </svg>
 <span>Net Banking</span>
 </button>
 <button className="payment-option">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
 <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
 </svg>
 <span>Wallet</span>
 </button>
 </div>
 </div>

 <button className="proceed-payment-btn" onClick={handlePayment}>
 <CreditCard size={20} />
 Proceed to Pay ₹{membershipPlans.find(p => p.id === selectedPlan)?.price}
 </button>

 <p className="payment-secure">
 <Shield size={16} />
 100% secure payment powered by Razorpay
 </p>
 </motion.div>
 </div>
 )}

 {/* FAQ Section */}
 <section className="membership-faq">
 <div className="container">
 <h2 className="section-title">Frequently Asked Questions</h2>
 <div className="faq-grid">
 <div className="faq-item">
 <h4>Can I cancel my membership anytime?</h4>
 <p>Yes, you can cancel your Gold Vault membership anytime. No questions asked.</p>
 </div>
 <div className="faq-item">
 <h4>How do I get the free delivery benefit?</h4>
 <p>Free delivery is automatically applied to all orders once you're a Gold Vault member.</p>
 </div>
 <div className="faq-item">
 <h4>Is the cashback instant?</h4>
 <p>Yes 5% cashback is credited to your wallet within 24 hours of delivery.</p>
 </div>
 <div className="faq-item">
 <h4>Can I share my membership?</h4>
 <p>No, Gold Vault membership is personal and tied to your account only.</p>
 </div>
 </div>
 </div>
 </section>
 </div>
 );
};

export default Membership;
