import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, Star, Heart } from 'lucide-react';
import { ALL_PRODUCTS } from '@/constants/mockData';
import { useApp } from '@/context/AppContext';
import './SearchResults.css';

const SearchResults= () => {
 const [searchParams] = useSearchParams();
 const query = searchParams.get('q') || '';
 const navigate = useNavigate();
 const { addToCart, addToWishlist } = useApp();
 
 const [sortBy, setSortBy] = useState('relevance');
 const [filterCategory, setFilterCategory] = useState('all');

 // Search products
 const searchResults = useMemo(() => {
 if (!query.trim()) return [];

 const lowerQuery = query.toLowerCase().trim();
 
 const results = ALL_PRODUCTS.filter(product => {
 const nameMatch = product.name.toLowerCase().includes(lowerQuery);
 const descMatch = product.description.toLowerCase().includes(lowerQuery);
 const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
 
 return nameMatch || descMatch || categoryMatch;
 });

 // Apply category filter
 let filtered = filterCategory === 'all' 
 ? results 
 : results.filter(p => p.category === filterCategory);

 // Apply sorting
 switch (sortBy) {
 case 'price-low':
 return [...filtered].sort((a, b) => a.price - b.price);
 case 'price-high':
 return [...filtered].sort((a, b) => b.price - a.price);
 case 'rating':
 return [...filtered].sort((a, b) => b.rating - a.rating);
 case 'newest':
 return [...filtered].sort((a, b) => 
 (b.badge === 'new' ? 1 : 0) - (a.badge === 'new' ? 1 : 0)
 );
 default:
 return filtered;
 }
 }, [query, sortBy, filterCategory]);

 // Get unique categories from results
 const availableCategories = useMemo(() => {
 if (!query.trim()) return [];
 
 const lowerQuery = query.toLowerCase().trim();
 const matchingProducts = ALL_PRODUCTS.filter(product => {
 const nameMatch = product.name.toLowerCase().includes(lowerQuery);
 const descMatch = product.description.toLowerCase().includes(lowerQuery);
 const categoryMatch = product.category.toLowerCase().includes(lowerQuery);
 return nameMatch || descMatch || categoryMatch;
 });

 const categories = [...new Set(matchingProducts.map(p => p.category))];
 return categories.sort();
 }, [query]);

 return (
 <div className="search-results">
 {/* Header */}
 <header className="search-results__header">
 <div className="container">
 <button className="back-btn" onClick={() => navigate('/')}>
 ← Back to Home
 </button>
 </div>
 </header>

 <div className="container">
 <div className="search-results__container">
 {/* Results Header */}
 <div className="search-results__top">
 <div className="search-results__info">
 <h1 className="search-results__title">
 <Search size={24} />
 Search results for "{query}"
 </h1>
 <p className="search-results__count">
 {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
 </p>
 </div>

 <div className="search-results__controls">
 {/* Category Filter */}
 {availableCategories.length > 0 && (
 <select 
 className="search-results__select"
 value={filterCategory}
 onChange={(e) => setFilterCategory(e.target.value)}
 >
 <option value="all">All Categories</option>
 {availableCategories.map(cat => (
 <option key={cat} value={cat}>{cat}</option>
 ))}
 </select>
 )}

 {/* Sort Filter */}
 <select 
 className="search-results__select"
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 >
 <option value="relevance">Sort: Relevance</option>
 <option value="price-low">Price: Low to High</option>
 <option value="price-high">Price: High to Low</option>
 <option value="rating">Customer Rating</option>
 <option value="newest">Newest First</option>
 </select>
 </div>
 </div>

 {/* Results Grid */}
 {searchResults.length > 0 ? (
 <div className="search-results__grid">
 {searchResults.map(product => (
 <ProductCard
 key={product.id}
 product={product}
 onViewDetails={() => navigate(`/product/${product.id}`)}
 onAddToCart={() => addToCart(product)}
 onAddToWishlist={() => addToWishlist(product)}
 />
 ))}
 </div>
 ) : (
 <div className="search-results__empty">
 <Search size={64} />
 <h2>No products found for "{query}"</h2>
 <p>Try different keywords or browse our categories</p>
 <button 
 className="btn-primary"
 onClick={() => navigate('/categories')}
 >
 Browse Categories
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

// Product Card Component

const ProductCard= ({
 product,
 onViewDetails,
 onAddToCart,
 onAddToWishlist,
}) => {
 return (
 <div className="product-card-search">
 {/* Product Image */}
 <div className="product-card-search__image-wrapper">
 <img 
 src={product.image} 
 alt={product.name} 
 className="product-card-search__image"
 onClick={onViewDetails}
 />
 <button
 className="product-card-search__wishlist"
 onClick={(e) => {
 e.stopPropagation();
 onAddToWishlist();
 }}
 title="Add to Wishlist"
 >
 <Heart size={18} />
 </button>
 {product.badge && (
 <span className={`product-card-search__badge ${product.badge}`}>
 {product.badge === 'bestseller' && 'Bestseller'}
 {product.badge === 'new' && 'New'}
 {product.badge === 'sale' && 'Sale'}
 {product.badge === 'exclusive' && 'Exclusive'}
 </span>
 )}
 {product.discount && (
 <span className="product-card-search__discount">
 {product.discount}% OFF
 </span>
 )}
 </div>

 {/* Product Details */}
 <div className="product-card-search__details">
 <span className="product-card-search__category">{product.category}</span>
 <h3 className="product-card-search__name" onClick={onViewDetails}>
 {product.name}
 </h3>
 <p className="product-card-search__description">
 {product.description}
 </p>

 {/* Rating */}
 <div className="product-card-search__rating">
 <div className="stars">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 size={14}
 fill={i < Math.floor(product.rating) ? '#C8A23A' : '#E5E5E5'}
 color="transparent"
 />
 ))}
 </div>
 <span className="rating-value">{product.rating}</span>
 <span className="rating-count">({product.reviews.toLocaleString()})</span>
 </div>

 {/* Price */}
 <div className="product-card-search__price-section">
 <div className="product-card-search__price">
 <span className="price-symbol">₹</span>
 <span className="price-value">{product.price.toLocaleString()}</span>
 </div>
 {product.originalPrice && (
 <div className="product-card-search__original-price">
 <span className="strikethrough">₹{product.originalPrice.toLocaleString()}</span>
 <span className="discount-percent">({product.discount}% off)</span>
 </div>
 )}
 </div>

 {/* Stock Status */}
 <div className={`product-card-search__stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
 {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
 </div>

 {/* Actions */}
 <div className="product-card-search__actions">
 <button
 className="btn-add-to-cart"
 onClick={(e) => {
 e.stopPropagation();
 onAddToCart();
 }}
 disabled={!product.inStock}
 >
 <ShoppingCart size={18} />
 Add to Cart
 </button>
 <button
 className="btn-view-details"
 onClick={onViewDetails}
 >
 View Details
 </button>
 </div>
 </div>
 </div>
 );
};

export default SearchResults;
