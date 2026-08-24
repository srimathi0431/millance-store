import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useVendorAuth } from '../contexts/VendorAuthContext';
import VendorLayout from '../layouts/VendorLayout';
import VendorLogin from '../pages/VendorLogin';
import VendorDashboard from '../pages/VendorDashboard';
import VendorProducts from '../pages/VendorProducts';
import VendorOrders from '../pages/VendorOrders';
import VendorProfile from '../pages/VendorProfile';

const Protected = ({ children }) => {
 const { isAuthenticated, isLoading } = useVendorAuth();
 if (isLoading) return (
 <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#F8FAFC' }}>
 <div style={{ textAlign:'center' }}>
 <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #7B2FF7', borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 10px' }} />
 <div style={{ fontSize:13, color:'#64748B' }}>Loading...</div>
 </div>
 </div>
 );
 return isAuthenticated ? <>{children}</> : <Navigate to="/vendor/login" replace />;
};

const VendorRoutes = () => (
 <Routes>
 <Route path="login" element={<VendorLogin />} />
 <Route path="" element={<Navigate to="/vendor/dashboard" replace />} />
 <Route element={<Protected><VendorLayout /></Protected>}>
 <Route path="dashboard" element={<VendorDashboard />} />
 <Route path="products" element={<VendorProducts />} />
 <Route path="orders" element={<VendorOrders />} />
 <Route path="profile" element={<VendorProfile />} />
 <Route path="*" element={<Navigate to="/vendor/dashboard" replace />} />
 </Route>
 </Routes>
);

export default VendorRoutes;
