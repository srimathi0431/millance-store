import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import './Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, cartTotal, clearCart } = useApp();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <div className="empty-state">
            <ShoppingBag size={80} strokeWidth={1} />
            <h2>Your Cart is Empty</h2>
            <p>Add products to your cart to see them here</p>
            <button className="btn btn-accent" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="page-title">Shopping Cart ({cart.length} items)</h1>
          <button className="btn btn-outline" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-grid">
          <div className="cart-items">
            {cart.map((item: any) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image" onClick={() => navigate(`/product/${item.id}`)}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/100x100/F6F3EB/234437?text=Product';
                    }}
                  />
                </div>

                <div className="cart-item-info">
                  <h3 className="cart-item-name" onClick={() => navigate(`/product/${item.id}`)}>
                    {item.name}
                  </h3>
                  <p className="cart-item-seller">Sold by {item.seller.name}</p>
                  <div className="cart-item-price">
                    <span className="cart-price">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <span className="cart-original-price">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity-controls">
                    <button
                      className="cart-quantity-btn"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="cart-quantity-value">{item.quantity}</span>
                    <button
                      className="cart-quantity-btn"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="cart-item-total">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cart.reduce((sum: number, item: any) => sum + item.quantity, 0)} items)</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <button className="btn btn-accent checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
