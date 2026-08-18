class OrderItem {
  final int id;
  final int? productId;
  final String productName;
  final String productSku;
  final int? variantId;
  final int quantity;
  final double unitPrice;
  final double totalPrice;

  const OrderItem({
    required this.id,
    this.productId,
    required this.productName,
    required this.productSku,
    this.variantId,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
  });

  factory OrderItem.fromJson(Map<String, dynamic> j) => OrderItem(
        id:          j['id'] as int,
        productId:   j['product_id'] as int?,
        productName: j['product_name'] as String,
        productSku:  j['product_sku'] as String,
        variantId:   j['variant_id'] as int?,
        quantity:    j['quantity'] as int,
        unitPrice:   double.parse(j['unit_price'].toString()),
        totalPrice:  double.parse(j['total_price'].toString()),
      );
}

class OrderStatusHistory {
  final String? fromStatus;
  final String toStatus;
  final String? notes;
  final DateTime changedAt;

  const OrderStatusHistory({
    this.fromStatus,
    required this.toStatus,
    this.notes,
    required this.changedAt,
  });

  factory OrderStatusHistory.fromJson(Map<String, dynamic> j) =>
      OrderStatusHistory(
        fromStatus: j['from_status'] as String?,
        toStatus:   j['to_status'] as String,
        notes:      j['notes'] as String?,
        changedAt:  DateTime.parse(j['changed_at'] as String),
      );

  String get label {
    const map = {
      'PENDING':          'Order Placed',
      'CONFIRMED':        'Order Confirmed',
      'PROCESSING':       'Processing',
      'PACKED':           'Packed',
      'SHIPPED':          'Dispatched',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED':        'Delivered',
      'CANCELLED':        'Cancelled',
      'RETURN_REQUESTED': 'Return Requested',
      'RETURNED':         'Returned',
    };
    return map[toStatus] ?? toStatus;
  }
}

class Order {
  final int id;
  final String orderNumber;
  final String status;
  final double subtotal;
  final double discountAmount;
  final double taxAmount;
  final double shippingAmount;
  final double totalAmount;
  final String? shippingName;
  final String? shippingPhone;
  final String? shippingAddress;
  final String? trackingNumber;
  final String? courierName;
  final String? cancelledReason;
  final String? returnReason;
  final String? notes;
  final DateTime? confirmedAt;
  final DateTime? packedAt;
  final DateTime? dispatchedAt;
  final DateTime? deliveredAt;
  final DateTime createdAt;
  final List<OrderItem> items;
  final List<OrderStatusHistory> history;

  // Convenience getters for UI
  int get itemCount => items.length;
  bool get isActive => ![
        'DELIVERED', 'CANCELLED', 'RETURNED'
      ].contains(status);
  bool get canReturn => status == 'DELIVERED';
  bool get canCancel =>
      ['PENDING', 'CONFIRMED', 'PROCESSING'].contains(status);

  String get statusLabel {
    const map = {
      'PENDING':          'Order Placed',
      'CONFIRMED':        'Confirmed',
      'PROCESSING':       'Processing',
      'PACKED':           'Packed',
      'SHIPPED':          'Dispatched',
      'OUT_FOR_DELIVERY': 'Out for Delivery',
      'DELIVERED':        'Delivered',
      'CANCELLED':        'Cancelled',
      'RETURN_REQUESTED': 'Return Requested',
      'RETURNED':         'Returned',
    };
    return map[status] ?? status;
  }

  const Order({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.subtotal,
    required this.discountAmount,
    required this.taxAmount,
    required this.shippingAmount,
    required this.totalAmount,
    this.shippingName,
    this.shippingPhone,
    this.shippingAddress,
    this.trackingNumber,
    this.courierName,
    this.cancelledReason,
    this.returnReason,
    this.notes,
    this.confirmedAt,
    this.packedAt,
    this.dispatchedAt,
    this.deliveredAt,
    required this.createdAt,
    this.items = const [],
    this.history = const [],
  });

  factory Order.fromJson(Map<String, dynamic> j) => Order(
        id:             j['id'] as int,
        orderNumber:    j['order_number'] as String,
        status:         j['status'] as String,
        subtotal:       double.parse(j['subtotal']?.toString() ?? '0'),
        discountAmount: double.parse(j['discount_amount']?.toString() ?? '0'),
        taxAmount:      double.parse(j['tax_amount']?.toString() ?? '0'),
        shippingAmount: double.parse(j['shipping_amount']?.toString() ?? '0'),
        totalAmount:    double.parse(j['total_amount']?.toString() ?? '0'),
        shippingName:   j['shipping_name'] as String?,
        shippingPhone:  j['shipping_phone'] as String?,
        shippingAddress: j['shipping_address'] as String?,
        trackingNumber: j['tracking_number'] as String?,
        courierName:    j['courier_name'] as String?,
        cancelledReason: j['cancelled_reason'] as String?,
        returnReason:   j['return_reason'] as String?,
        notes:          j['notes'] as String?,
        confirmedAt:    j['confirmed_at'] != null ? DateTime.parse(j['confirmed_at']) : null,
        packedAt:       j['packed_at']    != null ? DateTime.parse(j['packed_at'])    : null,
        dispatchedAt:   j['dispatched_at']!= null ? DateTime.parse(j['dispatched_at']): null,
        deliveredAt:    j['delivered_at'] != null ? DateTime.parse(j['delivered_at']) : null,
        createdAt:      DateTime.parse(j['created_at'] as String),
        items: (j['items'] as List? ?? [])
            .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
            .toList(),
        history: (j['history'] as List? ?? [])
            .map((e) => OrderStatusHistory.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}
