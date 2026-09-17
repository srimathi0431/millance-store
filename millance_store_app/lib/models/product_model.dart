class ProductModel {
  final int id;
  final String name;
  final String? description;
  final double price;
  final double? discountPrice;
  final String? image;
  final List<String>? images;
  final String? category;
  final int stock;
  final bool isActive;
  final bool isFeatured;

  ProductModel({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.discountPrice,
    this.image,
    this.images,
    this.category,
    required this.stock,
    this.isActive = true,
    this.isFeatured = false,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    // Helper function to safely convert to double
    double parseDouble(dynamic value) {
      if (value == null) return 0.0;
      if (value is double) return value;
      if (value is int) return value.toDouble();
      if (value is String) {
        return double.tryParse(value) ?? 0.0;
      }
      return 0.0;
    }
    
    // Helper function to safely convert to int
    int parseInt(dynamic value) {
      if (value == null) return 0;
      if (value is int) return value;
      if (value is double) return value.toInt();
      if (value is String) {
        return int.tryParse(value) ?? 0;
      }
      return 0;
    }
    
    // Parse stock - check multiple possible keys
    int stockValue = parseInt(json['stock'] ?? json['stock_quantity'] ?? json['available_stock'] ?? 0);
    
    // Debug log to see what we're getting
    if (stockValue == 0) {
      print('⚠️ Product ${json['name']} has 0 stock. Raw data: stock=${json['stock']}, available_stock=${json['available_stock']}, in_stock=${json['in_stock']}');
    }
    
    return ProductModel(
      id: parseInt(json['id']),
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString(),
      price: parseDouble(json['price']),
      discountPrice: json['discount_price'] != null 
          ? parseDouble(json['discount_price'])
          : null,
      image: json['image']?.toString() ?? json['image_url']?.toString() ?? json['primary_image']?.toString(),
      images: json['images'] != null 
          ? List<String>.from(json['images']) 
          : null,
      category: json['category']?.toString() ?? json['category_name']?.toString(),
      stock: stockValue,
      isActive: json['is_active'] == true || json['is_active'] == 1,
      isFeatured: json['is_featured'] == true || json['is_featured'] == 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'discount_price': discountPrice,
      'image': image,
      'images': images,
      'category': category,
      'stock': stock,
      'is_active': isActive,
      'is_featured': isFeatured,
    };
  }

  double get finalPrice => discountPrice ?? price;
  bool get hasDiscount => discountPrice != null && discountPrice! < price;
  double get discountPercentage => 
      hasDiscount ? ((price - discountPrice!) / price * 100) : 0;
}
