import adminAxios from './axiosInstance';

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
 login: (email, password) =>
 adminAxios.post('/api/admin/auth/login', { email, password }),

 refresh: (refreshToken) =>
 adminAxios.post('/api/admin/auth/refresh', { refresh_token: refreshToken }),

 logout: (refreshToken) =>
 adminAxios.post('/api/admin/auth/logout', { refresh_token: refreshToken }),

 me: () =>
 adminAxios.get('/api/admin/auth/me'),

 changePassword: (currentPassword, newPassword) =>
 adminAxios.post('/api/admin/auth/change-password', {
 current_password: currentPassword,
 new_password: newPassword,
 confirm_password: newPassword,
 }),

 forgotPassword: (email) =>
 adminAxios.post('/api/admin/auth/forgot-password', { email }),

 resetPassword: (token, newPassword) =>
 adminAxios.post('/api/admin/auth/reset-password', {
 token,
 new_password: newPassword,
 confirm_password: newPassword,
 }),
};

// ── Dashboard ─────────────────────────────────────────────────
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

// ── Products ──────────────────────────────────────────────────
export const productsApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/products', { params }),

 get: (id) =>
 adminAxios.get(`/api/admin/products/${id}`),

 create: (data) =>
 adminAxios.post('/api/admin/products', data),

 update: (id, data) =>
 adminAxios.put(`/api/admin/products/${id}`, data),

 updateStatus: (id, status) =>
 adminAxios.patch(`/api/admin/products/${id}/status`, { status }),

 delete: (id) =>
 adminAxios.delete(`/api/admin/products/${id}`),

 addImage: (productId, data) =>
 adminAxios.post(`/api/admin/products/${productId}/images`, data),

 deleteImage: (productId, imageId) =>
 adminAxios.delete(`/api/admin/products/${productId}/images/${imageId}`),

 setPrimaryImage: (productId, imageId) =>
 adminAxios.patch(`/api/admin/products/${productId}/images/${imageId}/primary`),

 createVariant: (productId, data) =>
 adminAxios.post(`/api/admin/products/${productId}/variants`, data),

 updateVariant: (productId, variantId, data) =>
 adminAxios.put(`/api/admin/products/${productId}/variants/${variantId}`, data),

 deleteVariant: (productId, variantId) =>
 adminAxios.delete(`/api/admin/products/${productId}/variants/${variantId}`),
};

// ── Categories ────────────────────────────────────────────────
export const categoriesApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/categories', { params }),

 get: (id) =>
 adminAxios.get(`/api/admin/categories/${id}`),

 create: (data) =>
 adminAxios.post('/api/admin/categories', data),

 update: (id, data) =>
 adminAxios.put(`/api/admin/categories/${id}`, data),

 updateStatus: (id, is_active) =>
 adminAxios.patch(`/api/admin/categories/${id}/status`, { is_active }),

 delete: (id) =>
 adminAxios.delete(`/api/admin/categories/${id}`),
};

// ── Inventory ─────────────────────────────────────────────────
export const inventoryApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/inventory', { params }),

 lowStock: (params = {}) =>
 adminAxios.get('/api/admin/inventory/low-stock', { params }),

 outOfStock: (params = {}) =>
 adminAxios.get('/api/admin/inventory/out-of-stock', { params }),

 get: (productId) =>
 adminAxios.get(`/api/admin/inventory/${productId}`),

 adjust: (productId, data) =>
 adminAxios.patch(`/api/admin/inventory/${productId}`, data),

 updateThreshold: (productId, low_stock_threshold) =>
 adminAxios.patch(`/api/admin/inventory/${productId}/threshold`, { low_stock_threshold }),

 history: (productId, params = {}) =>
 adminAxios.get(`/api/admin/inventory/${productId}/history`, { params }),
};

// ── Orders ────────────────────────────────────────────────────
export const ordersApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/orders', { params }),

 get: (id) =>
 adminAxios.get(`/api/admin/orders/${id}`),

 timeline: (id) =>
 adminAxios.get(`/api/admin/orders/${id}/timeline`),

 updateStatus: (id, status, notes) =>
 adminAxios.patch(`/api/admin/orders/${id}/status`, { status, ...(notes ? { notes } : {}) }),

 confirm: (id, notes) =>
 adminAxios.post(`/api/admin/orders/${id}/confirm`, { notes: notes ?? null }),

 pack: (id, notes) =>
 adminAxios.post(`/api/admin/orders/${id}/pack`, { notes: notes ?? null }),

 dispatch: (id, trackingNumber, courierName, notes) =>
 adminAxios.post(`/api/admin/orders/${id}/dispatch`, {
 tracking_number: trackingNumber,
 courier_name: courierName ?? null,
 notes: notes ?? null,
 }),

 outForDelivery: (id) =>
 adminAxios.post(`/api/admin/orders/${id}/out-for-delivery`),

 deliver: (id, notes) =>
 adminAxios.post(`/api/admin/orders/${id}/deliver`, { notes: notes ?? null }),

 approveReturn: (id, notes) =>
 adminAxios.post(`/api/admin/orders/${id}/approve-return`, { notes: notes ?? null }),

 rejectReturn: (id, notes) =>
 adminAxios.post(`/api/admin/orders/${id}/reject-return`, { notes: notes ?? null }),

 cancel: (id, reason) =>
 adminAxios.post(`/api/admin/orders/${id}/cancel`, { reason: reason ?? null }),
};

// ── Customers ─────────────────────────────────────────────────
export const customersApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/customers', { params }),

 get: (id) =>
 adminAxios.get(`/api/admin/customers/${id}`),

 updateStatus: (id, data) =>
 adminAxios.patch(`/api/admin/customers/${id}/status`, data),

 orders: (id, params = {}) =>
 adminAxios.get(`/api/admin/customers/${id}/orders`, { params }),
};

// ── Payments & Refunds ────────────────────────────────────────
export const paymentsApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/payments', { params }),

 get: (id) =>
 adminAxios.get(`/api/admin/payments/${id}`),

 orderPayment: (orderId) =>
 adminAxios.get(`/api/admin/orders/${orderId}/payment`),

 refund: (orderId, amount, reason) =>
 adminAxios.post(`/api/admin/orders/${orderId}/refund`, {
 amount,
 reason: reason ?? null,
 }),

 refunds: (params = {}) =>
 adminAxios.get('/api/admin/refunds', { params }),

 getRefund: (id) =>
 adminAxios.get(`/api/admin/refunds/${id}`),
};

// ── Coupons ───────────────────────────────────────────────────
export const couponsApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/coupons', { params }),

 get: (id) =>
 adminAxios.get(`/api/admin/coupons/${id}`),

 create: (data) =>
 adminAxios.post('/api/admin/coupons', data),

 update: (id, data) =>
 adminAxios.put(`/api/admin/coupons/${id}`, data),

 updateStatus: (id, is_active) =>
 adminAxios.patch(`/api/admin/coupons/${id}/status`, { is_active }),

 delete: (id) =>
 adminAxios.delete(`/api/admin/coupons/${id}`),
};

// ── Reviews ───────────────────────────────────────────────────
export const reviewsApi = {
 list: (params = {}) =>
 adminAxios.get('/api/admin/reviews', { params }),

 get: (id) =>
 adminAxios.get(`/api/admin/reviews/${id}`),

 updateStatus: (id, status) =>
 adminAxios.patch(`/api/admin/reviews/${id}/status`, { status }),

 delete: (id) =>
 adminAxios.delete(`/api/admin/reviews/${id}`),
};

// ── Reports ───────────────────────────────────────────────────
export const reportsApi = {
 sales: (params = {}) =>
 adminAxios.get('/api/admin/reports/sales', { params }),

 orders: (params = {}) =>
 adminAxios.get('/api/admin/reports/orders', { params }),

 products: (params = {}) =>
 adminAxios.get('/api/admin/reports/products', { params }),

 customers: (params = {}) =>
 adminAxios.get('/api/admin/reports/customers', { params }),
};
