// Millance Store - Type Definitions

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: 'new' | 'bestseller' | 'sale' | 'exclusive';
  seller: Seller;
}

export interface Seller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  totalProducts: number;
  verified: boolean;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  totalProducts: number;
  verified: boolean;
  categories: string[];
  location?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  count?: number;
}

export interface Review {
  id: string;
  user: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description?: string;
}

export interface Banner {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
  addedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: CartItem[];
  shippingAddress: Address;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  wishlist: string[];
  cart: CartItem[];
}

export interface FlashSale {
  id: string;
  title: string;
  endsAt: string;
  products: Product[];
}
