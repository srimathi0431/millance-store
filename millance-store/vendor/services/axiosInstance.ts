import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8026';

const vendorAxios: AxiosInstance = axios.create({
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
  const refreshToken = localStorage.getItem('vendor_refresh_token');
  if (!refreshToken) return null;
  try {
    const resp = await axios.post(`${BASE_URL}/api/admin/auth/refresh`, {
      refresh_token: refreshToken,
    });
    const data = resp.data;
    const newAccess  = data.access_token  ?? data.data?.access_token;
    const newRefresh = data.refresh_token ?? data.data?.refresh_token;
    if (!newAccess) return null;
    localStorage.setItem('vendor_access_token',  newAccess);
    if (newRefresh) localStorage.setItem('vendor_refresh_token', newRefresh);
    return newAccess;
  } catch {
    return null;
  }
}

// ── Request interceptor: attach vendor Bearer token ───────────────────────────
vendorAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('vendor_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: auto-refresh on 401, redirect to login if refresh fails
vendorAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (_refreshing) {
        return new Promise((resolve, reject) => {
          _refreshQueue.push((token) => {
            if (token) {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(vendorAxios(original));
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
        return vendorAxios(original);
      }

      // Refresh failed — clear session and redirect to login
      _onRefreshed(null);
      localStorage.removeItem('vendor_access_token');
      localStorage.removeItem('vendor_refresh_token');
      localStorage.removeItem('vendor_user');
      window.location.href = '/vendor/login';
    }

    return Promise.reject(error);
  },
);

/**
 * Extract a human-readable error message from an axios error.
 */
export function parseVendorApiError(err: unknown): string {
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

export default vendorAxios;
