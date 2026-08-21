import React from 'react';
import GoldVaultSection from './GoldVaultSection';
import NewsletterSection from './NewsletterSection';
import './PremiumSections.css';

const PremiumSections= () => {
 return (
 <div className="premium-sections-container">
 <div className="container-fluid">
 <div className="premium-sections-grid">
 <GoldVaultSection />
 <NewsletterSection />
 </div>
 </div>
 </div>
 );
};

export default PremiumSections;
