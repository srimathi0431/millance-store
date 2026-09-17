import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../../config/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../../models/product_model.dart';
import '../../models/category_model.dart';
import '../../services/product_service.dart';
import 'product_detail_screen.dart';
import '../wallet/qr_scan_pay_screen.dart';
import '../affiliate/affiliate_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<ProductModel> _products = [];
  List<ProductModel> _featuredProducts = [];
  List<CategoryModel> _categories = [];
  bool _isLoading = true;
  String _searchQuery = '';
  int? _selectedCategoryId;
  
  final PageController _bannerController = PageController();
  int _currentBannerIndex = 0;
  Timer? _bannerTimer;

  @override
  void initState() {
    super.initState();
    _loadData();
    _startBannerAutoScroll();
  }
  
  @override
  void dispose() {
    _bannerTimer?.cancel();
    _bannerController.dispose();
    super.dispose();
  }
  
  void _startBannerAutoScroll() {
    _bannerTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (_currentBannerIndex < 2) {
        _currentBannerIndex++;
      } else {
        _currentBannerIndex = 0;
      }
      
      if (_bannerController.hasClients) {
        _bannerController.animateToPage(
          _currentBannerIndex,
          duration: const Duration(milliseconds: 350),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    
    await Future.wait([
      _loadCategories(),
      _loadFeaturedProducts(),
      _loadProducts(),
    ]);
    
    setState(() => _isLoading = false);
  }

  Future<void> _loadCategories() async {
    try {
      final response = await ProductService.getCategories();
      
      if (response['success'] == true) {
        // Backend returns {success: true, data: {items: [...]}}
        final dynamic data = response['data'];
        List<dynamic> categoryList = [];
        
        if (data is Map) {
          categoryList = data['items'] ?? data['categories'] ?? [];
        } else if (data is List) {
          categoryList = data;
        }
        
        _categories = categoryList.map((json) => CategoryModel.fromJson(json as Map<String, dynamic>)).toList();
      }
    } catch (e) {
      // Ignore error
    }
  }

  Future<void> _loadFeaturedProducts() async {
    try {
      final response = await ProductService.getFeaturedProducts(limit: 10);
      
      if (response['success'] == true) {
        // Backend returns direct array for featured: {success: true, data: [...]}
        final dynamic data = response['data'];
        List<dynamic> productList = [];
        
        if (data is List) {
          productList = data;
        } else if (data is Map && data['items'] != null) {
          productList = data['items'];
        }
        
        _featuredProducts = productList.map((json) => ProductModel.fromJson(json as Map<String, dynamic>)).toList();
      }
    } catch (e) {
      // Ignore error
    }
  }

  Future<void> _loadProducts() async {
    try {
      final response = await ProductService.getProducts(
        categoryId: _selectedCategoryId,
        search: _searchQuery.isEmpty ? null : _searchQuery,
      );
      
      if (response['success'] == true) {
        // Backend returns {success: true, data: {items: [...], total: X}}
        final dynamic data = response['data'];
        List<dynamic> productList = [];
        
        if (data is Map && data['items'] != null) {
          productList = data['items'];
        } else if (data is List) {
          productList = data;
        }
        
        _products = productList.map((json) => ProductModel.fromJson(json as Map<String, dynamic>)).toList();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading products: $e')),
        );
      }
    }
  }

  void _onCategorySelected(int? categoryId) {
    setState(() {
      _selectedCategoryId = categoryId;
    });
    _loadProducts();
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
    });
    
    // Debounce search
    Future.delayed(const Duration(milliseconds: 500), () {
      if (_searchQuery == query) {
        _loadProducts();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          child: CustomScrollView(
            slivers: [
              // App Bar
              SliverAppBar(
                floating: true,
                backgroundColor: AppColors.forestGreen,
                elevation: 0,
                expandedHeight: 120,
                flexibleSpace: FlexibleSpaceBar(
                  background: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(
                          'Hello, ${authProvider.user?.name ?? "Guest"}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Welcome to Millance Store',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              
              // Search Bar
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Search products...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    onChanged: _onSearchChanged,
                  ),
                ),
              ),
              
              // Banner Carousel
              SliverToBoxAdapter(
                child: _buildBannerCarousel(),
              ),
              
              // Categories
              if (_categories.isNotEmpty) ...[
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 50,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      children: [
                        _buildCategoryChip('All', null),
                        ..._categories.map((category) => 
                          _buildCategoryChip(category.name, category.id),
                        ),
                      ],
                    ),
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 8)),
              ],
              
              // Featured Products Section
              if (_searchQuery.isEmpty && _selectedCategoryId == null && _featuredProducts.isNotEmpty) ...[
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      children: [
                        const Text(
                          'Featured Products',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.orange,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'HOT',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverToBoxAdapter(
                  child: SizedBox(
                    height: 240,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      itemCount: _featuredProducts.length,
                      itemBuilder: (context, index) {
                        return _buildFeaturedProductCard(_featuredProducts[index]);
                      },
                    ),
                  ),
                ),
              ],
              
              // All Products Section
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 24, 16, 16),
                  child: Text(
                    _searchQuery.isEmpty && _selectedCategoryId == null 
                        ? 'All Products' 
                        : _searchQuery.isNotEmpty 
                            ? 'Search Results'
                            : 'Category Products',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ),
              ),
              
              // Products Grid
              _isLoading
                  ? const SliverToBoxAdapter(
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.all(32),
                          child: CircularProgressIndicator(),
                        ),
                      ),
                    )
                  : _products.isEmpty
                      ? SliverToBoxAdapter(
                          child: Center(
                            child: Padding(
                              padding: const EdgeInsets.all(32),
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.inventory_2_outlined,
                                    size: 64,
                                    color: Colors.grey[400],
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    _searchQuery.isEmpty
                                        ? 'No products available'
                                        : 'No products found',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                      fontSize: 16,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        )
                      : SliverPadding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          sliver: SliverGrid(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: 0.7,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                            ),
                            delegate: SliverChildBuilderDelegate(
                              (context, index) {
                                return _buildProductCard(_products[index]);
                              },
                              childCount: _products.length,
                            ),
                          ),
                        ),
              
              const SliverToBoxAdapter(child: SizedBox(height: 16)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String label, int? categoryId) {
    final isSelected = _selectedCategoryId == categoryId;
    
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (_) => _onCategorySelected(categoryId),
        backgroundColor: Colors.white,
        selectedColor: AppColors.forestGreen.withOpacity(0.2),
        labelStyle: TextStyle(
          color: isSelected ? AppColors.forestGreen : AppColors.textSecondary,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
        ),
        side: BorderSide(
          color: isSelected ? AppColors.forestGreen : AppColors.border,
        ),
      ),
    );
  }

  Widget _buildFeaturedProductCard(ProductModel product) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailScreen(product: product),
          ),
        );
      },
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            Container(
              height: 140,
              decoration: BoxDecoration(
                color: AppColors.lightBlue.withOpacity(0.3),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(16),
                ),
              ),
              child: product.image != null
                  ? ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(16),
                      ),
                      child: Image.network(
                        product.image!,
                        fit: BoxFit.cover,
                        width: double.infinity,
                        errorBuilder: (_, __, ___) => const Icon(
                          Icons.image_outlined,
                          size: 48,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    )
                  : const Center(
                      child: Icon(
                        Icons.image_outlined,
                        size: 48,
                        color: AppColors.textSecondary,
                      ),
                    ),
            ),
            
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₹${product.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.forestGreen,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductCard(ProductModel product) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductDetailScreen(product: product),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image - Fixed aspect ratio
            AspectRatio(
              aspectRatio: 1.0,
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.lightBlue.withOpacity(0.3),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                  ),
                ),
                child: product.image != null
                    ? ClipRRect(
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(16),
                        ),
                        child: Image.network(
                          product.image!,
                          fit: BoxFit.cover,
                          width: double.infinity,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.image_outlined,
                            size: 48,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      )
                    : const Center(
                        child: Icon(
                          Icons.image_outlined,
                          size: 48,
                          color: AppColors.textSecondary,
                        ),
                      ),
              ),
            ),
            
            // Product Info - Fixed height with proper padding
            Container(
              height: 80,
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Flexible(
                    child: Text(
                      product.name,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₹${product.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.forestGreen,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildBannerCarousel() {
    final banners = [
      {
        'image': 'assets/images/banner_product.jpeg',
        'onTap': () {
          // Already on home page - scroll to products
          setState(() {
            _searchQuery = '';
            _selectedCategoryId = null;
          });
        },
      },
      {
        'image': 'assets/images/banner_pay.jpeg',
        'onTap': () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const QRScanPayScreen()),
          );
        },
      },
      {
        'image': 'assets/images/banner_affiliate.jpeg',
        'onTap': () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AffiliateScreen()),
          );
        },
      },
    ];
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // Banner with responsive aspect ratio (no cropping)
          AspectRatio(
            aspectRatio: 16 / 9, // Standard banner aspect ratio
            child: PageView.builder(
              controller: _bannerController,
              itemCount: banners.length,
              onPageChanged: (index) {
                setState(() => _currentBannerIndex = index);
              },
              itemBuilder: (context, index) {
                return GestureDetector(
                  onTap: banners[index]['onTap'] as VoidCallback,
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.asset(
                        banners[index]['image'] as String,
                        fit: BoxFit.contain, // Use contain to show full banner without cropping
                        width: double.infinity,
                        errorBuilder: (_, __, ___) => Container(
                          color: AppColors.lightBlue.withOpacity(0.3),
                          child: const Center(
                            child: Icon(
                              Icons.image_outlined,
                              size: 48,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),
          // Dots Indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              banners.length,
              (index) => Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _currentBannerIndex == index
                      ? AppColors.forestGreen
                      : AppColors.forestGreen.withOpacity(0.3),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
