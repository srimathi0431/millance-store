import 'api_service.dart';
import '../config/api_config.dart';

class CartService {
  // Get cart
  static Future<Map<String, dynamic>> getCart() async {
    return await ApiService.get(ApiConfig.cart);
  }

  // Add to cart
  static Future<Map<String, dynamic>> addToCart({
    required int productId,
    required int quantity,
  }) async {
    return await ApiService.post(
      ApiConfig.addToCart,
      {
        'product_id': productId,
        'quantity': quantity,
      },
    );
  }

  // Update cart item
  static Future<Map<String, dynamic>> updateCart({
    required int itemId,
    required int quantity,
  }) async {
    return await ApiService.put(
      '${ApiConfig.updateCart}/$itemId',
      {
        'quantity': quantity,
      },
    );
  }

  // Remove from cart
  static Future<Map<String, dynamic>> removeFromCart(int itemId) async {
    return await ApiService.delete('${ApiConfig.removeFromCart}/$itemId');
  }

  // Clear cart
  static Future<Map<String, dynamic>> clearCart() async {
    return await ApiService.delete(ApiConfig.clearCart);
  }
}
