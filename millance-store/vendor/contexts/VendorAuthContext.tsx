import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { vendorAuthApi } from '../services/vendorApi';

interface VendorUser {
  id: number;
  email: string;
  role: string;
  name?: string;
}

interface VendorAuthContextType {
  vendor: VendorUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const VendorAuthContext = createContext<VendorAuthContextType | null>(null);

export const VendorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendor, setVendor] = useState<VendorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem('vendor_access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      // Fetch fresh vendor profile from backend on every page load
      const res = await vendorAuthApi.me();
      const user: VendorUser = {
        id:    res.data.id,
        email: res.data.email,
        role:  res.data.role,
        name:  res.data.name,
      };
      localStorage.setItem('vendor_user', JSON.stringify(user));
      setVendor(user);
    } catch {
      // Token expired or invalid — clear session
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

  const login = async (email: string, password: string) => {
    // POST /api/admin/auth/login — same endpoint, role validated server-side
    const res = await vendorAuthApi.login(email, password);
    const { access_token, refresh_token } = res.data;

    // Store real tokens
    localStorage.setItem('vendor_access_token', access_token);
    if (refresh_token) {
      localStorage.setItem('vendor_refresh_token', refresh_token);
    }

    // Fetch real vendor profile immediately after login
    const meRes = await vendorAuthApi.me();
    const user: VendorUser = {
      id:    meRes.data.id,
      email: meRes.data.email,
      role:  meRes.data.role,
      name:  meRes.data.name,
    };
    localStorage.setItem('vendor_user', JSON.stringify(user));
    setVendor(user);
  };

  const logout = () => {
    const refreshToken = localStorage.getItem('vendor_refresh_token');
    try {
      if (refreshToken) {
        vendorAuthApi.logout(refreshToken).catch(() => {/* ignore */});
      }
    } finally {
      localStorage.removeItem('vendor_access_token');
      localStorage.removeItem('vendor_refresh_token');
      localStorage.removeItem('vendor_user');
      setVendor(null);
    }
  };

  return (
    <VendorAuthContext.Provider
      value={{ vendor, isLoading, isAuthenticated: !!vendor, login, logout }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) throw new Error('useVendorAuth must be used within VendorAuthProvider');
  return ctx;
};
