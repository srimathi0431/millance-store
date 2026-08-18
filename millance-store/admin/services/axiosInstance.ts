import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8026';

const adminAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Prevent concurrent refresh calls ─────────────────────────────────────────
let _refreshing = false;
let _refreshQueue: Array<(token: string | null) => void> = [];

function _onRefreshed(token: string | null) {
  _refreshQueue.forEach(cb => cb(token));
  _refreshQueue = [];
}

async function _tryRefreshToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('admin_refresh_token');
  if (!refreshToken) return null;
  try {
    // Use a plain axios instance (no interceptors) to avoid infinite loops
    const resp = await axios.post(`${BASE_URL}/api/admin/auth/refresh`, {
      refresh_token: refreshToken,
    });
    const data = resp.data;
    const newAccess  = data.access_token  ?? data.data?.access_token;
    const newRefresh = data.refresh_token ?? data.data?.refresh_token;
    if (!newAccess) return null;
    localStorage.setItem('admin_access_token',  newAccess);
    if (newRefresh) localStorage.setItem('admin_refresh_token', newRefresh);
    return newAccess;
  } catch {
    return null;
  }
}

// ── Request interceptor: attach admin Bearer token ────────────────────────────
adminAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: auto-refresh on 401, redirect to login if refresh fails
adminAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (_refreshing) {
        // Queue this request until the in-progress refresh completes
        return new Promise((resolve, reject) => {
          _refreshQueue.push((token) => {
            if (token) {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(adminAxios(original));
            } else {
              reject(error);
            }
          });
        });
      }

      _refreshing = true;
      const newToken = await _tryRefreshToken();
      _refreshing = false;

      if (newToken) {
        _onRefreshed(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return adminAxios(original);
      }

      // Refresh failed — clear session and redirect to login
      _onRefreshed(null);
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  },
);

/**
 * Extract a human-readable error message from an axios error.
 */
export function parseApiError(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as any;
    return (
      e?.response?.data?.message ||
      e?.response?.data?.detail ||
      e?.message ||
      'An unexpected error occurred'
    );
  }
  return 'An unexpected error occurred';
}

export default adminAxios;
