import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { MapPin, User, Phone, CreditCard, CheckCircle, Truck, Home, Building } from 'lucide-react';
import Toast from '@/components/common/Toast';
import './Checkout.css';

const Checkout= () => {
 const navigate = useNavigate();
 const { cart, cartTotal, clearCart } = useApp();
 const [currentStep, setCurrentStep] = useState(1);
 const [toastMessage, setToastMessage] = useState(null);

 // Form States
 const [address, setAddress] = useState({
 fullName: '',
 phone: '',
 addressLine1: '',
 addressLine2: '',
 city: '',
 state: '',
 pincode: '',
 addressType: 'home'
 });

 const [paymentMethod, setPaymentMethod] = useState('cod');
 const [orderId, setOrderId] = useState('');

 if (cart.length === 0 && currentStep < 4) {
 navigate('/cart');
 return null;
 }

 const handleAddressSubmit = () => {
 if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
 setToastMessage('⚠️ Please fill all required fields');
 return;
 }
 if (address.phone.length !== 10) {
 setToastMessage('⚠️ Please enter a valid 10-digit phone number');
 return;
 }
 setCurrentStep(2);
 };

 const handlePaymentSubmit = () => {
 setCurrentStep(3);
 };

 const handlePlaceOrder = () => {
 // Generate order ID
 const newOrderId = 'ORD' + Date.now();
 setOrderId(newOrderId);

 // Calculate delivery date (3-5 days from now)
 const deliveryDate = new Date();
 deliveryDate.setDate(deliveryDate.getDate() + 4);

 // Save order to localStorage
 const order = {
 id: newOrderId,
 items: cart,
 total: cartTotal,
 address,
 paymentMethod,
 orderDate: new Date().toISOString(),
 deliveryDate: deliveryDate.toISOString(),
 status: 'Processing'
 };

 const existingOrders = JSON.parse(localStorage.getItem('millance-orders') || '[]');
 localStorage.setItem('millance-orders', JSON.stringify([order, ...existingOrders]));

 // Clear cart
 clearCart();
 setCurrentStep(4);
 };

 return (
 <div className="checkout-page">
 {toastMessage && (
 <Toast 
 message={toastMessage} 
 type={toastMessage.includes('⚠️') ? 'error' : 'success'}
 onClose={() => setToastMessage(null)} 
 />
 )}

 <div className="container">
 {/* Progress Steps */}
 <div className="checkout-steps">
 <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
 <div className="step-icon">
 <MapPin size={20} />
 </div>
 <span>Address</span>
 </div>
 <div className="step-line"></div>
 <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
 <div className="step-icon">
 <CreditCard size={20} />
 </div>
 <span>Payment</span>
 </div>
 <div className="step-line"></div>
 <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
 <div className="step-icon">
 <CheckCircle size={20} />
 </div>
 <span>Review</span>
 </div>
 <div className="step-line"></div>
 <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
 <div className="step-icon">
 <Truck size={20} />
 </div>
 <span>Confirm</span>
 </div>
 </div>

 {/* Step 1: Address */}
 {currentStep === 1 && (
 <div className="checkout-content">
 <div className="checkout-card">
 <h2 className="checkout-title">
 <MapPin size={24} />
 Delivery Address
 </h2>

 <div className="form-grid">
 <div className="form-group full-width">
 <label>Full Name *</label>
 <div className="input-with-icon">
 <User size={18} />
 <input
 type="text"
 placeholder="Enter your full name"
 value={address.fullName}
 onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
 />
 </div>
 </div>

 <div className="form-group full-width">
 <label>Phone Number *</label>
 <div className="input-with-icon">
 <Phone size={18} />
 <input
 type="tel"
 placeholder="10-digit mobile number"
 maxLength={10}
 value={address.phone}
 onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '') })}
 />
 </div>
 </div>

 <div className="form-group full-width">
 <label>Address Line 1 *</label>
 <input
 type="text"
 placeholder="House No., Building Name"
 value={address.addressLine1}
 onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
 />
 </div>

 <div className="form-group full-width">
 <label>Address Line 2</label>
 <input
 type="text"
 placeholder="Road Name, Area, Colony"
 value={address.addressLine2}
 onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
 />
 </div>

 <div className="form-group">
 <label>City *</label>
 <input
 type="text"
 placeholder="City"
 value={address.city}
 onChange={(e) => setAddress({ ...address, city: e.target.value })}
 />
 </div>

 <div className="form-group">
 <label>State *</label>
 <input
 type="text"
 placeholder="State"
 value={address.state}
 onChange={(e) => setAddress({ ...address, state: e.target.value })}
 />
 </div>

 <div className="form-group">
 <label>Pincode *</label>
 <input
 type="text"
 placeholder="6-digit pincode"
 maxLength={6}
 value={address.pincode}
 onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
 />
 </div>

 <div className="form-group full-width">
 <label>Address Type</label>
 <div className="address-type-buttons">
 <button
 className={`address-type-btn ${address.addressType === 'home' ? 'active' : ''}`}
 onClick={() => setAddress({ ...address, addressType: 'home' })}
 >
 <Home size={18} />
 Home
 </button>
 <button
 className={`address-type-btn ${address.addressType === 'work' ? 'active' : ''}`}
 onClick={() => setAddress({ ...address, addressType: 'work' })}
 >
 <Building size={18} />
 Work
 </button>
 </div>
 </div>
 </div>

 <div className="checkout-actions">
 <button className="btn btn-outline" onClick={() => navigate('/cart')}>
 Back to Cart
 </button>
 <button className="btn btn-accent" onClick={handleAddressSubmit}>
 Continue to Payment
 </button>
 </div>
 </div>

 {/* Order Summary Sidebar */}
 <div className="checkout-sidebar">
 <h3>Order Summary</h3>
 <div className="summary-items">
 {cart.slice(0, 3).map((item) => (
 <div key={item.id} className="summary-item">
 <img src={item.image} alt={item.name} />
 <div>
 <p>{item.name}</p>
 <span>Qty: {item.quantity}</span>
 </div>
 <span>₹{(item.price * item.quantity).toLocaleString()}</span>
 </div>
 ))}
 {cart.length > 3 && (
 <p className="more-items">+{cart.length - 3} more items</p>
 )}
 </div>
 <div className="summary-total">
 <span>Total Amount</span>
 <span>₹{cartTotal.toLocaleString()}</span>
 </div>
 </div>
 </div>
 )}

 {/* Step 2: Payment Method */}
 {currentStep === 2 && (
 <div className="checkout-content">
 <div className="checkout-card">
 <h2 className="checkout-title">
 <CreditCard size={24} />
 Select Payment Method
 </h2>

 <div className="payment-methods">
 <div
 className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
 onClick={() => setPaymentMethod('cod')}
 >
 <div className="payment-radio">
 <div className="radio-circle"></div>
 </div>
 <div className="payment-info">
 <h4>💵 Cash on Delivery</h4>
 <p>Pay when you receive the product</p>
 </div>
 </div>

 <div
 className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
 onClick={() => setPaymentMethod('card')}
 >
 <div className="payment-radio">
 <div className="radio-circle"></div>
 </div>
 <div className="payment-info">
 <h4>💳 Credit/Debit Card</h4>
 <p>Visa, Mastercard, Rupay accepted</p>
 </div>
 </div>

 <div
 className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
 onClick={() => setPaymentMethod('upi')}
 >
 <div className="payment-radio">
 <div className="radio-circle"></div>
 </div>
 <div className="payment-info">
 <h4>📱 UPI Payment</h4>
 <p>Google Pay, PhonePe, Paytm</p>
 </div>
 </div>
 </div>

 <div className="checkout-actions">
 <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>
 Back to Address
 </button>
 <button className="btn btn-accent" onClick={handlePaymentSubmit}>
 Review Order
 </button>
 </div>
 </div>

 <div className="checkout-sidebar">
 <h3>Delivery Address</h3>
 <div className="address-preview">
 <p><strong>{address.fullName}</strong></p>
 <p>{address.phone}</p>
 <p>{address.addressLine1}</p>
 {address.addressLine2 && <p>{address.addressLine2}</p>}
 <p>{address.city}, {address.state} - {address.pincode}</p>
 </div>
 <div className="summary-total">
 <span>Total Amount</span>
 <span>₹{cartTotal.toLocaleString()}</span>
 </div>
 </div>
 </div>
 )}

 {/* Step 3: Review Order */}
 {currentStep === 3 && (
 <div className="checkout-content">
 <div className="checkout-card">
 <h2 className="checkout-title">
 <CheckCircle size={24} />
 Review Your Order
 </h2>

 <div className="review-section">
 <h3>Delivery Address</h3>
 <div className="review-box">
 <p><strong>{address.fullName}</strong></p>
 <p>{address.phone}</p>
 <p>{address.addressLine1}, {address.addressLine2}</p>
 <p>{address.city}, {address.state} - {address.pincode}</p>
 <span className="address-badge">{address.addressType === 'home' ? '🏠 Home' : '🏢 Work'}</span>
 </div>
 </div>

 <div className="review-section">
 <h3>Payment Method</h3>
 <div className="review-box">
 <p>
 {paymentMethod === 'cod' && '💵 Cash on Delivery'}
 {paymentMethod === 'card' && '💳 Credit/Debit Card'}
 {paymentMethod === 'upi' && '📱 UPI Payment'}
 </p>
 </div>
 </div>

 <div className="review-section">
 <h3>Order Items ({cart.length})</h3>
 <div className="review-items">
 {cart.map((item) => (
 <div key={item.id} className="review-item">
 <img src={item.image} alt={item.name} />
 <div className="review-item-info">
 <h4>{item.name}</h4>
 <p>Quantity: {item.quantity}</p>
 </div>
 <span className="review-price">₹{(item.price * item.quantity).toLocaleString()}</span>
 </div>
 ))}
 </div>
 </div>

 <div className="checkout-actions">
 <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>
 Back to Payment
 </button>
 <button className="btn btn-accent place-order-btn" onClick={handlePlaceOrder}>
 Place Order - ₹{cartTotal.toLocaleString()}
 </button>
 </div>
 </div>

 <div className="checkout-sidebar">
 <h3>Price Details</h3>
 <div className="price-breakdown">
 <div className="price-row">
 <span>Price ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
 <span>₹{cartTotal.toLocaleString()}</span>
 </div>
 <div className="price-row">
 <span>Delivery Charges</span>
 <span className="free-text">FREE</span>
 </div>
 <div className="price-divider"></div>
 <div className="price-row total-price">
 <span>Total Amount</span>
 <span>₹{cartTotal.toLocaleString()}</span>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Step 4: Order Confirmed */}
 {currentStep === 4 && (
 <div className="order-success">
 <div className="success-animation">
 <CheckCircle size={80} className="success-icon" />
 </div>
 <h1>Order Placed Successfully 🎉</h1>
 <p className="order-id">Order ID: <strong>{orderId}</strong></p>
 <p className="success-message">
 Thank you for shopping with Millance Your order has been confirmed and will be delivered soon.
 </p>

 <div className="order-details-card">
 <h3>Delivery Details</h3>
 <div className="delivery-info">
 <p><strong>Delivering to:</strong></p>
 <p>{address.fullName} • {address.phone}</p>
 <p>{address.addressLine1}, {address.city}</p>
 <p><strong>Expected Delivery:</strong> {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
 </div>
 </div>

 <div className="success-actions">
 <button className="btn btn-accent" onClick={() => navigate('/orders')}>
 View Order Details
 </button>
 <button className="btn btn-outline" onClick={() => navigate('/')}>
 Continue Shopping
 </button>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

export default Checkout;
