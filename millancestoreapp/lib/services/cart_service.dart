import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../models/product.dart';
import 'api_service.dart';
import 'auth_service.dart';

/// CartService bridges the local UI state and the backend cart API.
///
/// When the customer is logged in, every mutation syncs to the server and
/// the server cart is the source of truth.
/// When not logged in, the cart lives in memory only and syncs on next login.
class CartService extends ChangeNotifier {
  static final CartService _instance = CartService._internal();
  factory CartService() => _instance;
  CartService._internal();

  ServerCart? _serverCart;
  bool _loading = false;
  String? _error;

  ServerCart? get serverCart => _serverCart;
  bool get isLoading => _loading;
  String? get error => _error;

  // ── Summary getters used by existing UI ──────────────────────────────────

  int get itemCount => _serverCart?.itemCount ?? 0;
  int get totalQuantity => _serverCart?.totalQty ?? 0;
  double get subtotal => _serverCart?.subtotal ?? 0.0;
  double get total => _serverCart?.total ?? 0.0;
  List<ServerCartItem> get cartItems => _serverCart?.items ?? [];
  bool get isEmpty => cartItems.isEmpty;

  bool isInCart(int productId) =>
      cartItems.any((i) => i.productId == productId);

  // ── Load cart from server ────────────────────────────────────────────────

  Future<void> loadCart() async {
    if (!authService.isLoggedIn) return;
    _loading = true;
    _error   = null;
    notifyListeners();
    try {
      final data = await api.getCart();
      _serverCart = ServerCart.fromJson(data);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  // ── Add / update ─────────────────────────────────────────────────────────

  Future<void> addToCart(dynamic product, {int quantity = 1, int? variantId}) async {
    if (!authService.isLoggedIn) return;

    // Accept both Product (old) and int product ID
    final id = product is Product ? product.id : product as int;

    _loading = true;
    notifyListeners();
    try {
      final data = await api.addToCart(id, quantity, variantId: variantId);
      _serverCart = ServerCart.fromJson(data);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> updateQuantity(int itemId, int newQuantity) async {
    if (!authService.isLoggedIn) return;
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    _loading = true;
    notifyListeners();
    try {
      final data = await api.updateCartItem(itemId, newQuantity);
      _serverCart = ServerCart.fromJson(data);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> removeFromCart(int itemId) async {
    if (!authService.isLoggedIn) return;
    _loading = true;
    notifyListeners();
    try {
      final data = await api.removeCartItem(itemId);
      _serverCart = ServerCart.fromJson(data);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<void> clearCart() async {
    if (!authService.isLoggedIn) return;
    try {
      await api.clearCart();
      _serverCart = null;
      notifyListeners();
    } catch (_) {}
  }
}

final cartService = CartService();
