import vendorAxios from './axiosInstance';

// ── Auth ──────────────────────────────────────────────────────
export const vendorAuthApi = {
 login: (email, password) =>
 vendorAxios.post('/api/admin/auth/login', { email, password }),

 refresh: (refreshToken) =>
 vendorAxios.post('/api/admin/auth/refresh', { refresh_token: refreshToken }),

 me: () =>
 vendorAxios.get('/api/admin/auth/me'),

 logout: (refreshToken) =>
 vendorAxios.post('/api/admin/auth/logout', { refresh_token: refreshToken }),
};

// ── Categories (read-only) ────────────────────────────────────
export const vendorCategoriesApi = {
 list: (params = {}) =>
 vendorAxios.get('/api/admin/categories', { params: { page: 1, page_size: 200, ...params } }),
};

// ── Products ──────────────────────────────────────────────────
export const vendorProductsApi = {
 list: (params = {}) =>
 vendorAxios.get('/api/admin/products', { params }),

 get: (id) =>
 vendorAxios.get(`/api/admin/products/${id}`),

 create: (data) =>
 vendorAxios.post('/api/admin/products', data),

 update: (id, data) =>
 vendorAxios.put(`/api/admin/products/${id}`, data),

 updateStatus: (id, status) =>
 vendorAxios.patch(`/api/admin/products/${id}/status`, { status }),

 delete: (id) =>
 vendorAxios.delete(`/api/admin/products/${id}`),

 addImage: (productId, data) =>
 vendorAxios.post(`/api/admin/products/${productId}/images`, data),

 deleteImage: (productId, imageId) =>
 vendorAxios.delete(`/api/admin/products/${productId}/images/${imageId}`),

 setPrimaryImage: (productId, imageId) =>
 vendorAxios.patch(`/api/admin/products/${productId}/images/${imageId}/primary`),

 createVariant: (productId, data) =>
 vendorAxios.post(`/api/admin/products/${productId}/variants`, data),

 updateVariant: (productId, variantId, data) =>
 vendorAxios.put(`/api/admin/products/${productId}/variants/${variantId}`, data),

 deleteVariant: (productId, variantId) =>
 vendorAxios.delete(`/api/admin/products/${productId}/variants/${variantId}`),
};

// ── Orders (read-only) ────────────────────────────────────────
export const vendorOrdersApi = {
 list: (params = {}) =>
 vendorAxios.get('/api/admin/orders', { params }),

 get: (id) =>
 vendorAxios.get(`/api/admin/orders/${id}`),
};

// ── Inventory (read-only) ─────────────────────────────────────
export const vendorInventoryApi = {
 get: (productId) =>
 vendorAxios.get(`/api/admin/inventory/${productId}`),
};
