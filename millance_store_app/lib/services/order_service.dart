import 'api_service.dart';
import '../config/api_config.dart';

class OrderService {
  // Get all orders
  static Future<Map<String, dynamic>> getOrders({
    int page = 1,
    int pageSize = 20,
  }) async {
    return await ApiService.get(
      '${ApiConfig.orders}?page=$page&page_size=$pageSize',
    );
  }

  // Get order detail
  static Future<Map<String, dynamic>> getOrderDetail(int orderId) async {
    return await ApiService.get('${ApiConfig.orderDetail}/$orderId');
  }

  // Create order
  static Future<Map<String, dynamic>> createOrder({
    required String paymentMethod,
    required String shippingName,
    required String shippingPhone,
    required String shippingAddress,
  }) async {
    return await ApiService.post(
      ApiConfig.orders,
      {
        'payment_method': paymentMethod,
        'shipping_name': shippingName,
        'shipping_phone': shippingPhone,
        'shipping_address': shippingAddress,
      },
    );
  }
}
