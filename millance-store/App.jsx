import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/AppContext';

// Customer pages
import AmazonHome from '@/pages/AmazonHome';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Categories from '@/pages/Categories';
import SearchResults from '@/pages/SearchResults';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Orders from '@/pages/Orders';
import Checkout from '@/pages/Checkout';
import Membership from '@/pages/Membership';
import NotFound from '@/pages/NotFound';

// Portal
import PortalSelect from '@/portal/PortalSelect';

// Admin
import AdminRoutes from '@/admin/routes/AdminRoutes';
import { AdminAuthProvider } from '@/admin/contexts/AdminAuthContext';
import { ToastProvider } from '@/admin/components/Toast';

// Vendor
import VendorRoutes from '@/vendor/routes/VendorRoutes';
import { VendorAuthProvider } from '@/vendor/contexts/VendorAuthContext';

import './styles/global.css';

const queryClient = new QueryClient({
 defaultOptions: {
 queries: { retry: 1, staleTime: 30_000 },
 },
});

const App = () => {
 return (
 <QueryClientProvider client={queryClient}>
 <Router>
 <Routes>

 {/* Portal Selection */}
 <Route path="/portal" element={<PortalSelect />} />

 {/* Admin Panel */}
 <Route
 path="/admin/*"
 element={
 <AdminAuthProvider>
 <ToastProvider>
 <AdminRoutes />
 </ToastProvider>
 </AdminAuthProvider>
 }
 />

 {/* Vendor Panel */}
 <Route
 path="/vendor/*"
 element={
 <VendorAuthProvider>
 <VendorRoutes />
 </VendorAuthProvider>
 }
 />

 {/* Customer Store */}
 <Route
 path="/*"
 element={
 <AppProvider>
 <Routes>
 <Route path="/" element={<AmazonHome />} />
 <Route path="/home" element={<AmazonHome />} />
 <Route path="/products" element={<Categories />} />
 <Route path="/categories" element={<Categories />} />
 <Route path="/categories/:categoryId" element={<Categories />} />
 <Route path="/product/:productId" element={<ProductDetail />} />
 <Route path="/search" element={<SearchResults />} />
 <Route path="/cart" element={<Cart />} />
 <Route path="/checkout" element={<Checkout />} />
 <Route path="/wishlist" element={<Wishlist />} />
 <Route path="/signin" element={<SignIn />} />
 <Route path="/signup" element={<SignUp />} />
 <Route path="/login" element={<SignIn />} />
 <Route path="/register" element={<SignUp />} />
 <Route path="/orders" element={<Orders />} />
 <Route path="/account" element={<Orders />} />
 <Route path="/profile" element={<Orders />} />
 <Route path="/deals" element={<AmazonHome />} />
 <Route path="/bestsellers" element={<Categories />} />
 <Route path="/new-arrivals" element={<Categories />} />
 <Route path="/trending" element={<Categories />} />
 <Route path="/membership" element={<Membership />} />
 <Route path="/about" element={<PlaceholderPage title="About Us" />} />
 <Route path="/sell" element={<PlaceholderPage title="Sell on Millance" />} />
 <Route path="/help" element={<PlaceholderPage title="Help & Support" />} />
 <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
 <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
 <Route path="/shipping" element={<PlaceholderPage title="Shipping Policy" />} />
 <Route path="/returns" element={<PlaceholderPage title="Returns & Refunds" />} />
 <Route path="/terms" element={<PlaceholderPage title="Terms & Conditions" />} />
 <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
 <Route path="*" element={<NotFound />} />
 </Routes>
 </AppProvider>
 }
 />

 </Routes>
 </Router>
 </QueryClientProvider>
 );
};

const PlaceholderPage = ({ title }) => {
 const navigate = useNavigate();
 return (
 <div style={{ minHeight:'100vh', background:'#F6F5F1', padding:'100px 20px', textAlign:'center' }}>
 <h1 style={{ color:'#234437', fontSize:'36px', marginBottom:'16px' }}>{title}</h1>
 <p style={{ color:'#666', fontSize:'18px', marginBottom:'32px' }}>Coming Soon</p>
 <button onClick={() => navigate('/')}
 style={{ background:'#FF7A00', color:'white', border:'none', padding:'14px 40px', borderRadius:'8px', fontSize:'16px', fontWeight:600, cursor:'pointer' }}>
 Back to Home
 </button>
 </div>
 );
};

export default App;
