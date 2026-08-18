import 'product.dart';

/// Local in-memory cart item (kept for backward compatibility with CartService)
class CartItem {
  final String id;
  final Product product;
  int quantity;
  final int? variantId;
  final String? variantName;

  CartItem({
    required this.id,
    required this.product,
    required this.quantity,
    this.variantId,
    this.variantName,
  });

  double get subtotal => product.effectivePrice * quantity;
}

/// Server-side cart item — returned by /api/customer/cart
class ServerCartItem {
  final int id;
  final int productId;
  final String productName;
  final String productSlug;
  final int? variantId;
  final String? variantName;
  final int quantity;
  final double unitPrice;
  final double subtotal;
  final String? primaryImage;
  final bool inStock;
  final int availableStock;

  const ServerCartItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.productSlug,
    this.variantId,
    this.variantName,
    required this.quantity,
    required this.unitPrice,
    required this.subtotal,
    this.primaryImage,
    required this.inStock,
    required this.availableStock,
  });

  factory ServerCartItem.fromJson(Map<String, dynamic> j) => ServerCartItem(
        id:             j['id'] as int,
        productId:      j['product_id'] as int,
        productName:    j['product_name'] as String,
        productSlug:    j['product_slug'] as String,
        variantId:      j['variant_id'] as int?,
        variantName:    j['variant_name'] as String?,
        quantity:       j['quantity'] as int,
        unitPrice:      double.parse(j['unit_price'].toString()),
        subtotal:       double.parse(j['subtotal'].toString()),
        primaryImage:   j['primary_image'] as String?,
        inStock:        j['in_stock'] as bool? ?? true,
        availableStock: j['available_stock'] as int? ?? 0,
      );
}

class ServerCart {
  final List<ServerCartItem> items;
  final int itemCount;
  final int totalQty;
  final double subtotal;
  final double total;

  const ServerCart({
    required this.items,
    required this.itemCount,
    required this.totalQty,
    required this.subtotal,
    required this.total,
  });

  factory ServerCart.fromJson(Map<String, dynamic> j) => ServerCart(
        items:     (j['items'] as List)
            .map((e) => ServerCartItem.fromJson(e as Map<String, dynamic>))
            .toList(),
        itemCount: j['item_count'] as int? ?? 0,
        totalQty:  j['total_qty'] as int? ?? 0,
        subtotal:  double.parse(j['subtotal'].toString()),
        total:     double.parse(j['total'].toString()),
      );

  bool get isEmpty => items.isEmpty;
}
