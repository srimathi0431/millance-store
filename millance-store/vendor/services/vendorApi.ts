/**
 * vendor/services/vendorApi.ts
 *
 * Real HTTP calls to the FastAPI backend for the Vendor portal.
 * Uses the same backend endpoints as admin — role is validated server-side.
 * All functions return raw axios responses so pages access .data.data as-is.
 */

import vendorAxios from './axiosInstance';

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────
export const vendorAuthApi = {
  login: (email: string, password: string) =>
    vendorAxios.post('/api/admin/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    vendorAxios.post('/api/admin/auth/refresh', { refresh_token: refreshToken }),

  me: () =>
    vendorAxios.get('/api/admin/auth/me'),

  logout: (refreshToken: string) =>
    vendorAxios.post('/api/admin/auth/logout', { refresh_token: refreshToken }),
};

// ─────────────────────────────────────────────────────────────
// Categories (read-only for vendor)
// ─────────────────────────────────────────────────────────────
export const vendorCategoriesApi = {
  list: (params: Record<string, any> = {}) =>
    vendorAxios.get('/api/admin/categories', { params: { page: 1, page_size: 200, ...params } }),
};

// ─────────────────────────────────────────────────────────────
// Products (full CRUD — vendor manages their own products)
// ─────────────────────────────────────────────────────────────
export const vendorProductsApi = {
  list: (params: Record<string, any> = {}) =>
    vendorAxios.get('/api/admin/products', { params }),

  get: (id: number) =>
    vendorAxios.get(`/api/admin/products/${id}`),

  create: (data: Record<string, any>) =>
    vendorAxios.post('/api/admin/products', data),

  update: (id: number, data: Record<string, any>) =>
    vendorAxios.put(`/api/admin/products/${id}`, data),

  updateStatus: (id: number, status: string) =>
    vendorAxios.patch(`/api/admin/products/${id}/status`, { status }),

  delete: (id: number) =>
    vendorAxios.delete(`/api/admin/products/${id}`),

  // Images
  addImage: (productId: number, data: Record<string, any>) =>
    vendorAxios.post(`/api/admin/products/${productId}/images`, data),

  deleteImage: (productId: number, imageId: number) =>
    vendorAxios.delete(`/api/admin/products/${productId}/images/${imageId}`),

  setPrimaryImage: (productId: number, imageId: number) =>
    vendorAxios.patch(`/api/admin/products/${productId}/images/${imageId}/primary`),

  // Variants
  createVariant: (productId: number, data: Record<string, any>) =>
    vendorAxios.post(`/api/admin/products/${productId}/variants`, data),

  updateVariant: (productId: number, variantId: number, data: Record<string, any>) =>
    vendorAxios.put(`/api/admin/products/${productId}/variants/${variantId}`, data),

  deleteVariant: (productId: number, variantId: number) =>
    vendorAxios.delete(`/api/admin/products/${productId}/variants/${variantId}`),
};

// ─────────────────────────────────────────────────────────────
// Orders (read-only for vendor)
// ─────────────────────────────────────────────────────────────
export const vendorOrdersApi = {
  list: (params: Record<string, any> = {}) =>
    vendorAxios.get('/api/admin/orders', { params }),

  get: (id: number) =>
    vendorAxios.get(`/api/admin/orders/${id}`),
};

// ─────────────────────────────────────────────────────────────
// Inventory (read-only for vendor)
// ─────────────────────────────────────────────────────────────
export const vendorInventoryApi = {
  get: (productId: number) =>
    vendorAxios.get(`/api/admin/inventory/${productId}`),
};
