import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar } from 'lucide-react';
import './Orders.css';

const Orders= () => {
 const navigate = useNavigate();
 const [orders, setOrders] = useState([]);

 useEffect(() => {
 const savedOrders = localStorage.getItem('millance-orders');
 if (savedOrders) {
 setOrders(JSON.parse(savedOrders));
 }
 }, []);

 const getStatusIcon = (status) => {
 switch (status) {
 case 'Processing':
 return <Clock size={20} className="status-icon processing" />;
 case 'Shipped':
 return <Truck size={20} className="status-icon shipped" />;
 case 'Delivered':
 return <CheckCircle size={20} className="status-icon delivered" />;
 default:
 return <Package size={20} className="status-icon" />;
 }
 };

 const formatDate = (dateString) => {
 return new Date(dateString).toLocaleDateString('en-IN', {
 day: 'numeric',
 month: 'long',
 year: 'numeric'
 });
 };

 const formatTime = (dateString) => {
 return new Date(dateString).toLocaleTimeString('en-IN', {
 hour: '2-digit',
 minute: '2-digit'
 });
 };

 const getDaysUntilDelivery = (deliveryDate) => {
 const today = new Date();
 const delivery = new Date(deliveryDate);
 const diffTime = delivery.getTime() - today.getTime();
 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
 return diffDays;
 };

 if (orders.length === 0) {
 return (
 <div className="empty-orders">
 <div className="container">
 <div className="empty-state">
 <Package size={80} strokeWidth={1} />
 <h2>No Orders Yet</h2>
 <p>You haven't placed any orders. Start shopping to see your orders here!</p>
 <button className="btn btn-accent" onClick={() => navigate('/')}>
 Start Shopping
 </button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="orders-page">
 <div className="container">
 <div className="orders-header">
 <h1 className="page-title">My Orders ({orders.length})</h1>
 </div>

 <div className="orders-list">
 {orders.map((order) => (
 <div key={order.id} className="order-card">
 {/* Order Header */}
 <div className="order-header">
 <div className="order-header-left">
 <div className="order-id-section">
 <h3>Order ID: {order.id}</h3>
 <div className="order-status">
 {getStatusIcon(order.status)}
 <span className={`status-text ${order.status.toLowerCase()}`}>
 {order.status}
 </span>
 </div>
 </div>
 <div className="order-date">
 <Calendar size={16} />
 <span>Ordered on {formatDate(order.orderDate)} at {formatTime(order.orderDate)}</span>
 </div>
 </div>
 <div className="order-total">
 <span className="total-label">Total Amount</span>
 <span className="total-amount">₹{order.total.toLocaleString()}</span>
 </div>
 </div>

 {/* Delivery Information */}
 <div className="delivery-tracker">
 <div className="tracker-left">
 <Truck size={24} className="truck-icon" />
 <div className="delivery-details">
 {getDaysUntilDelivery(order.deliveryDate) > 0 ? (
 <>
 <h4>Arriving in {getDaysUntilDelivery(order.deliveryDate)} days</h4>
 <p className="delivery-date">
 Expected delivery: <strong>{formatDate(order.deliveryDate)}</strong>
 </p>
 </>
 ) : (
 <>
 <h4>Delivered!</h4>
 <p className="delivery-date">
 Delivered on: <strong>{formatDate(order.deliveryDate)}</strong>
 </p>
 </>
 )}
 </div>
 </div>
 <div className="tracker-progress">
 <div className="progress-bar">
 <div className="progress-fill" style={{ width: order.status === 'Delivered' ? '100%' : order.status === 'Shipped' ? '66%' : '33%' }}></div>
 </div>
 <div className="progress-steps">
 <div className={`progress-step ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'active' : ''}`}>
 <div className="step-dot"></div>
 <span>Confirmed</span>
 </div>
 <div className={`progress-step ${order.status === 'Shipped' || order.status === 'Delivered' ? 'active' : ''}`}>
 <div className="step-dot"></div>
 <span>Shipped</span>
 </div>
 <div className={`progress-step ${order.status === 'Delivered' ? 'active' : ''}`}>
 <div className="step-dot"></div>
 <span>Delivered</span>
 </div>
 </div>
 </div>
 </div>

 {/* Delivery Address */}
 <div className="order-address">
 <MapPin size={18} />
 <div>
 <p><strong>Delivery Address:</strong></p>
 <p>{order.address.fullName} • {order.address.phone}</p>
 <p>{order.address.addressLine1}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
 </div>
 </div>

 {/* Order Items */}
 <div className="order-items">
 <h4>Items in this order ({order.items.length})</h4>
 <div className="order-items-grid">
 {order.items.map((item, index) => (
 <div key={index} className="order-item" onClick={() => navigate(`/product/${item.id}`)}>
 <img src={item.image} alt={item.name} />
 <div className="order-item-info">
 <h5>{item.name}</h5>
 <p>Quantity: {item.quantity}</p>
 <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Payment Method */}
 <div className="order-payment">
 <span className="payment-label">Payment Method:</span>
 <span className="payment-value">
 {order.paymentMethod === 'cod' && '💵 Cash on Delivery'}
 {order.paymentMethod === 'card' && '💳 Credit/Debit Card'}
 {order.paymentMethod === 'upi' && '📱 UPI Payment'}
 </span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};

export default Orders;
