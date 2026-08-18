import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, WishlistItem, User, Product } from '@/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // User
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;

  // UI State
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Load from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('millance-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('millance-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('millance-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('millance-notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Welcome to Millance Store!',
        message: 'Get 50% off on your first order',
        type: 'success',
        read: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Flash Sale Alert',
        message: 'Limited time offers ending soon',
        type: 'warning',
        read: false,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('millance-search-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('millance-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('millance-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('millance-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('millance-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('millance-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Show notification for existing item
        setNotifications((prevNotifs) => [
          {
            id: Date.now().toString(),
            title: 'Cart Updated',
            message: `${product.name} quantity increased`,
            type: 'success',
            read: false,
            timestamp: new Date().toISOString(),
          },
          ...prevNotifs,
        ]);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Show notification for new item
      setNotifications((prevNotifs) => [
        {
          id: Date.now().toString(),
          title: 'Added to Cart',
          message: `${product.name} added successfully`,
          type: 'success',
          read: false,
          timestamp: new Date().toISOString(),
        },
        ...prevNotifs,
      ]);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Wishlist functions
  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const wishlistCount = wishlist.length;

  // Auth functions
  const login = async (email: string, _password: string) => {
    // Mock login
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          name: 'John Doe',
          email,
          phone: '+91 9876543210',
          avatar: '/api/placeholder/100/100',
          addresses: [],
          wishlist: [],
          cart: [],
        };
        setUser(mockUser);
        setShowLoginModal(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setShowProfileMenu(false);
  };

  // Notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Search
  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  const value: AppContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartTotal,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount,
    user,
    isAuthenticated: !!user,
    login,
    logout,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    clearAllNotifications,
    searchQuery,
    setSearchQuery,
    searchHistory,
    addToSearchHistory,
    showLoginModal,
    setShowLoginModal,
    showProfileMenu,
    setShowProfileMenu,
    showNotifications,
    setShowNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
