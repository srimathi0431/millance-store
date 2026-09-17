class CategoryModel {
  final int id;
  final String name;
  final String? description;
  final String? imageUrl;
  final int productCount;

  CategoryModel({
    required this.id,
    required this.name,
    this.description,
    this.imageUrl,
    this.productCount = 0,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'],
      imageUrl: json['image_url'],
      productCount: json['product_count'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'image_url': imageUrl,
      'product_count': productCount,
    };
  }
}
