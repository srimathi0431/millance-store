class CartItemModel {
  final int id;
  final int productId;
  final String productName;
  final double price;
  final int quantity;
  final String? imageUrl;
  final int? stock;

  CartItemModel({
    required this.id,
    required this.productId,
    required this.productName,
    required this.price,
    required this.quantity,
    this.imageUrl,
    this.stock,
  });

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    return CartItemModel(
      id: json['id'] ?? 0,
      productId: json['product_id'] ?? 0,
      productName: json['product_name'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      quantity: json['quantity'] ?? 0,
      imageUrl: json['image_url'],
      stock: json['stock'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product_id': productId,
      'product_name': productName,
      'price': price,
      'quantity': quantity,
      'image_url': imageUrl,
      'stock': stock,
    };
  }

  double get total => price * quantity;

  CartItemModel copyWith({
    int? id,
    int? productId,
    String? productName,
    double? price,
    int? quantity,
    String? imageUrl,
    int? stock,
  }) {
    return CartItemModel(
      id: id ?? this.id,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      price: price ?? this.price,
      quantity: quantity ?? this.quantity,
      imageUrl: imageUrl ?? this.imageUrl,
      stock: stock ?? this.stock,
    );
  }
}

class CartModel {
  final List<CartItemModel> items;
  final double subtotal;
  final double total;

  CartModel({
    required this.items,
    required this.subtotal,
    required this.total,
  });

  factory CartModel.fromJson(Map<String, dynamic> json) {
    final List<dynamic> itemsJson = json['items'] ?? [];
    final items = itemsJson.map((item) => CartItemModel.fromJson(item)).toList();
    
    return CartModel(
      items: items,
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),
    );
  }

  int get itemCount => items.fold(0, (sum, item) => sum + item.quantity);

  bool get isEmpty => items.isEmpty;
}
