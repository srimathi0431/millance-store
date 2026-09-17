class ApiConfig {
  // Base URL
  static const String baseUrl = 'https://millance.store';
  
  // API Endpoints
  
  // Auth
  static const String login = '/api/customer/auth/login';
  static const String register = '/api/customer/auth/register';
  static const String logout = '/api/customer/auth/logout';
  static const String refreshToken = '/api/customer/auth/refresh';
  
  // Products
  static const String products = '/api/customer/products';
  static const String featuredProducts = '/api/customer/products/featured';
  static const String productDetail = '/api/customer/products'; // + /{id}
  
  // Categories
  static const String categories = '/api/customer/categories';
  
  // Cart
  static const String cart = '/api/customer/cart';
  static const String addToCart = '/api/customer/cart'; // POST to same endpoint
  static const String updateCart = '/api/customer/cart'; // PATCH /{item_id}
  static const String removeFromCart = '/api/customer/cart'; // DELETE /{item_id}
  static const String clearCart = '/api/customer/cart/clear';
  
  // Orders
  static const String orders = '/api/customer/orders';
  static const String orderDetail = '/api/customer/orders'; // + /{id}
  
  // Wallet
  static const String walletBalance = '/api/customer/wallet/balance';
  static const String walletTransactions = '/api/customer/wallet/transactions';
  static const String redeemCode = '/api/customer/wallet/redeem';
  
  // Wallet PIN
  static const String walletPinStatus = '/api/customer/wallet-pin/status';
  static const String setWalletPin = '/api/customer/wallet-pin/set';
  static const String changeWalletPin = '/api/customer/wallet-pin/change';
  static const String verifyWalletPin = '/api/customer/wallet-pin/verify';
  
  // QR Payment
  static const String qrPayment = '/api/customer/qr-payment/pay';
  static const String qrPaymentHistory = '/api/customer/qr-payment/history';
  static const String qrPaymentStats = '/api/customer/qr-payment/stats';
  
  // Affiliate
  static const String affiliateStats = '/api/customer/affiliate/stats';
  static const String affiliateDashboard = '/api/customer/affiliate/dashboard';
  static const String affiliateLevelDetails = '/api/customer/affiliate/level'; // + /{level}
  static const String incomeWalletHistory = '/api/customer/wallet/income-history';
  
  // Millance Pay
  static const String millancePayBase = '/api/customer/millance-pay';
  
  // Addresses
  static const String addresses = '/api/customer/addresses';
  
  // Profile
  static const String profile = '/api/customer/profile';
  static const String updateProfile = '/api/customer/profile/update';
  
  // Timeout
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  
  // Headers
  static Map<String, String> getHeaders({String? token}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    }
    
    return headers;
  }
}
