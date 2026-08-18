// ═══════════════════════════════════════════════════════════════════
// MILLANCE STORE - PROFESSIONAL CATEGORIES PAGE
// ═══════════════════════════════════════════════════════════════════
// Production-ready e-commerce design with real images (NO emojis)
// ═══════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Grid, List, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { CATEGORIES, ALL_PRODUCTS } from '@/constants/mockData';
import ProductCard from '@/components/common/ProductCard';
import './Categories.css';

// ═══════════════════════════════════════════════════════════════════
// REAL CATEGORY IMAGES - Now using images from CATEGORIES data
// ═══════════════════════════════════════════════════════════════════
const getCategoryImage = (_categoryName: string, categoryData?: any): string => {
  // Use image from category data if available
  if (categoryData?.image) {
    return categoryData.image;
  }
  
  // Fallback image
  return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop&q=90';
};

const Categories: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // Find category by ID or by name (case-insensitive, partial match)
  const category = CATEGORIES.find((c) => 
    c.id === categoryId || 
    c.name.toLowerCase() === categoryId?.toLowerCase() ||
    c.name.toLowerCase().includes(categoryId?.toLowerCase() || '') ||
    categoryId?.toLowerCase().includes(c.name.toLowerCase())
  );
  
  // Filter products by category
  let products = categoryId 
    ? ALL_PRODUCTS.filter(p => {
        const categoryMatch = category 
          ? p.category.toLowerCase().includes(category.name.toLowerCase()) ||
            p.category.toLowerCase() === categoryId.toLowerCase()
          : p.category.toLowerCase().includes(categoryId.toLowerCase());
        
        const searchMatch = searchQuery 
          ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        
        return categoryMatch || searchMatch;
      })
    : ALL_PRODUCTS;

  // Sort products
  if (sortBy === 'price-low') {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    products = [...products].reverse();
  } else if (sortBy === 'rating') {
    products = [...products].sort((a, b) => b.rating - a.rating);
  }

  // ═══════════════════════════════════════════════════════════════════
  // ALL CATEGORIES VIEW (NO EMOJIS - PROFESSIONAL DESIGN)
  // ═══════════════════════════════════════════════════════════════════
  if (!categoryId) {
    return (
      <div className="categories-professional-page">
        {/* Header */}
        <div className="categories-pro-header">
          <div className="container-pro">
            <button className="back-btn-pro" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-pro">
          <div className="categories-pro-hero">
            <h1 className="categories-pro-title">Shop by Category</h1>
            <p className="categories-pro-subtitle">Browse our wide selection of premium products</p>
          </div>

          {/* Category Grid - Professional Design */}
          <div className="categories-pro-grid">
            {CATEGORIES.map((cat, index) => (
              <motion.div
                key={cat.id}
                className="category-pro-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onClick={() => navigate(`/categories/${cat.id}`)}
              >
                {/* Real Category Image */}
                <div className="category-pro-image">
                  <img 
                    src={getCategoryImage(cat.name, cat)} 
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="category-pro-overlay"></div>
                </div>

                {/* Category Info */}
                <div className="category-pro-content">
                  <h3 className="category-pro-name">{cat.name}</h3>
                  <p className="category-pro-count">{cat.count}+ Products</p>
                  <button className="category-pro-btn">
                    View Products
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY DETAIL VIEW (PROFESSIONAL E-COMMERCE DESIGN)
  // ═══════════════════════════════════════════════════════════════════
  if (!category) {
    return (
      <div className="categories-professional-page">
        <div className="container-pro">
          <div className="category-not-found-pro">
            <h2>Category Not Found</h2>
            <p>The category you're looking for doesn't exist.</p>
            <button className="btn-pro-primary" onClick={() => navigate('/categories')}>
              View All Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-detail-professional">
      {/* Breadcrumb */}
      <div className="category-breadcrumb">
        <div className="container-pro">
          <button onClick={() => navigate('/')} className="breadcrumb-link">Home</button>
          <ChevronRight size={16} />
          <button onClick={() => navigate('/categories')} className="breadcrumb-link">Categories</button>
          <ChevronRight size={16} />
          <span className="breadcrumb-current">{category.name}</span>
        </div>
      </div>

      {/* Category Banner */}
      <div className="category-banner-pro">
        <div className="container-pro">
          <div className="category-banner-content">
            <div className="category-banner-image">
              <img src={getCategoryImage(category.name, category)} alt={category.name} />
            </div>
            <div className="category-banner-info">
              <h1 className="category-banner-title">{category.name}</h1>
              <p className="category-banner-description">
                Discover {category.count}+ premium products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Sort Bar */}
      <div className="category-toolbar">
        <div className="container-pro">
          <div className="toolbar-content">
            <div className="toolbar-left">
              <button className="toolbar-filter-btn">
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </button>
              <span className="toolbar-results">{products.length} Products</span>
            </div>

            <div className="toolbar-right">
              <select 
                className="toolbar-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Best Rated</option>
              </select>

              <div className="toolbar-view-toggle">
                <button 
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="category-products-section">
        <div className="container-pro">
          {products.length === 0 ? (
            <div className="no-products-pro">
              <h3>No Products Found</h3>
              <p>Try adjusting your filters or browse other categories</p>
              <button className="btn-pro-primary" onClick={() => navigate('/categories')}>
                View All Categories
              </button>
            </div>
          ) : (
            <div className={`products-grid-pro ${viewMode}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
