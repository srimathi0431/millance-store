import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:animate_do/animate_do.dart';
import 'package:shimmer/shimmer.dart';
import '../../theme/app_colors.dart';
import '../../models/product.dart';
import '../../models/category.dart';
import '../../widgets/product_card.dart';
import '../../data/mock_data.dart';              // banners still from assets
import '../../widgets/search_bar_widget.dart';
import '../../services/api_service.dart';
import '../notifications/notifications_screen.dart';
import '../wishlist/wishlist_screen.dart';
import '../category/category_products_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int  _bannerIndex = 0;
  final _carousel   = CarouselSliderController();

  // Real data from backend
  List<Product>  _featured   = [];
  List<Product>  _newArrivals = [];
  List<Product>  _popular    = [];
  List<Category> _categories = [];
  bool _loadingProducts   = true;
  bool _loadingCategories = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Future.wait([_loadProducts(), _loadCategories()]);
  }

  Future<void> _loadProducts() async {
    try {
      // Featured products
      final featData = await api.getFeaturedProducts(limit: 10);
      final featured = featData.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();

      // New arrivals — sorted by created_at desc
      final newData = await api.getProducts(pageSize: 8, sortBy: 'created_at', sortOrder: 'desc');
      final newArrivals = (newData['items'] as List)
          .map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();

      // Popular — sorted by rating (use discount_price desc as proxy for popular)
      final popData = await api.getProducts(pageSize: 8, sortBy: 'price', sortOrder: 'asc');
      final popular = (popData['items'] as List)
          .map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();

      if (mounted) {
        setState(() {
          _featured    = featured;
          _newArrivals = newArrivals;
          _popular     = popular;
          _loadingProducts = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() { _loadingProducts = false; });
    }
  }

  Future<void> _loadCategories() async {
    try {
      final data = await api.getCategories();
      final cats = data.map((e) => Category.fromJson(e as Map<String, dynamic>)).toList();
      if (mounted) setState(() { _categories = cats; _loadingCategories = false; });
    } catch (_) {
      if (mounted) setState(() { _loadingCategories = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: RefreshIndicator(
          color: AppColors.primaryOrange,
          onRefresh: _loadData,
          child: CustomScrollView(
            slivers: [
              // ── Header ─────────────────────────────────────────────────
              SliverToBoxAdapter(
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(gradient: AppColors.primaryGradient),
                  child: Column(children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: Colors.white,
                                borderRadius: BorderRadius.circular(8)),
                            child: Image.asset('assets/images/logo.jpeg',
                                height: 30, width: 30, fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) =>
                                    const Icon(Icons.store, size: 30, color: AppColors.primaryOrange)),
                          ),
                          const SizedBox(width: 12),
                          const Text('MILLANCE', style: TextStyle(fontSize: 24,
                              fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1.5)),
                        ]),
                        Row(children: [
                          IconButton(
                            icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                            onPressed: () => Navigator.push(context,
                                MaterialPageRoute(builder: (_) => const NotificationsScreen())),
                          ),
                          IconButton(
                            icon: const Icon(Icons.favorite_border, color: Colors.white),
                            onPressed: () => Navigator.push(context,
                                MaterialPageRoute(builder: (_) => const WishlistScreen())),
                          ),
                        ]),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const SearchBarWidget(),
                  ]),
                ),
              ),

              // ── Banner carousel ────────────────────────────────────────
              SliverToBoxAdapter(
                child: Column(children: [
                  const SizedBox(height: 16),
                  CarouselSlider(
                    carouselController: _carousel,
                    options: CarouselOptions(
                      height: 180,
                      viewportFraction: 0.9,
                      autoPlay: true,
                      autoPlayInterval: const Duration(seconds: 4),
                      enlargeCenterPage: true,
                      onPageChanged: (i, _) => setState(() => _bannerIndex = i),
                    ),
                    items: MockData.banners.map((b) => Builder(
                      builder: (_) => Container(
                        margin: const EdgeInsets.symmetric(horizontal: 5),
                        decoration: BoxDecoration(borderRadius: BorderRadius.circular(12),
                            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2),
                                blurRadius: 8, offset: const Offset(0, 4))]),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.asset(b, fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => Container(color: AppColors.lightGray)),
                        ),
                      ),
                    )).toList(),
                  ),
                  const SizedBox(height: 12),
                  AnimatedSmoothIndicator(
                    activeIndex: _bannerIndex,
                    count: MockData.banners.length,
                    effect: const WormEffect(
                      dotHeight: 8, dotWidth: 8,
                      activeDotColor: AppColors.primaryOrange, dotColor: AppColors.borderLight),
                  ),
                  const SizedBox(height: 16),
                ]),
              ),

              // ── Categories ─────────────────────────────────────────────
              if (_loadingCategories)
                SliverToBoxAdapter(child: _buildCategoryShimmer())
              else if (_categories.isNotEmpty)
                SliverToBoxAdapter(child: _buildCategorySection()),

              const SliverToBoxAdapter(child: SizedBox(height: 12)),

              // ── Featured products ──────────────────────────────────────
              if (_loadingProducts)
                SliverToBoxAdapter(child: _buildProductShimmer('Featured Products'))
              else if (_featured.isNotEmpty)
                SliverToBoxAdapter(
                  child: _buildProductSection('Featured Products',
                      Icons.star, Colors.amber, _featured)),

              const SliverToBoxAdapter(child: SizedBox(height: 12)),

              // ── New Arrivals ───────────────────────────────────────────
              if (_newArrivals.isNotEmpty)
                SliverToBoxAdapter(
                  child: _buildProductSection('New Arrivals',
                      Icons.fiber_new, Colors.purple, _newArrivals)),

              const SliverToBoxAdapter(child: SizedBox(height: 12)),

              // ── Popular / Deals ────────────────────────────────────────
              if (_popular.isNotEmpty)
                SliverToBoxAdapter(
                  child: _buildProductSection('Deals of the Day',
                      Icons.local_fire_department, Colors.red, _popular)),

              const SliverToBoxAdapter(child: SizedBox(height: 80)),
            ],
          ),
        ),
      ),
    );
  }

  // ── Builders ──────────────────────────────────────────────────────────────

  Widget _buildCategorySection() {
    return FadeInUp(
      child: Container(
        color: Colors.white,
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Shop by Category',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark)),
          const SizedBox(height: 12),
          SizedBox(
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              itemBuilder: (_, i) {
                final cat = _categories[i];
                return GestureDetector(
                  onTap: () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => CategoryProductsScreen(category: cat))),
                  child: Container(
                    width: 80,
                    margin: const EdgeInsets.only(right: 12),
                    child: Column(children: [
                      Container(
                        width: 64, height: 64,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          color: AppColors.lightGray,
                          image: cat.image.isNotEmpty
                              ? DecorationImage(
                                  image: NetworkImage(cat.image), fit: BoxFit.cover)
                              : null,
                        ),
                        child: cat.image.isEmpty
                            ? const Icon(Icons.category, color: AppColors.primaryOrange) : null,
                      ),
                      const SizedBox(height: 6),
                      Text(cat.name,
                          maxLines: 2, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center,
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
                    ]),
                  ),
                );
              },
            ),
          ),
        ]),
      ),
    );
  }

  Widget _buildProductSection(
      String title, IconData icon, Color color, List<Product> products) {
    return FadeInUp(
      child: Container(
        color: Colors.white,
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Row(children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8)),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 12),
              Text(title, style: const TextStyle(fontSize: 18,
                  fontWeight: FontWeight.bold, color: AppColors.textDark)),
            ]),
            TextButton(
              onPressed: () {},
              child: const Text('See All',
                  style: TextStyle(color: AppColors.primaryOrange, fontWeight: FontWeight.w600)),
            ),
          ]),
          const SizedBox(height: 12),
          SizedBox(
            height: 290,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: products.length,
              itemBuilder: (_, i) => Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: ProductCard(product: products[i])),
            ),
          ),
        ]),
      ),
    );
  }

  Widget _buildProductShimmer(String title) {
    return Container(
      color: Colors.white, padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(fontSize: 18,
            fontWeight: FontWeight.bold, color: AppColors.textDark)),
        const SizedBox(height: 12),
        SizedBox(
          height: 290,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: 4,
            itemBuilder: (_, __) => Shimmer.fromColors(
              baseColor: Colors.grey.shade300,
              highlightColor: Colors.grey.shade100,
              child: Container(
                width: 160, margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(color: Colors.white,
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ),
      ]),
    );
  }

  Widget _buildCategoryShimmer() {
    return Container(
      color: Colors.white, padding: const EdgeInsets.all(16),
      child: SizedBox(
        height: 100,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: 6,
          itemBuilder: (_, __) => Shimmer.fromColors(
            baseColor: Colors.grey.shade300,
            highlightColor: Colors.grey.shade100,
            child: Container(
              width: 80, height: 80,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(color: Colors.white,
                  borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ),
      ),
    );
  }
}
