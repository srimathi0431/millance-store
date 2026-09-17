import 'package:flutter/material.dart';
import '../models/cart_model.dart';
import '../services/cart_service.dart';

class CartProvider extends ChangeNotifier {
  CartModel? _cart;
  bool _isLoading = false;
  String? _error;

  CartModel? get cart => _cart;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get itemCount => _cart?.itemCount ?? 0;
  double get total => _cart?.total ?? 0.0;
  bool get isEmpty => _cart?.isEmpty ?? true;

  // Load cart
  Future<void> loadCart() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await CartService.getCart();
      
      if (response['success'] == true) {
        _cart = CartModel.fromJson(response['data'] ?? {});
      } else {
        _error = response['message'] ?? 'Failed to load cart';
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  // Add to cart
  Future<bool> addToCart({
    required int productId,
    required int quantity,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await CartService.addToCart(
        productId: productId,
        quantity: quantity,
      );

      if (response['success'] == true) {
        await loadCart(); // Reload cart
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to add to cart';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Update cart item
  Future<bool> updateCartItem({
    required int itemId,
    required int quantity,
  }) async {
    try {
      final response = await CartService.updateCart(
        itemId: itemId,
        quantity: quantity,
      );

      if (response['success'] == true) {
        await loadCart(); // Reload cart
        return true;
      } else {
        _error = response['message'] ?? 'Failed to update cart';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Remove from cart
  Future<bool> removeFromCart(int itemId) async {
    try {
      final response = await CartService.removeFromCart(itemId);

      if (response['success'] == true) {
        await loadCart(); // Reload cart
        return true;
      } else {
        _error = response['message'] ?? 'Failed to remove from cart';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Clear cart
  Future<bool> clearCart() async {
    try {
      final response = await CartService.clearCart();

      if (response['success'] == true) {
        _cart = null;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Failed to clear cart';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
