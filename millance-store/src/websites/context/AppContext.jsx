import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('millance-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('millance-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('millance-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('millance-notifications');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Welcome to Millance Store!', message: 'Get 50% off on your first order', type: 'success', read: false, timestamp: new Date().toISOString() },
      { id: '2', title: 'Flash Sale Alert', message: 'Limited time offers ending soon', type: 'warning', read: false, timestamp: new Date().toISOString() },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('millance-search-history');
    return saved ? JSON.parse(saved) : [];
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => { localStorage.setItem('millance-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('millance-wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('millance-user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('millance-notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('millance-search-history', JSON.stringify(searchHistory)); }, [searchHistory]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        setNotifications((n) => [{ id: Date.now().toString(), title: 'Cart Updated', message: `${product.name} quantity increased`, type: 'success', read: false, timestamp: new Date().toISOString() }, ...n]);
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      setNotifications((n) => [{ id: Date.now().toString(), title: 'Added to Cart', message: `${product.name} added successfully`, type: 'success', read: false, timestamp: new Date().toISOString() }, ...n]);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => setCart((prev) => prev.filter((item) => item.id !== productId));

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart((prev) => prev.map((item) => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, addedAt: new Date().toISOString() }];
    });
  };
  const removeFromWishlist = (productId) => setWishlist((prev) => prev.filter((item) => item.id !== productId));
  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);
  const wishlistCount = wishlist.length;

  const login = async (email, _password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser({ id: '1', name: 'John Doe', email, phone: '+91 9876543210', avatar: '/api/placeholder/100/100', addresses: [], wishlist: [], cart: [] });
        setShowLoginModal(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => { setUser(null); setShowProfileMenu(false); };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const markNotificationAsRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const clearAllNotifications = () => setNotifications([]);

  const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    setSearchHistory((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 10));
  };

  const value = {
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartCount, cartTotal,
    wishlist, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount,
    user, isAuthenticated: !!user, login, logout,
    notifications, unreadNotificationsCount, markNotificationAsRead, clearAllNotifications,
    searchQuery, setSearchQuery, searchHistory, addToSearchHistory,
    showLoginModal, setShowLoginModal, showProfileMenu, setShowProfileMenu,
    showNotifications, setShowNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
