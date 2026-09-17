class OrderModel {
  final int id;
  final String orderNumber;
  final double totalAmount;
  final String status;
  final String paymentStatus;
  final String paymentMethod;
  final DateTime createdAt;
  final List<OrderItemModel> items;
  final String? shippingAddress;
  final String? trackingNumber;

  OrderModel({
    required this.id,
    required this.orderNumber,
    required this.totalAmount,
    required this.status,
    required this.paymentStatus,
    required this.paymentMethod,
    required this.createdAt,
    required this.items,
    this.shippingAddress,
    this.trackingNumber,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    final List<dynamic> itemsJson = json['items'] ?? [];
    final items = itemsJson.map((item) => OrderItemModel.fromJson(item)).toList();
    
    return OrderModel(
      id: json['id'] ?? 0,
      orderNumber: json['order_number'] ?? '',
      totalAmount: (json['total_amount'] ?? 0).toDouble(),
      status: json['status'] ?? 'pending',
      paymentStatus: json['payment_status'] ?? 'pending',
      paymentMethod: json['payment_method'] ?? '',
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
      items: items,
      shippingAddress: json['shipping_address'],
      trackingNumber: json['tracking_number'],
    );
  }

  String get statusDisplay {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }
}

class OrderItemModel {
  final int id;
  final int productId;
  final String productName;
  final double price;
  final int quantity;
  final String? imageUrl;

  OrderItemModel({
    required this.id,
    required this.productId,
    required this.productName,
    required this.price,
    required this.quantity,
    this.imageUrl,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) {
    return OrderItemModel(
      id: json['id'] ?? 0,
      productId: json['product_id'] ?? 0,
      productName: json['product_name'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      quantity: json['quantity'] ?? 0,
      imageUrl: json['image_url'],
    );
  }

  double get total => price * quantity;
}
