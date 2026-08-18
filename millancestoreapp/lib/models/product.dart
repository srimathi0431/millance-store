class ProductImage {
  final int id;
  final String imageUrl;
  final String? altText;
  final bool isPrimary;

  const ProductImage({
    required this.id,
    required this.imageUrl,
    this.altText,
    this.isPrimary = false,
  });

  factory ProductImage.fromJson(Map<String, dynamic> j) => ProductImage(
        id:        j['id'] as int,
        imageUrl:  j['image_url'] as String,
        altText:   j['alt_text'] as String?,
        isPrimary: j['is_primary'] as bool? ?? false,
      );
}

class ProductVariant {
  final int id;
  final String name;
  final String sku;
  final double price;
  final int stock;
  final String? attributes;
  final bool isActive;

  const ProductVariant({
    required this.id,
    required this.name,
    required this.sku,
    required this.price,
    required this.stock,
    this.attributes,
    this.isActive = true,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> j) => ProductVariant(
        id:         j['id'] as int,
        name:       j['name'] as String,
        sku:        j['sku'] as String,
        price:      double.parse(j['price'].toString()),
        stock:      j['stock'] as int? ?? 0,
        attributes: j['attributes'] as String?,
        isActive:   j['is_active'] as bool? ?? true,
      );
}

class Product {
  final int id;
  final String name;
  final String slug;
  final String? description;
  final String? sku;
  final String? brand;
  final double price;
  final double? discountPrice;
  final int? categoryId;
  final String? categoryName;
  final bool isFeatured;
  final bool inStock;
  final int? availableStock;
  final double? ratingAvg;
  final int reviewCount;
  final List<ProductImage> images;
  final List<ProductVariant> variants;

  // Convenience getters used by existing UI code
  String get image =>
      images.firstWhere((i) => i.isPrimary, orElse: () => images.isNotEmpty ? images.first : _placeholder).imageUrl;
  String get imageUrl => image;
  String get category => categoryName ?? '';
  double get rating => ratingAvg ?? 0.0;
  int get reviews => reviewCount;
  int get reviewsCount => reviewCount;
  double? get originalPrice => discountPrice != null ? price : null;
  double get effectivePrice => discountPrice ?? price;
  int get discountPercentage {
    if (discountPrice == null || price == 0) return 0;
    return (((price - discountPrice!) / price) * 100).round();
  }
  int? get discount => discountPercentage;
  List<String> get highlights => [];
  Map<String, String>? get specifications => null;
  String? get badge => isFeatured ? 'featured' : null;

  static final _placeholder = ProductImage(id: 0, imageUrl: 'https://via.placeholder.com/400');

  const Product({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.sku,
    this.brand,
    required this.price,
    this.discountPrice,
    this.categoryId,
    this.categoryName,
    this.isFeatured = false,
    this.inStock = true,
    this.availableStock,
    this.ratingAvg,
    this.reviewCount = 0,
    this.images = const [],
    this.variants = const [],
  });

  /// Deserialise from backend `/api/customer/products` list item or detail.
  factory Product.fromJson(Map<String, dynamic> j) {
    // Images — present in detail, absent in list (only primary_image string)
    List<ProductImage> imgs = [];
    if (j['images'] != null) {
      imgs = (j['images'] as List)
          .map((e) => ProductImage.fromJson(e as Map<String, dynamic>))
          .toList();
    } else if (j['primary_image'] != null) {
      imgs = [ProductImage(id: 0, imageUrl: j['primary_image'] as String, isPrimary: true)];
    }

    // Variants — present in detail only
    List<ProductVariant> vars = [];
    if (j['variants'] != null) {
      vars = (j['variants'] as List)
          .map((e) => ProductVariant.fromJson(e as Map<String, dynamic>))
          .toList();
    }

    return Product(
      id:            j['id'] as int,
      name:          j['name'] as String,
      slug:          j['slug'] as String? ?? '',
      description:   j['description'] as String?,
      sku:           j['sku'] as String?,
      brand:         j['brand'] as String?,
      price:         double.parse(j['price'].toString()),
      discountPrice: j['discount_price'] != null
          ? double.parse(j['discount_price'].toString())
          : null,
      categoryId:    j['category_id'] as int?,
      categoryName:  j['category_name'] as String?,
      isFeatured:    j['is_featured'] as bool? ?? false,
      inStock:       j['in_stock'] as bool? ?? true,
      availableStock: j['available_stock'] as int?,
      ratingAvg:     j['rating_avg'] != null
          ? double.parse(j['rating_avg'].toString())
          : null,
      reviewCount:   j['review_count'] as int? ?? 0,
      images:        imgs,
      variants:      vars,
    );
  }
}
