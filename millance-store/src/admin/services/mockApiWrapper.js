// ═══════════════════════════════════════════════════════════════════
// MOCK API WRAPPER - Intercepts API calls and returns dummy data
// ═══════════════════════════════════════════════════════════════════

import {
  MOCK_DASHBOARD,
  MOCK_SALES_DATA,
  MOCK_TOP_PRODUCTS,
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_COUPONS,
  MOCK_REVIEWS,
  MOCK_INVENTORY,
  MOCK_PAYMENTS,
  mockResponse,
  delay,
} from './mockData';

const USE_MOCK_API = true; // Set to false when backend is ready

// Wrap API function to return mock data
export const mockApiWrapper = (originalFn, mockFn) => {
  return async (...args) => {
    if (USE_MOCK_API) {
      await delay(300); // Simulate network delay
      return mockFn(...args);
    }
    return originalFn(...args);
  };
};

// Mock implementations for each API
export const mockDashboardApi = {
  get: async () => mockResponse(MOCK_DASHBOARD),
  sales: async (period = 'daily') => mockResponse(MOCK_SALES_DATA[period] || MOCK_SALES_DATA.daily),
  orders: async () => mockResponse(MOCK_DASHBOARD.orders),
  topProducts: async (limit = 10) => mockResponse(MOCK_TOP_PRODUCTS.slice(0, limit)),
};

export const mockProductsApi = {
  list: async (params = {}) => {
    const { page = 1, limit = 20, status, search } = params;
    let filtered = [...MOCK_PRODUCTS];
    
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return mockResponse({
      items: paginated,
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    });
  },
  get: async (id) => mockResponse(MOCK_PRODUCTS.find(p => p.id === parseInt(id)) || MOCK_PRODUCTS[0]),
  create: async (data) => mockResponse({ id: Date.now(), ...data }),
  update: async (id, data) => mockResponse({ id, ...data }),
  updateStatus: async (id, status) => mockResponse({ id, status }),
  delete: async (id) => mockResponse({ id, deleted: true }),
  addImage: async (productId, data) => mockResponse({ id: Date.now(), product_id: productId, ...data }),
  deleteImage: async (productId, imageId) => mockResponse({ deleted: true }),
  setPrimaryImage: async (productId, imageId) => mockResponse({ success: true }),
  createVariant: async (productId, data) => mockResponse({ id: Date.now(), product_id: productId, ...data }),
  updateVariant: async (productId, variantId, data) => mockResponse({ id: variantId, ...data }),
  deleteVariant: async (productId, variantId) => mockResponse({ deleted: true }),
};

export const mockCategoriesApi = {
  list: async (params = {}) => mockResponse({
    items: MOCK_CATEGORIES,
    total: MOCK_CATEGORIES.length,
  }),
  get: async (id) => mockResponse(MOCK_CATEGORIES.find(c => c.id === parseInt(id)) || MOCK_CATEGORIES[0]),
  create: async (data) => mockResponse({ id: Date.now(), ...data }),
  update: async (id, data) => mockResponse({ id, ...data }),
  updateStatus: async (id, is_active) => mockResponse({ id, is_active }),
  delete: async (id) => mockResponse({ deleted: true }),
};

export const mockInventoryApi = {
  list: async (params = {}) => mockResponse({
    items: MOCK_INVENTORY,
    total: MOCK_INVENTORY.length,
  }),
  lowStock: async (params = {}) => mockResponse({
    items: MOCK_INVENTORY.filter(i => i.status === 'low_stock'),
    total: MOCK_INVENTORY.filter(i => i.status === 'low_stock').length,
  }),
  outOfStock: async (params = {}) => mockResponse({
    items: MOCK_INVENTORY.filter(i => i.status === 'out_of_stock'),
    total: MOCK_INVENTORY.filter(i => i.status === 'out_of_stock').length,
  }),
  get: async (productId) => mockResponse(MOCK_INVENTORY.find(i => i.product_id === parseInt(productId)) || MOCK_INVENTORY[0]),
  adjust: async (productId, data) => mockResponse({ product_id: productId, ...data }),
  updateThreshold: async (productId, threshold) => mockResponse({ product_id: productId, low_stock_threshold: threshold }),
  history: async (productId, params = {}) => mockResponse([]),
};

export const mockOrdersApi = {
  list: async (params = {}) => {
    const { page = 1, limit = 20, status } = params;
    let filtered = [...MOCK_ORDERS];
    
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);
    
    return mockResponse({
      items: paginated,
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    });
  },
  get: async (id) => mockResponse({
    ...(MOCK_ORDERS.find(o => o.id === parseInt(id)) || MOCK_ORDERS[0]),
    items: [
      { id: 1, product_name: 'Product 1', quantity: 2, price: 1000, total: 2000 },
      { id: 2, product_name: 'Product 2', quantity: 1, price: 1500, total: 1500 },
    ],
    shipping_address: {
      name: 'Customer Name',
      phone: '+91 9876543210',
      address: '123 Street Name',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  }),
  timeline: async (id) => mockResponse([
    { id: 1, status: 'pending', created_at: new Date().toISOString(), notes: 'Order placed' },
    { id: 2, status: 'confirmed', created_at: new Date().toISOString(), notes: 'Order confirmed' },
  ]),
  updateStatus: async (id, status, notes) => mockResponse({ id, status, notes }),
  confirm: async (id, notes) => mockResponse({ id, status: 'confirmed', notes }),
  pack: async (id, notes) => mockResponse({ id, status: 'processing', notes }),
  dispatch: async (id, trackingNumber, courierName, notes) => mockResponse({ id, status: 'shipped', tracking_number: trackingNumber }),
  outForDelivery: async (id) => mockResponse({ id, status: 'out_for_delivery' }),
  deliver: async (id, notes) => mockResponse({ id, status: 'delivered', notes }),
  approveReturn: async (id, notes) => mockResponse({ id, status: 'return_approved', notes }),
  rejectReturn: async (id, notes) => mockResponse({ id, status: 'return_rejected', notes }),
  cancel: async (id, reason) => mockResponse({ id, status: 'cancelled', reason }),
};

export const mockCustomersApi = {
  list: async (params = {}) => mockResponse({
    items: MOCK_CUSTOMERS,
    total: MOCK_CUSTOMERS.length,
  }),
  get: async (id) => mockResponse(MOCK_CUSTOMERS.find(c => c.id === parseInt(id)) || MOCK_CUSTOMERS[0]),
  updateStatus: async (id, data) => mockResponse({ id, ...data }),
  orders: async (id, params = {}) => mockResponse({
    items: MOCK_ORDERS.slice(0, 5),
    total: 5,
  }),
};

export const mockPaymentsApi = {
  list: async (params = {}) => mockResponse({
    items: MOCK_PAYMENTS,
    total: MOCK_PAYMENTS.length,
  }),
  get: async (id) => mockResponse(MOCK_PAYMENTS.find(p => p.id === parseInt(id)) || MOCK_PAYMENTS[0]),
  orderPayment: async (orderId) => mockResponse(MOCK_PAYMENTS.find(p => p.order_id === parseInt(orderId)) || MOCK_PAYMENTS[0]),
  refund: async (orderId, amount, reason) => mockResponse({ order_id: orderId, amount, reason, status: 'refunded' }),
  refunds: async (params = {}) => mockResponse({ items: [], total: 0 }),
  getRefund: async (id) => mockResponse({ id, amount: 1000, status: 'refunded' }),
};

export const mockCouponsApi = {
  list: async (params = {}) => mockResponse({
    items: MOCK_COUPONS,
    total: MOCK_COUPONS.length,
  }),
  get: async (id) => mockResponse(MOCK_COUPONS.find(c => c.id === parseInt(id)) || MOCK_COUPONS[0]),
  create: async (data) => mockResponse({ id: Date.now(), ...data }),
  update: async (id, data) => mockResponse({ id, ...data }),
  updateStatus: async (id, is_active) => mockResponse({ id, is_active }),
  delete: async (id) => mockResponse({ deleted: true }),
};

export const mockReviewsApi = {
  list: async (params = {}) => mockResponse({
    items: MOCK_REVIEWS,
    total: MOCK_REVIEWS.length,
  }),
  get: async (id) => mockResponse(MOCK_REVIEWS.find(r => r.id === parseInt(id)) || MOCK_REVIEWS[0]),
  updateStatus: async (id, status) => mockResponse({ id, status }),
  delete: async (id) => mockResponse({ deleted: true }),
};

export const mockReportsApi = {
  sales: async (params = {}) => mockResponse({ data: MOCK_SALES_DATA.monthly }),
  orders: async (params = {}) => mockResponse({ data: [] }),
  products: async (params = {}) => mockResponse({ data: MOCK_TOP_PRODUCTS }),
  customers: async (params = {}) => mockResponse({ data: [] }),
};
