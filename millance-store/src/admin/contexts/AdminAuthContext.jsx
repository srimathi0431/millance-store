import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AdminAuthContext = createContext(null);

// Dummy credentials for testing without backend
const DUMMY_CREDENTIALS = {
  admin: {
    email: 'admin@millance.store',
    password: '12345678',
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@millance.store',
      role: 'SUPER_ADMIN',
      permissions: ['*']
    }
  },
  vendor: {
    email: 'vendor@millance.store',
    password: '12345678',
    user: {
      id: 2,
      name: 'Vendor User',
      email: 'vendor@millance.store',
      role: 'ADMIN',
      permissions: ['products.*', 'orders.*', 'inventory.*']
    }
  }
};

const USE_DUMMY_AUTH = true; // Set to false when backend is ready

export const AdminAuthProvider = ({ children }) => {
 const [admin, setAdmin] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 const refreshAdmin = useCallback(async () => {
 const token = localStorage.getItem('admin_access_token');
 if (!token) {
 setIsLoading(false);
 return;
 }
 
 if (USE_DUMMY_AUTH) {
   // Dummy mode: Load from localStorage
   const user = localStorage.getItem('admin_user');
   if (user) {
     setAdmin(JSON.parse(user));
   }
   setIsLoading(false);
   return;
 }
 
 try {
 const res = await authApi.me();
 const user = res.data;
 localStorage.setItem('admin_user', JSON.stringify(user));
 setAdmin(user);
 } catch {
 localStorage.removeItem('admin_access_token');
 localStorage.removeItem('admin_refresh_token');
 localStorage.removeItem('admin_user');
 setAdmin(null);
 } finally {
 setIsLoading(false);
 }
 }, []);

 useEffect(() => {
 refreshAdmin();
 }, [refreshAdmin]);

 const login = async (email, password) => {
 if (USE_DUMMY_AUTH) {
   // Dummy mode: Check credentials
   const dummyUser = Object.values(DUMMY_CREDENTIALS).find(
     cred => cred.email === email && cred.password === password
   );
   
   if (!dummyUser) {
     throw new Error('Invalid email or password');
   }
   
   // Set dummy tokens and user
   localStorage.setItem('admin_access_token', 'dummy_token_' + Date.now());
   localStorage.setItem('admin_refresh_token', 'dummy_refresh_' + Date.now());
   localStorage.setItem('admin_user', JSON.stringify(dummyUser.user));
   setAdmin(dummyUser.user);
   return;
 }
 
 const res = await authApi.login(email, password);
 const { access_token, refresh_token } = res.data;
 localStorage.setItem('admin_access_token', access_token);
 localStorage.setItem('admin_refresh_token', refresh_token);
 const meRes = await authApi.me();
 const user = meRes.data;
 localStorage.setItem('admin_user', JSON.stringify(user));
 setAdmin(user);
 };

 const logout = async () => {
 if (USE_DUMMY_AUTH) {
   // Dummy mode: Just clear localStorage
   localStorage.removeItem('admin_access_token');
   localStorage.removeItem('admin_refresh_token');
   localStorage.removeItem('admin_user');
   setAdmin(null);
   return;
 }
 
 const refreshToken = localStorage.getItem('admin_refresh_token');
 try {
 if (refreshToken) await authApi.logout(refreshToken);
 } catch {
 // ignore
 } finally {
 localStorage.removeItem('admin_access_token');
 localStorage.removeItem('admin_refresh_token');
 localStorage.removeItem('admin_user');
 setAdmin(null);
 }
 };

 return (
 <AdminAuthContext.Provider value={{ admin, isLoading, isAuthenticated: !!admin, login, logout, refreshAdmin }}>
 {children}
 </AdminAuthContext.Provider>
 );
};

export const useAdminAuth = () => {
 const ctx = useContext(AdminAuthContext);
 if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
 return ctx;
};
