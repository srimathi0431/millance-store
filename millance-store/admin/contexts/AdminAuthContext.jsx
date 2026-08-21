import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
 const [admin, setAdmin] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 const refreshAdmin = useCallback(async () => {
 const token = localStorage.getItem('admin_access_token');
 if (!token) {
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
