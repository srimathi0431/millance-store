import axios from 'axios';

const BASE_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:8026';

const vendorAxios = axios.create({
 baseURL: BASE_URL,
 timeout: 15000,
 headers: { 'Content-Type': 'application/json' },
});

// ── Prevent concurrent refresh calls ─────────────────────────
let _refreshing = false;
let _refreshQueue = [];

function _onRefreshed(token) {
 _refreshQueue.forEach(cb => cb(token));
 _refreshQueue = [];
}

async function _tryRefreshToken() {
 const refreshToken = localStorage.getItem('vendor_refresh_token');
 if (!refreshToken) return null;
 try {
 const resp = await axios.post(`${BASE_URL}/api/admin/auth/refresh`, {
 refresh_token: refreshToken,
 });
 const data = resp.data;
 const newAccess = data.access_token ?? data.data?.access_token;
 const newRefresh = data.refresh_token ?? data.data?.refresh_token;
 if (!newAccess) return null;
 localStorage.setItem('vendor_access_token', newAccess);
 if (newRefresh) localStorage.setItem('vendor_refresh_token', newRefresh);
 return newAccess;
 } catch {
 return null;
 }
}

// ── Request interceptor: attach vendor Bearer token ───────────
vendorAxios.interceptors.request.use(
 (config) => {
 const token = localStorage.getItem('vendor_access_token');
 if (token) config.headers.Authorization = `Bearer ${token}`;
 return config;
 },
 (error) => Promise.reject(error),
);

// ── Response interceptor: auto-refresh on 401 ────────────────
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

 _onRefreshed(null);
 localStorage.removeItem('vendor_access_token');
 localStorage.removeItem('vendor_refresh_token');
 localStorage.removeItem('vendor_user');
 window.location.href = '/vendor/login';
 }

 return Promise.reject(error);
 },
);

export function parseVendorApiError(err) {
 if (err && typeof err === 'object') {
 return (
 err?.response?.data?.message ||
 err?.response?.data?.detail ||
 err?.message ||
 'An unexpected error occurred'
 );
 }
 return 'An unexpected error occurred';
}

export default vendorAxios;
