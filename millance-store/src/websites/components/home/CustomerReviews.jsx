import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '@/constants/mockData';
import './CustomerReviews.css';

const CustomerReviews= () => {
 const renderStars = (rating) => {
 return Array.from({ length: 5 }).map((_, index) => (
 <Star
 key={index}
 size={16}
 fill={index < rating ? 'currentColor' : 'none'}
 className={index < rating ? 'star-filled' : 'star-empty'}
 />
 ));
 };

 return (
 <section className="customer-reviews-section">
 <div className="section-header">
 <h2 className="section-title">What Our Customers Say</h2>
 </div>

 <div className="reviews-grid">
 {CUSTOMER_REVIEWS.map((review) => (
 <div key={review.id} className="review-card">
 {/* User Info */}
 <div className="review-header">
 <div className="user-avatar">
 <img 
 src={review.avatar} 
 alt={review.user}
 loading="lazy"
 onError={(e) => {
 e.currentTarget.style.display = 'none';
 const parent = e.currentTarget.parentElement;
 if (parent) {
 const span = document.createElement('span');
 span.className = 'avatar-letter';
 span.textContent = review.user[0];
 parent.appendChild(span);
 }
 }}
 />
 </div>
 <div className="user-info">
 <div className="user-name-wrapper">
 <h4 className="user-name">{review.user}</h4>
 {review.verified && (
 <CheckCircle size={16} className="verified-icon" fill="currentColor" />
 )}
 </div>
 <div className="review-stars">
 {renderStars(review.rating)}
 </div>
 </div>
 </div>

 {/* Review Comment */}
 <p className="review-comment">"{review.comment}"</p>

 {/* Review Date */}
 <p className="review-date">{new Date(review.date).toLocaleDateString('en-US', { 
 year: 'numeric', 
 month: 'long', 
 day: 'numeric' 
 })}</p>
 </div>
 ))}
 </div>
 </section>
 );
};

export default CustomerReviews;
