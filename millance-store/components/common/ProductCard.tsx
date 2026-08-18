import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/types';
import { OptimizedImage } from './OptimizedImage';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  
  const discountPercentage = product.discount || 
    (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);

  const inWishlist = isInWishlist(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Badge */}
      {product.badge && (
        <span className={`product-badge badge-${product.badge}`}>
          {product.badge === 'new' && 'New'}
          {product.badge === 'bestseller' && 'Best Seller'}
          {product.badge === 'sale' && 'Limited Deal'}
          {product.badge === 'exclusive' && 'Exclusive'}
        </span>
      )}

      {/* Wishlist Button */}
      <button 
        className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
        onClick={handleWishlistClick}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Product Image */}
      <div className="product-image">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          productName={product.name}
          className="product-img"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        {/* Rating */}
        <div className="product-rating">
          <div className="rating-stars">
            <Star size={14} fill="currentColor" />
            <span className="rating-value">{product.rating}</span>
          </div>
          <span className="rating-reviews">({product.reviews})</span>
        </div>

        {/* Seller Info */}
        {product.seller.verified && (
          <div className="seller-info">
            <span className="seller-badge">✓ {product.seller.name}</span>
          </div>
        )}

        {/* Price */}
        <div className="product-price">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <>
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
              <span className="discount-badge">{discountPercentage}% OFF</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="product-actions">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
