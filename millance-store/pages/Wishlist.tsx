import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/common/ProductCard';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist">
        <div className="container">
          <div className="empty-state">
            <Heart size={80} strokeWidth={1} />
            <h2>Your Wishlist is Empty</h2>
            <p>Add products you love to your wishlist</p>
            <button className="btn btn-accent" onClick={() => navigate('/')}>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="page-title">My Wishlist ({wishlist.length} items)</h1>
        <div className="wishlist-grid">
          {wishlist.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
