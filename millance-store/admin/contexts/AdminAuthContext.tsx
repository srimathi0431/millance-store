import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  is_active: boolean;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      // Fetch real admin profile from backend — not stale localStorage JSON
      const res = await authApi.me();
      const user: AdminUser = res.data;
      localStorage.setItem('admin_user', JSON.stringify(user));
      setAdmin(user);
    } catch {
      // Token invalid or expired — clear everything
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

  const login = async (email: string, password: string) => {
    // POST /api/admin/auth/login — real API call
    const res = await authApi.login(email, password);
    const { access_token, refresh_token } = res.data;

    // Store real tokens
    localStorage.setItem('admin_access_token', access_token);
    localStorage.setItem('admin_refresh_token', refresh_token);

    // Fetch real admin profile immediately after login
    const meRes = await authApi.me();
    const user: AdminUser = meRes.data;
    localStorage.setItem('admin_user', JSON.stringify(user));
    setAdmin(user);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore logout errors — clear locally regardless
    } finally {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, isLoading, isAuthenticated: !!admin, login, logout, refreshAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
