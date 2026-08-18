import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Gift, Truck, Headphones, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import './GoldVaultSection.css';

const GoldVaultSection: React.FC = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: <Zap size={20} />, text: 'Cashback on every purchase' },
    { icon: <Gift size={20} />, text: 'Exclusive member discounts' },
    { icon: <Sparkles size={20} />, text: 'Early access to sales' },
    { icon: <Truck size={20} />, text: 'Free delivery on eligible orders' },
    { icon: <Headphones size={20} />, text: 'Premium customer support' },
  ];

  return (
    <motion.div 
      className="gold-vault-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="gold-vault-icon-wrapper">
        <Crown size={48} className="gold-vault-icon" />
      </div>
      
      <div className="gold-vault-content">
        <h2 className="gold-vault-title">Join Millance Gold Vault</h2>
        <p className="gold-vault-subtitle">Unlock Premium Shopping Benefits</p>
        <p className="gold-vault-description">
          Become a Millance Gold Vault member and enjoy exclusive rewards every time you shop. 
          Get cashback on purchases, member-only discounts, early access to special sales, 
          free delivery on eligible orders, and premium customer support.
        </p>

        <ul className="gold-vault-benefits">
          {benefits.map((benefit, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <span className="benefit-icon">{benefit.icon}</span>
              <span className="benefit-text">{benefit.text}</span>
            </motion.li>
          ))}
        </ul>

        <div className="gold-vault-actions">
          <button 
            className="btn-gold-primary"
            onClick={() => navigate('/membership')}
          >
            <Crown size={20} />
            Join Gold Vault
          </button>
          <button 
            className="btn-gold-secondary"
            onClick={() => navigate('/membership/details')}
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="gold-vault-decoration"></div>
    </motion.div>
  );
};

export default GoldVaultSection;
