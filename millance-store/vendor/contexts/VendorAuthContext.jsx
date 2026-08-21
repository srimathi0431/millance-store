import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { vendorAuthApi } from '../services/vendorApi';

const VendorAuthContext = createContext(null);

export const VendorAuthProvider = ({ children }) => {
 const [vendor, setVendor] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 const restoreSession = useCallback(async () => {
 const token = localStorage.getItem('vendor_access_token');
 if (!token) {
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
