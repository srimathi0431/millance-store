import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import Categories from '@/components/home/Categories';
import FlashSale from '@/components/home/FlashSale';
import TodaysDeals from '@/components/home/TodaysDeals';
import FeaturedStores from '@/components/home/FeaturedStores';
import ProductSlider from '@/components/home/ProductSlider';
import TopBrands from '@/components/home/TopBrands';
import CustomerReviews from '@/components/home/CustomerReviews';
import DownloadApp from '@/components/home/DownloadApp';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Banner Carousel */}
        <HeroBanner />

        {/* Categories Section */}
        <Categories />

        {/* Flash Sale Section */}
        <FlashSale />

        {/* Today's Deals Section */}
        <TodaysDeals />

        {/* Featured Stores Section */}
        <FeaturedStores />

        {/* Trending Products Section */}
        <ProductSlider 
          title="🔥 Trending Products" 
          products={MOCK_PRODUCTS.slice(0, 8)}
          viewAllLink="/trending"
        />

        {/* Best Sellers Section */}
        <ProductSlider 
          title="⭐ Best Sellers" 
          products={MOCK_PRODUCTS.slice(2, 10)}
          viewAllLink="/bestsellers"
        />

        {/* New Arrivals Section */}
        <ProductSlider 
          title="🆕 New Arrivals" 
          products={MOCK_PRODUCTS.slice(1, 9)}
          viewAllLink="/new-arrivals"
        />

        {/* Top Brands Section */}
        <TopBrands />

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Download App Section */}
        <DownloadApp />
      </div>
    </div>
  );
};

export default Home;
