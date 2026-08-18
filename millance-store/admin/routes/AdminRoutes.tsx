import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import AdminLayout from '../layouts/AdminLayout';
import LoginPage from '../pages/Login';
import DashboardPage from '../pages/Dashboard';
import ProductsPage from '../pages/Products';
import CategoriesPage from '../pages/Categories';
import SubCategoriesPage from '../pages/SubCategories';
import CategoryProductsPage from '../pages/CategoryProducts';
import InventoryPage from '../pages/Inventory';
import OrdersPage from '../pages/Orders';
import CustomersPage from '../pages/Customers';
import PaymentsPage from '../pages/Payments';
import CouponsPage from '../pages/Coupons';
import ReviewsPage from '../pages/Reviews';
import ReportsPage from '../pages/Reports';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  if (isLoading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#F8FAFC' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', border:'3px solid #FF7A00', borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
        <div style={{ fontSize:14, color:'#64748B' }}>Loading...</div>
      </div>
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
    <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route path="dashboard"  element={<DashboardPage />} />
      <Route path="products"   element={<ProductsPage />} />

      {/* ── Category 3-level navigation ───────────────────────── */}
      {/* Page 1: root categories */}
      <Route path="categories" element={<CategoriesPage />} />
      {/* Page 2: subcategories of a root category */}
      <Route path="categories/:catId" element={<SubCategoriesPage />} />
      {/* Page 3: products inside a subcategory */}
      <Route path="categories/:catId/:subId/products" element={<CategoryProductsPage />} />

      <Route path="inventory"  element={<InventoryPage />} />
      <Route path="orders"     element={<OrdersPage />} />
      <Route path="customers"  element={<CustomersPage />} />
      <Route path="payments"   element={<PaymentsPage />} />
      <Route path="coupons"    element={<CouponsPage />} />
      <Route path="reviews"    element={<ReviewsPage />} />
      <Route path="reports"    element={<ReportsPage />} />
      <Route path="*"          element={<Navigate to="/admin/dashboard" replace />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
