import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Base URL — change to your server IP when running on a real device
const String kBaseUrl = 'http://10.0.2.2:8026'; // Android emulator → localhost
// const String kBaseUrl = 'http://localhost:8026'; // iOS simulator / web

const _storage = FlutterSecureStorage();
const _kAccessToken  = 'customer_access_token';
const _kRefreshToken = 'customer_refresh_token';

// ─────────────────────────────────────────────────────────────────────────────
// Singleton Dio instance
// ─────────────────────────────────────────────────────────────────────────────

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  late final Dio _dio = _buildDio();

  Dio _buildDio() {
    final dio = Dio(BaseOptions(
      baseUrl: kBaseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    // ── Request interceptor: inject Bearer token ──────────────────────────
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: _kAccessToken);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioException err, handler) async {
        // ── 401: try refresh once ──────────────────────────────────────────
        if (err.response?.statusCode == 401) {
          final refreshed = await _tryRefresh();
          if (refreshed) {
            // Retry original request with new token
            final token = await _storage.read(key: _kAccessToken);
            err.requestOptions.headers['Authorization'] = 'Bearer $token';
            final retryResp = await _dio.fetch(err.requestOptions);
            return handler.resolve(retryResp);
          }
          // Refresh failed → clear session
          await clearSession();
        }
        return handler.next(err);
      },
    ));

    return dio;
  }

  // ── Token storage helpers ─────────────────────────────────────────────────

  Future<void> saveTokens(String access, String refresh) async {
    await _storage.write(key: _kAccessToken,  value: access);
    await _storage.write(key: _kRefreshToken, value: refresh);
  }

  Future<String?> getAccessToken()  => _storage.read(key: _kAccessToken);
  Future<String?> getRefreshToken() => _storage.read(key: _kRefreshToken);

  Future<void> clearSession() async {
    await _storage.delete(key: _kAccessToken);
    await _storage.delete(key: _kRefreshToken);
  }

  Future<bool> get isLoggedIn async =>
      (await _storage.read(key: _kAccessToken)) != null;

  Future<bool> _tryRefresh() async {
    final refresh = await _storage.read(key: _kRefreshToken);
    if (refresh == null) return false;
    try {
      final resp = await Dio(BaseOptions(baseUrl: kBaseUrl)).post(
        '/api/customer/auth/refresh',
        data: {'refresh_token': refresh},
      );
      final data = resp.data['data'] as Map<String, dynamic>;
      await saveTokens(data['access_token'], data['refresh_token']);
      return true;
    } catch (_) {
      return false;
    }
  }

  // ── Unwrap helper ─────────────────────────────────────────────────────────
  // Backend returns { success, message, data } — this extracts data
  dynamic _d(Response r) => r.data['data'];

  // ─────────────────────────────────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> sendOtp(String phone, {String? name}) async {
    final resp = await _dio.post('/api/customer/auth/send-otp', data: {
      'phone': phone,
      if (name != null) 'name': name,
    });
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    final resp = await _dio.post('/api/customer/auth/verify-otp',
        data: {'phone': phone, 'otp': otp});
    final data = _d(resp) as Map<String, dynamic>;
    await saveTokens(data['access_token'], data['refresh_token']);
    return data;
  }

  Future<void> logout() async {
    try {
      await _dio.post('/api/customer/auth/logout');
    } catch (_) {}
    await clearSession();
  }

  Future<Map<String, dynamic>> getProfile() async {
    final resp = await _dio.get('/api/customer/auth/me');
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateProfile(
      {String? name, String? email}) async {
    final resp = await _dio.patch('/api/customer/auth/me',
        data: {if (name != null) 'name': name, if (email != null) 'email': email});
    return _d(resp) as Map<String, dynamic>;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Products (public)
  // ─────────────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> getProducts({
    int page = 1,
    int pageSize = 20,
    String? search,
    int? categoryId,
    String? brand,
    double? minPrice,
    double? maxPrice,
    bool? isFeatured,
    String sortBy = 'created_at',
    String sortOrder = 'desc',
  }) async {
    final resp = await _dio.get('/api/customer/products', queryParameters: {
      'page': page,
      'page_size': pageSize,
      if (search != null) 'search': search,
      if (categoryId != null) 'category_id': categoryId,
      if (brand != null) 'brand': brand,
      if (minPrice != null) 'min_price': minPrice,
      if (maxPrice != null) 'max_price': maxPrice,
      if (isFeatured != null) 'is_featured': isFeatured,
      'sort_by': sortBy,
      'sort_order': sortOrder,
    });
    return _d(resp) as Map<String, dynamic>;
  }

  Future<List<dynamic>> getFeaturedProducts({int limit = 10}) async {
    final resp = await _dio.get('/api/customer/products/featured',
        queryParameters: {'limit': limit});
    return _d(resp) as List<dynamic>;
  }

  Future<Map<String, dynamic>> getProductById(int id) async {
    final resp = await _dio.get('/api/customer/products/$id');
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getProductBySlug(String slug) async {
    final resp = await _dio.get('/api/customer/products/slug/$slug');
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getProductReviews(int productId,
      {int page = 1, int pageSize = 10}) async {
    final resp = await _dio.get('/api/customer/products/$productId/reviews',
        queryParameters: {'page': page, 'page_size': pageSize});
    return _d(resp) as Map<String, dynamic>;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Categories (public)
  // ─────────────────────────────────────────────────────────────────────────

  Future<List<dynamic>> getCategories() async {
    final resp = await _dio.get('/api/customer/categories');
    return _d(resp) as List<dynamic>;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Addresses
  // ─────────────────────────────────────────────────────────────────────────

  Future<List<dynamic>> getAddresses() async {
    final resp = await _dio.get('/api/customer/addresses');
    return (_d(resp) as List<dynamic>);
  }

  Future<Map<String, dynamic>> addAddress(Map<String, dynamic> data) async {
    final resp = await _dio.post('/api/customer/addresses', data: data);
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateAddress(
      int id, Map<String, dynamic> data) async {
    final resp = await _dio.put('/api/customer/addresses/$id', data: data);
    return _d(resp) as Map<String, dynamic>;
  }

  Future<void> setDefaultAddress(int id) async {
    await _dio.patch('/api/customer/addresses/$id/default');
    // Backend returns { success, message } — no data field, safe to ignore
  }

  Future<void> deleteAddress(int id) async {
    await _dio.delete('/api/customer/addresses/$id');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cart
  // ─────────────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> getCart() async {
    final resp = await _dio.get('/api/customer/cart');
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> addToCart(int productId, int quantity,
      {int? variantId}) async {
    final resp = await _dio.post('/api/customer/cart', data: {
      'product_id': productId,
      'quantity': quantity,
      if (variantId != null) 'variant_id': variantId,
    });
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateCartItem(int itemId, int quantity) async {
    final resp = await _dio.patch('/api/customer/cart/$itemId',
        data: {'quantity': quantity});
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> removeCartItem(int itemId) async {
    final resp = await _dio.delete('/api/customer/cart/$itemId');
    // Backend returns updated cart in data field after item removal
    final d = resp.data['data'];
    if (d == null) return {'items': [], 'item_count': 0, 'total_qty': 0, 'subtotal': 0, 'total': 0};
    return d as Map<String, dynamic>;
  }

  Future<void> clearCart() async {
    try {
      await _dio.delete('/api/customer/cart');
      // Backend returns { success, message } with no data field on clear — safe to ignore
    } catch (_) {}
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Coupons
  // ─────────────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> validateCoupon(
      String code, double cartTotal) async {
    final resp = await _dio.post('/api/customer/coupons/validate',
        data: {'code': code, 'cart_total': cartTotal});
    return _d(resp) as Map<String, dynamic>;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Orders
  // ─────────────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> placeOrder({
    required int addressId,
    String? couponCode,
    String paymentMethod = 'COD',
    String? notes,
  }) async {
    final resp = await _dio.post('/api/customer/orders', data: {
      'address_id': addressId,
      if (couponCode != null) 'coupon_code': couponCode,
      'payment_method': paymentMethod,
      if (notes != null) 'notes': notes,
    });
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getOrders(
      {int page = 1, int pageSize = 10, String? status}) async {
    final resp = await _dio.get('/api/customer/orders', queryParameters: {
      'page': page,
      'page_size': pageSize,
      if (status != null) 'status': status,
    });
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getOrderById(int id) async {
    final resp = await _dio.get('/api/customer/orders/$id');
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> trackOrder(int id) async {
    final resp = await _dio.get('/api/customer/orders/$id/tracking');
    return _d(resp) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> requestReturn(int id, String reason) async {
    final resp = await _dio.post('/api/customer/orders/$id/return',
        data: {'reason': reason});
    return _d(resp) as Map<String, dynamic>;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Reviews
  // ─────────────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> submitReview({
    required int productId,
    required int rating,
    String? title,
    String? body,
  }) async {
    final resp = await _dio.post('/api/customer/reviews', data: {
      'product_id': productId,
      'rating': rating,
      if (title != null) 'title': title,
      if (body != null) 'body': body,
    });
    return _d(resp) as Map<String, dynamic>;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Wishlist
  // ─────────────────────────────────────────────────────────────────────────

  Future<List<dynamic>> getWishlist() async {
    final resp = await _dio.get('/api/customer/wishlist');
    return _d(resp) as List<dynamic>;
  }

  Future<List<dynamic>> addToWishlist(int productId) async {
    final resp = await _dio.post('/api/customer/wishlist/$productId');
    return _d(resp) as List<dynamic>;
  }

  Future<List<dynamic>> removeFromWishlist(int productId) async {
    final resp = await _dio.delete('/api/customer/wishlist/$productId');
    return _d(resp) as List<dynamic>;
  }
}

/// Global singleton — use ApiService() anywhere in the app
final api = ApiService();
