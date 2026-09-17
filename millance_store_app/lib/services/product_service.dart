import 'api_service.dart';
import '../config/api_config.dart';

class ProductService {
  // Get all products
  static Future<Map<String, dynamic>> getProducts({
    int? categoryId,
    String? search,
    int page = 1,
    int pageSize = 20,
  }) async {
    String url = ApiConfig.products;
    final params = <String, String>{};
    
    if (categoryId != null) params['category_id'] = categoryId.toString();
    if (search != null && search.isNotEmpty) params['search'] = search;
    params['page'] = page.toString();
    params['page_size'] = pageSize.toString();
    
    if (params.isNotEmpty) {
      url += '?${params.entries.map((e) => '${e.key}=${Uri.encodeComponent(e.value)}').join('&')}';
    }
    
    final response = await ApiService.get(url);
    
    // Debug: Print first product to see stock fields
    if (response['success'] == true) {
      final data = response['data'];
      if (data is Map && data['items'] != null && (data['items'] as List).isNotEmpty) {
        final firstProduct = (data['items'] as List)[0];
        print('🔍 DEBUG - First product from API:');
        print('   Name: ${firstProduct['name']}');
        print('   Stock: ${firstProduct['stock']}');
        print('   Available Stock: ${firstProduct['available_stock']}');
        print('   In Stock: ${firstProduct['in_stock']}');
        print('   All keys: ${firstProduct.keys.toList()}');
      }
    }
    
    return response;
  }

  // Get featured products
  static Future<Map<String, dynamic>> getFeaturedProducts({int limit = 10}) async {
    return await ApiService.get('${ApiConfig.featuredProducts}?limit=$limit');
  }

  // Get product detail
  static Future<Map<String, dynamic>> getProductDetail(int productId) async {
    final response = await ApiService.get('${ApiConfig.productDetail}/$productId');
    
    // Debug: Print product detail
    if (response['success'] == true && response['data'] != null) {
      final product = response['data'];
      print('🔍 DEBUG - Product detail from API:');
      print('   Name: ${product['name']}');
      print('   Stock: ${product['stock']}');
      print('   Available Stock: ${product['available_stock']}');
      print('   In Stock: ${product['in_stock']}');
      print('   All keys: ${product.keys.toList()}');
    }
    
    return response;
  }

  // Get categories
  static Future<Map<String, dynamic>> getCategories() async {
    return await ApiService.get(ApiConfig.categories);
  }
}
