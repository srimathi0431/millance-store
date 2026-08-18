class Category {
  final int id;
  final String name;
  final String slug;
  final String? description;
  final String? imageUrl;
  final int? parentId;
  final int sortOrder;
  final List<Category> children;

  // Convenience getter used by existing UI widgets
  String get image => imageUrl ?? '';

  const Category({
    required this.id,
    required this.name,
    required this.slug,
    this.description,
    this.imageUrl,
    this.parentId,
    this.sortOrder = 0,
    this.children = const [],
  });

  factory Category.fromJson(Map<String, dynamic> j) => Category(
        id:          j['id'] as int,
        name:        j['name'] as String,
        slug:        j['slug'] as String? ?? '',
        description: j['description'] as String?,
        imageUrl:    j['image_url'] as String?,
        parentId:    j['parent_id'] as int?,
        sortOrder:   j['sort_order'] as int? ?? 0,
        children: (j['children'] as List? ?? [])
            .map((e) => Category.fromJson(e as Map<String, dynamic>))
            .toList(),
      );
}

// Legacy alias kept for screens that still use SubCategory
class SubCategory {
  final int id;
  final String name;
  final String image;

  const SubCategory({required this.id, required this.name, required this.image});
}
