// ═══════════════════════════════════════════════════════════════════
// MOCK DATA SERVICE - Dummy data for Admin Panel (No Backend Required)
// ═══════════════════════════════════════════════════════════════════

export const MOCK_DASHBOARD = {
  revenue: {
    total_revenue: 1245680,
    today_revenue: 45680,
    monthly_revenue: 456780,
    yearly_revenue: 1245680,
  },
  orders: {
    total_orders: 1234,
    pending_orders: 45,
    confirmed_orders: 123,
    processing_orders: 67,
    shipped_orders: 234,
    delivered_orders: 789,
    cancelled_orders: 76,
    returned_orders: 15,
  },
  products: {
    total_products: 456,
    active_products: 423,
    inactive_products: 33,
    out_of_stock: 12,
    low_stock: 23,
  },
  customers: {
    total_customers: 2345,
    active_customers: 2123,
    inactive_customers: 222,
    new_this_month: 156,
  },
};

export const MOCK_SALES_DATA = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    revenue: Math.floor(Math.random() * 50000) + 20000,
    orders: Math.floor(Math.random() * 50) + 10,
  })),
  weekly: Array.from({ length: 12 }, (_, i) => ({
    week: `Week ${i + 1}`,
    revenue: Math.floor(Math.random() * 300000) + 100000,
    orders: Math.floor(Math.random() * 300) + 50,
  })),
  monthly: Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: Math.floor(Math.random() * 1000000) + 500000,
    orders: Math.floor(Math.random() * 1000) + 200,
  })),
};

export const MOCK_TOP_PRODUCTS = [
  { id: 1, name: 'iPhone 15 Pro Max', sales: 234, revenue: 32456780, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop' },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', sales: 189, revenue: 24567890, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop' },
  { id: 3, name: 'MacBook Air M3', sales: 156, revenue: 21234560, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop' },
  { id: 4, name: 'Sony WH-1000XM5', sales: 345, revenue: 10345670, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
  { id: 5, name: 'Apple Watch Series 9', sales: 267, revenue: 12234560, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop' },
];

export const MOCK_PRODUCTS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sku: `SKU${String(i + 1).padStart(5, '0')}`,
  category: ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'][i % 5],
  price: Math.floor(Math.random() * 50000) + 1000,
  stock: Math.floor(Math.random() * 100),
  status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
  image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=200&h=200&fit=crop`,
  created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Beauty & Personal Care', slug: 'beauty-personal-care', product_count: 234, is_active: true, parent_id: null },
  { id: 2, name: "Women's Fashion", slug: 'women-fashion', product_count: 567, is_active: true, parent_id: null },
  { id: 3, name: "Men's Fashion", slug: 'men-fashion', product_count: 423, is_active: true, parent_id: null },
  { id: 4, name: 'Fashion Accessories', slug: 'fashion-accessories', product_count: 345, is_active: true, parent_id: null },
  { id: 5, name: 'Grocery & Fresh', slug: 'grocery-fresh', product_count: 678, is_active: true, parent_id: null },
  { id: 6, name: 'Home & Kitchen', slug: 'home-kitchen', product_count: 456, is_active: true, parent_id: null },
  { id: 7, name: 'Mobiles & Tablets', slug: 'mobiles-tablets', product_count: 234, is_active: true, parent_id: null },
  { id: 8, name: 'Electronics & TVs', slug: 'electronics', product_count: 345, is_active: true, parent_id: null },
];

export const MOCK_ORDERS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  order_number: `ORD${String(i + 1).padStart(6, '0')}`,
  customer_name: `Customer ${i + 1}`,
  customer_email: `customer${i + 1}@example.com`,
  total: Math.floor(Math.random() * 50000) + 1000,
  status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 6)],
  payment_status: ['pending', 'paid', 'failed', 'refunded'][Math.floor(Math.random() * 4)],
  created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  items_count: Math.floor(Math.random() * 5) + 1,
}));

export const MOCK_CUSTOMERS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  total_orders: Math.floor(Math.random() * 20),
  total_spent: Math.floor(Math.random() * 100000),
  status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
  created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const MOCK_COUPONS = [
  { id: 1, code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_purchase: 500, max_discount: 100, usage_limit: 1000, used_count: 234, is_active: true, valid_from: '2026-01-01', valid_until: '2026-12-31' },
  { id: 2, code: 'SAVE20', discount_type: 'percentage', discount_value: 20, min_purchase: 1000, max_discount: 200, usage_limit: 500, used_count: 123, is_active: true, valid_from: '2026-01-01', valid_until: '2026-12-31' },
  { id: 3, code: 'FLAT50', discount_type: 'fixed', discount_value: 50, min_purchase: 500, max_discount: null, usage_limit: 2000, used_count: 567, is_active: true, valid_from: '2026-01-01', valid_until: '2026-12-31' },
  { id: 4, code: 'BIGDEAL', discount_type: 'percentage', discount_value: 30, min_purchase: 2000, max_discount: 500, usage_limit: 100, used_count: 45, is_active: true, valid_from: '2026-01-01', valid_until: '2026-12-31' },
];

export const MOCK_REVIEWS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  product_id: Math.floor(Math.random() * 50) + 1,
  product_name: `Product ${Math.floor(Math.random() * 50) + 1}`,
  customer_name: `Customer ${i + 1}`,
  rating: Math.floor(Math.random() * 5) + 1,
  comment: 'Great product! Highly recommended.',
  status: ['pending', 'approved', 'rejected'][Math.floor(Math.random() * 3)],
  created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const MOCK_INVENTORY = MOCK_PRODUCTS.map(p => ({
  product_id: p.id,
  product_name: p.name,
  sku: p.sku,
  stock: p.stock,
  low_stock_threshold: 10,
  status: p.stock === 0 ? 'out_of_stock' : p.stock < 10 ? 'low_stock' : 'in_stock',
  last_updated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
}));

export const MOCK_PAYMENTS = MOCK_ORDERS.slice(0, 30).map((order, i) => ({
  id: i + 1,
  order_id: order.id,
  order_number: order.order_number,
  amount: order.total,
  payment_method: ['card', 'upi', 'wallet', 'cod'][Math.floor(Math.random() * 4)],
  status: order.payment_status,
  transaction_id: `TXN${String(i + 1).padStart(10, '0')}`,
  created_at: order.created_at,
}));

// Helper to create mock API responses
export const mockResponse = (data, message = 'Success') => ({
  data: { data, message, success: true },
});

export const mockError = (message = 'Error occurred') => {
  throw new Error(message);
};

// Mock API delays (simulate network)
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
