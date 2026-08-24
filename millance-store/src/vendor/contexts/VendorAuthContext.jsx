import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { vendorAuthApi } from '../services/vendorApi';

const VendorAuthContext = createContext(null);

// Dummy credentials for testing without backend
const DUMMY_VENDOR = {
  email: 'vendor@millance.store',
  password: '12345678',
  user: {
    id: 2,
    name: 'Vendor User',
    email: 'vendor@millance.store',
    role: 'vendor'
  }
};

const USE_DUMMY_AUTH = true; // Set to false when backend is ready

export const VendorAuthProvider = ({ children }) => {
 const [vendor, setVendor] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 const restoreSession = useCallback(async () => {
 const token = localStorage.getItem('vendor_access_token');
 if (!token) {
 setIsLoading(false);
 return;
 }
 
 if (USE_DUMMY_AUTH) {
   // Dummy mode: Load from localStorage
   const user = localStorage.getItem('vendor_user');
   if (user) {
     setVendor(JSON.parse(user));
   }
   setIsLoading(false);
   return;
 }
 
 try {
 const res = await vendorAuthApi.me();
 const user = {
 id: res.data.id,
 email: res.data.email,
 role: res.data.role,
 name: res.data.name,
 };
 localStorage.setItem('vendor_user', JSON.stringify(user));
 setVendor(user);
 } catch {
 localStorage.removeItem('vendor_access_token');
 localStorage.removeItem('vendor_user');
 setVendor(null);
 } finally {
 setIsLoading(false);
 }
 }, []);

 useEffect(() => {
 restoreSession();
 }, [restoreSession]);

 const login = async (email, password) => {
 if (USE_DUMMY_AUTH) {
   // Dummy mode: Check credentials
   if (email !== DUMMY_VENDOR.email || password !== DUMMY_VENDOR.password) {
     throw new Error('Invalid email or password');
   }
   
   // Set dummy tokens and user
   localStorage.setItem('vendor_access_token', 'dummy_vendor_token_' + Date.now());
   localStorage.setItem('vendor_refresh_token', 'dummy_vendor_refresh_' + Date.now());
   localStorage.setItem('vendor_user', JSON.stringify(DUMMY_VENDOR.user));
   setVendor(DUMMY_VENDOR.user);
   return;
 }
 
 const res = await vendorAuthApi.login(email, password);
 const { access_token, refresh_token } = res.data;
 localStorage.setItem('vendor_access_token', access_token);
 if (refresh_token) localStorage.setItem('vendor_refresh_token', refresh_token);
 const meRes = await vendorAuthApi.me();
 const user = {
 id: meRes.data.id,
 email: meRes.data.email,
 role: meRes.data.role,
 name: meRes.data.name,
 };
 localStorage.setItem('vendor_user', JSON.stringify(user));
 setVendor(user);
 };

 const logout = () => {
 if (USE_DUMMY_AUTH) {
   // Dummy mode: Just clear localStorage
   localStorage.removeItem('vendor_access_token');
   localStorage.removeItem('vendor_refresh_token');
   localStorage.removeItem('vendor_user');
   setVendor(null);
   return;
 }
 
 const refreshToken = localStorage.getItem('vendor_refresh_token');
 try {
 if (refreshToken) vendorAuthApi.logout(refreshToken).catch(() => {});
 } finally {
 localStorage.removeItem('vendor_access_token');
 localStorage.removeItem('vendor_refresh_token');
 localStorage.removeItem('vendor_user');
 setVendor(null);
 }
 };

 return (
 <VendorAuthContext.Provider value={{ vendor, isLoading, isAuthenticated: !!vendor, login, logout }}>
 {children}
 </VendorAuthContext.Provider>
 );
};

export const useVendorAuth = () => {
 const ctx = useContext(VendorAuthContext);
 if (!ctx) throw new Error('useVendorAuth must be used within VendorAuthProvider');
 return ctx;
};
