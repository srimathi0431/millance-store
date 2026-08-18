/**
 * admin/services/api.ts
 *
 * Real HTTP calls to the FastAPI backend (http://localhost:8026).
 * All functions return raw axios responses so pages can access .data.data
 * exactly as they did with the mock layer — no page changes needed.
 *
 * Shape fixes applied here:
 *  - ordersApi.updateStatus   → sends { status } body
 *  - ordersApi.cancel         → sends { reason } body  via POST /:id/cancel
 *  - paymentsApi.refund       → sends { amount, reason } body
 *  - authApi.changePassword   → sends { current_password, new_password, confirm_password }
 *  - inventoryApi.updateThreshold → PATCH /inventory/:id/threshold (was missing)
 *  - authApi.refresh          → POST /auth/refresh (was missing)
 */

import adminAxios from './axiosInstance';

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    adminAxios.post('/api/admin/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    adminAxios.post('/api/admin/auth/refresh', { refresh_token: refreshToken }),

  logout: (refreshToken: string) =>
    adminAxios.post('/api/admin/auth/logout', { refresh_token: refreshToken }),

  me: () =>
    adminAxios.get('/api/admin/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    adminAxios.post('/api/admin/auth/change-password', {
      current_password:  currentPassword,
      new_password:      newPassword,
      confirm_password:  newPassword,   // backend requires this field
    }),

  forgotPassword: (email: string) =>
    adminAxios.post('/api/admin/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    adminAxios.post('/api/admin/auth/reset-password', {
      token,
      new_password:     newPassword,
      confirm_password: newPassword,
    }),
};

// ─────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────
export const dashboardApi = {
  get: () =>
    adminAxios.get('/api/admin/dashboard'),

  sales: (period = 'daily', days = 30) =>
    adminAxios.get('/api/admin/dashboard/sales', { params: { period, days } }),

  orders: () =>
    adminAxios.get('/api/admin/dashboard/orders'),

  topProducts: (limit = 10) =>
    adminAxios.get('/api/admin/dashboard/top-products', { params: { limit } }),
};

// ─────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/products', { params }),

  get: (id: number) =>
    adminAxios.get(`/api/admin/products/${id}`),

  create: (data: Record<string, any>) =>
    adminAxios.post('/api/admin/products', data),

  update: (id: number, data: Record<string, any>) =>
    adminAxios.put(`/api/admin/products/${id}`, data),

  updateStatus: (id: number, status: string) =>
    adminAxios.patch(`/api/admin/products/${id}/status`, { status }),

  delete: (id: number) =>
    adminAxios.delete(`/api/admin/products/${id}`),

  // Images
  addImage: (productId: number, data: Record<string, any>) =>
    adminAxios.post(`/api/admin/products/${productId}/images`, data),

  deleteImage: (productId: number, imageId: number) =>
    adminAxios.delete(`/api/admin/products/${productId}/images/${imageId}`),

  setPrimaryImage: (productId: number, imageId: number) =>
    adminAxios.patch(`/api/admin/products/${productId}/images/${imageId}/primary`),

  // Variants
  createVariant: (productId: number, data: Record<string, any>) =>
    adminAxios.post(`/api/admin/products/${productId}/variants`, data),

  updateVariant: (productId: number, variantId: number, data: Record<string, any>) =>
    adminAxios.put(`/api/admin/products/${productId}/variants/${variantId}`, data),

  deleteVariant: (productId: number, variantId: number) =>
    adminAxios.delete(`/api/admin/products/${productId}/variants/${variantId}`),
};

// ─────────────────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────────────────
export const categoriesApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/categories', { params }),

  get: (id: number) =>
    adminAxios.get(`/api/admin/categories/${id}`),

  create: (data: Record<string, any>) =>
    adminAxios.post('/api/admin/categories', data),

  update: (id: number, data: Record<string, any>) =>
    adminAxios.put(`/api/admin/categories/${id}`, data),

  updateStatus: (id: number, is_active: boolean) =>
    adminAxios.patch(`/api/admin/categories/${id}/status`, { is_active }),

  delete: (id: number) =>
    adminAxios.delete(`/api/admin/categories/${id}`),
};

// ─────────────────────────────────────────────────────────────
// Inventory
// ─────────────────────────────────────────────────────────────
export const inventoryApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/inventory', { params }),

  lowStock: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/inventory/low-stock', { params }),

  outOfStock: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/inventory/out-of-stock', { params }),

  get: (productId: number) =>
    adminAxios.get(`/api/admin/inventory/${productId}`),

  adjust: (productId: number, data: Record<string, any>) =>
    adminAxios.patch(`/api/admin/inventory/${productId}`, data),

  updateThreshold: (productId: number, low_stock_threshold: number) =>
    adminAxios.patch(`/api/admin/inventory/${productId}/threshold`, { low_stock_threshold }),

  history: (productId: number, params: Record<string, any> = {}) =>
    adminAxios.get(`/api/admin/inventory/${productId}/history`, { params }),
};

// ─────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────
export const ordersApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/orders', { params }),

  get: (id: number) =>
    adminAxios.get(`/api/admin/orders/${id}`),

  timeline: (id: number) =>
    adminAxios.get(`/api/admin/orders/${id}/timeline`),

  // Generic status update (backward compat)
  updateStatus: (id: number, status: string, notes?: string) =>
    adminAxios.patch(`/api/admin/orders/${id}/status`, { status, ...(notes ? { notes } : {}) }),

  // Stage-specific actions
  confirm: (id: number, notes?: string) =>
    adminAxios.post(`/api/admin/orders/${id}/confirm`, { notes: notes ?? null }),

  pack: (id: number, notes?: string) =>
    adminAxios.post(`/api/admin/orders/${id}/pack`, { notes: notes ?? null }),

  dispatch: (id: number, trackingNumber: string, courierName?: string, notes?: string) =>
    adminAxios.post(`/api/admin/orders/${id}/dispatch`, {
      tracking_number: trackingNumber,
      courier_name:    courierName ?? null,
      notes:           notes ?? null,
    }),

  outForDelivery: (id: number) =>
    adminAxios.post(`/api/admin/orders/${id}/out-for-delivery`),

  deliver: (id: number, notes?: string) =>
    adminAxios.post(`/api/admin/orders/${id}/deliver`, { notes: notes ?? null }),

  approveReturn: (id: number, notes?: string) =>
    adminAxios.post(`/api/admin/orders/${id}/approve-return`, { notes: notes ?? null }),

  rejectReturn: (id: number, notes?: string) =>
    adminAxios.post(`/api/admin/orders/${id}/reject-return`, { notes: notes ?? null }),

  cancel: (id: number, reason?: string) =>
    adminAxios.post(`/api/admin/orders/${id}/cancel`, { reason: reason ?? null }),
};

// ─────────────────────────────────────────────────────────────
// Customers
// ─────────────────────────────────────────────────────────────
export const customersApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/customers', { params }),

  get: (id: number) =>
    adminAxios.get(`/api/admin/customers/${id}`),

  updateStatus: (id: number, data: Record<string, any>) =>
    adminAxios.patch(`/api/admin/customers/${id}/status`, data),

  orders: (id: number, params: Record<string, any> = {}) =>
    adminAxios.get(`/api/admin/customers/${id}/orders`, { params }),
};

// ─────────────────────────────────────────────────────────────
// Payments & Refunds
// ─────────────────────────────────────────────────────────────
export const paymentsApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/payments', { params }),

  get: (id: number) =>
    adminAxios.get(`/api/admin/payments/${id}`),

  orderPayment: (orderId: number) =>
    adminAxios.get(`/api/admin/orders/${orderId}/payment`),

  // Fix: backend expects { amount, reason } body — not positional args
  refund: (orderId: number, amount: number, reason?: string) =>
    adminAxios.post(`/api/admin/orders/${orderId}/refund`, {
      amount,
      reason: reason ?? null,
    }),

  refunds: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/refunds', { params }),

  getRefund: (id: number) =>
    adminAxios.get(`/api/admin/refunds/${id}`),
};

// ─────────────────────────────────────────────────────────────
// Coupons
// ─────────────────────────────────────────────────────────────
export const couponsApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/coupons', { params }),

  get: (id: number) =>
    adminAxios.get(`/api/admin/coupons/${id}`),

  create: (data: Record<string, any>) =>
    adminAxios.post('/api/admin/coupons', data),

  update: (id: number, data: Record<string, any>) =>
    adminAxios.put(`/api/admin/coupons/${id}`, data),

  updateStatus: (id: number, is_active: boolean) =>
    adminAxios.patch(`/api/admin/coupons/${id}/status`, { is_active }),

  delete: (id: number) =>
    adminAxios.delete(`/api/admin/coupons/${id}`),
};

// ─────────────────────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────────────────────
export const reviewsApi = {
  list: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/reviews', { params }),

  get: (id: number) =>
    adminAxios.get(`/api/admin/reviews/${id}`),

  updateStatus: (id: number, status: string) =>
    adminAxios.patch(`/api/admin/reviews/${id}/status`, { status }),

  delete: (id: number) =>
    adminAxios.delete(`/api/admin/reviews/${id}`),
};

// ─────────────────────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────────────────────
export const reportsApi = {
  sales: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/reports/sales', { params }),

  orders: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/reports/orders', { params }),

  products: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/reports/products', { params }),

  customers: (params: Record<string, any> = {}) =>
    adminAxios.get('/api/admin/reports/customers', { params }),
};
