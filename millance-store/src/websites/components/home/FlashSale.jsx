import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { FLASH_SALE } from '@/constants/mockData';
import ProductCard from '@/components/common/ProductCard';
import './FlashSale.css';

const FlashSale= () => {
 const navigate = useNavigate();
 const [timeLeft, setTimeLeft] = useState({
 hours: 0,
 minutes: 0,
 seconds: 0,
 });

 useEffect(() => {
 const calculateTimeLeft = () => {
 const endTime = new Date(FLASH_SALE.endsAt).getTime();
 const now = new Date().getTime();
 const difference = endTime - now;

 if (difference > 0) {
 setTimeLeft({
 hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
 minutes: Math.floor((difference / 1000 / 60) % 60),
 seconds: Math.floor((difference / 1000) % 60),
 });
 }
 };

 calculateTimeLeft();
 const timer = setInterval(calculateTimeLeft, 1000);

 return () => clearInterval(timer);
 }, []);

 return (
 <section className="flash-sale-section">
 <div className="flash-sale-header">
 <div className="flash-sale-title-wrapper">
 <h2 className="section-title">⚡ Flash Sale</h2>
 <div className="countdown">
 <Clock size={20} />
 <span>Ends in:</span>
 <div className="countdown-timer">
 <div className="time-unit">
 <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
 <span className="time-label">hrs</span>
 </div>
 <span className="time-separator">:</span>
 <div className="time-unit">
 <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
 <span className="time-label">min</span>
 </div>
 <span className="time-separator">:</span>
 <div className="time-unit">
 <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
 <span className="time-label">sec</span>
 </div>
 </div>
 </div>
 </div>
 <button className="view-all-btn" onClick={() => navigate('/flash-sale')}>
 View All
 </button>
 </div>

 <div className="flash-sale-products">
 {FLASH_SALE.products.map((product) => (
 <ProductCard key={product.id} product={product} />
 ))}
 </div>
 </section>
 );
};

export default FlashSale;
