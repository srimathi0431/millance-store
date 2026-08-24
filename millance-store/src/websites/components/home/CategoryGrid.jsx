import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryGrid.css';

// Define homepage categories (matching Millance Store website)
const HOME_CATEGORIES = [
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    subcategories: [
      { name: 'Skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop' },
      { name: 'Makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop' },
      { name: 'Face Wash', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop' },
      { name: 'Perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop' },
    ],
  },
  {
    id: 'women-fashion',
    name: "Women's Fashion",
    subcategories: [
      { name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop' },
      { name: 'Tops & Shirts', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop' },
      { name: 'Ethnic Wear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop' },
      { name: 'Footwear', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop' },
    ],
  },
  {
    id: 'men-fashion',
    name: "Men's Fashion",
    subcategories: [
      { name: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop' },
      { name: 'Formal Shirts', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop' },
      { name: 'Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop' },
      { name: 'Shoes', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop' },
    ],
  },
  {
    id: 'fashion-accessories',
    name: 'Fashion Accessories',
    subcategories: [
      { name: 'Watches', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&h=300&fit=crop' },
      { name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=300&fit=crop' },
      { name: 'Bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop' },
      { name: 'Wallets', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop' },
    ],
  },
  {
    id: 'grocery-fresh',
    name: 'Grocery & Fresh',
    subcategories: [
      { name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop' },
      { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=300&fit=crop' },
      { name: 'Dairy Products', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop' },
      { name: 'Packaged Food', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=300&h=300&fit=crop' },
    ],
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    subcategories: [
      { name: 'Kitchen Appliances', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop' },
      { name: 'Cookware', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=300&h=300&fit=crop' },
      { name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop' },
      { name: 'Home Decor', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=300&fit=crop' },
    ],
  },
  {
    id: 'mobiles-tablets',
    name: 'Mobiles & Tablets',
    subcategories: [
      { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop' },
      { name: 'Tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop' },
      { name: 'Cases & Covers', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop' },
      { name: 'Power Banks', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics & TVs',
    subcategories: [
      { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop' },
      { name: 'Smart TVs', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop' },
      { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
      { name: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop' },
    ],
  },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="category-grid-home-section">
      <div className="category-grid-container">
        {HOME_CATEGORIES.map((category) => {
          return (
            <div key={category.id} className="category-grid-card">
              <h3 className="category-grid-title">{category.name}</h3>
              
              <div className="category-subcategories-grid">
                {category.subcategories.map((subcat, index) => (
                  <div 
                    key={index} 
                    className="category-subcat-item"
                    onClick={() => navigate(`/categories/${category.id}`)}
                  >
                    <img 
                      src={subcat.image} 
                      alt={subcat.name}
                      className="category-subcat-image"
                      loading="lazy"
                    />
                    <p className="category-subcat-name">{subcat.name}</p>
                  </div>
                ))}
              </div>
              
              <button 
                className="category-see-all-btn"
                onClick={() => navigate(`/categories/${category.id}`)}
              >
                See all products
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
