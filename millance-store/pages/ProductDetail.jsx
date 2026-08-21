import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingCart, Minus, Plus, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ALL_PRODUCTS } from '@/constants/mockData';
import Toast from '@/components/common/Toast';
import './ProductDetail.css';

const ProductDetail= () => {
 const { productId } = useParams();
 const navigate = useNavigate();
 const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
 
 const [quantity, setQuantity] = useState(1);
 const [selectedImage, setSelectedImage] = useState(0);
 const [toastMessage, setToastMessage] = useState(null);

 const product = ALL_PRODUCTS.find((p) => p.id === productId);

 if (!product) {
 return (
 <div className="container">
 <div className="error-state">
 <h2>Product Not Found</h2>
 <button className="btn btn-primary" onClick={() => navigate('/')}>
 Go to Home
 </button>
 </div>
 </div>
 );
 }

 const inWishlist = isInWishlist(product.id);

 const handleAddToCart = () => {
 console.log('Add to cart clicked - Quantity:', quantity);
 for (let i = 0; i < quantity; i++) {
 addToCart(product);
 }
 setToastMessage(`✓ ${quantity} × ${product.name} added to cart!`);
 console.log('Cart updated successfully');
 };

 const handleWishlistToggle = () => {
 if (inWishlist) {
 removeFromWishlist(product.id);
 setToastMessage(`♥ ${product.name} removed from wishlist`);
 } else {
 addToWishlist(product);
 setToastMessage(`♥ ${product.name} added to wishlist!`);
 }
 };

 return (
 <div className="product-detail-page">
 {/* Toast Notification */}
 {toastMessage && (
 <Toast 
 message={toastMessage} 
 type="success" 
 onClose={() => setToastMessage(null)} 
 />
 )}

 <div className="container">
 <button className="back-btn" onClick={() => navigate(-1)}>
 <ArrowLeft size={20} />
 <span>Back</span>
 </button>

 <div className="product-detail-grid">
 {/* Product Images */}
 <div className="product-images">
 <div className="main-image">
 <img 
 src={product.image}
 alt={product.name}
 className="product-detail-img"
 loading="lazy"
 onError={(e) => {
 e.currentTarget.src = 'https://via.placeholder.com/600x600/F6F3EB/234437?text=Product+Image';
 }}
 />
 </div>
 <div className="thumbnail-images">
 {[product.image, product.image, product.image, product.image].map((img, i) => (
 <button
 key={i}
 className={`thumbnail ${selectedImage === i ? 'active' : ''}`}
 onClick={() => setSelectedImage(i)}
 >
 <img src={img} alt={`View ${i + 1}`} loading="lazy" />
 </button>
 ))}
 </div>
 </div>

 {/* Product Info */}
 <div className="product-detail-info">
 {product.badge && (
 <span className={`product-badge-large badge-${product.badge}`}>
 {product.badge === 'new' && '🆕 New Arrival'}
 {product.badge === 'bestseller' && '🔥 Best Seller'}
 {product.badge === 'sale' && '💥 On Sale'}
 {product.badge === 'exclusive' && '⭐ Exclusive'}
 </span>
 )}

 <h1 className="product-title">{product.name}</h1>
 <p className="product-description-full">{product.description}</p>

 {/* Rating */}
 <div className="product-rating-large">
 <div className="rating-stars-large">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 size={20}
 fill={i < product.rating ? 'currentColor' : 'none'}
 />
 ))}
 <span className="rating-value-large">{product.rating}</span>
 </div>
 <span className="rating-reviews-large">({product.reviews} reviews)</span>
 </div>

 {/* Seller */}
 <div className="seller-info-large">
 <CheckCircle size={18} fill="currentColor" />
 <span>Sold by <strong>{product.seller.name}</strong></span>
 <span className="seller-rating">★ {product.seller.rating}</span>
 </div>

 {/* Price */}
 <div className="product-price-large">
 <span className="current-price-large">₹{product.price.toLocaleString()}</span>
 {product.originalPrice && (
 <>
 <span className="original-price-large">
 ₹{product.originalPrice.toLocaleString()}
 </span>
 <span className="discount-badge-large">
 {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
 </span>
 </>
 )}
 </div>

 {/* Stock Status */}
 <div className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
 {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
 </div>

 {/* Quantity */}
 <div className="quantity-selector">
 <label>Quantity:</label>
 <div className="quantity-controls">
 <button
 className="quantity-btn"
 onClick={() => setQuantity(Math.max(1, quantity - 1))}
 disabled={quantity <= 1}
 >
 <Minus size={18} />
 </button>
 <span className="quantity-value">{quantity}</span>
 <button
 className="quantity-btn"
 onClick={() => setQuantity(quantity + 1)}
 >
 <Plus size={18} />
 </button>
 </div>
 </div>

 {/* Actions */}
 <div className="product-actions-large">
 <button
 className="btn btn-accent add-to-cart-large"
 onClick={handleAddToCart}
 disabled={!product.inStock}
 >
 <ShoppingCart size={20} />
 <span>Add to Cart</span>
 </button>
 <button
 className={`btn ${inWishlist ? 'btn-primary' : 'btn-outline'} wishlist-btn-large`}
 onClick={handleWishlistToggle}
 >
 <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
 <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default ProductDetail;
