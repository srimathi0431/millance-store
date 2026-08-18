import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../../data/mock_data.dart';
import '../../widgets/product_card.dart';
import '../product_detail/product_detail_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  bool _isSearching = false;
  String _searchQuery = '';
  String _selectedSort = 'Popularity'; // Default sort
  List<String> _selectedFilters = [];

  final List<String> _sortOptions = [
    'Popularity',
    'Price: Low to High',
    'Price: High to Low',
    'Newest First',
    'Rating',
  ];

  final List<String> _filterOptions = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Home & Kitchen',
    'Sports',
  ];

  final List<String> _recentSearches = [
    'Wireless Headphones',
    'Smart Watch',
    'Running Shoes',
    'Sunglasses',
  ];

  final List<String> _trendingSearches = [
    'iPhone 15 Pro',
    'Samsung Galaxy S24',
    'AirPods Pro',
    'MacBook Air M2',
    'iPad Pro',
    'Sony WH-1000XM5',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Container(
          height: 44,
          decoration: BoxDecoration(
            color: AppColors.lightGray,
            borderRadius: BorderRadius.circular(8),
          ),
          child: TextField(
            controller: _searchController,
            focusNode: _searchFocusNode,
            autofocus: true,
            decoration: InputDecoration(
              hintText: 'Search for products...',
              hintStyle: const TextStyle(
                color: AppColors.textLight,
                fontSize: 15,
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 20),
                      onPressed: () {
                        setState(() {
                          _searchController.clear();
                          _searchQuery = '';
                          _isSearching = false;
                        });
                      },
                    )
                  : const Icon(Icons.search, color: AppColors.textGray),
            ),
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
                _isSearching = value.isNotEmpty;
              });
            },
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.camera_alt_outlined, color: Colors.black),
            onPressed: () {
              // Image search
            },
          ),
        ],
      ),
      body: _isSearching ? _buildSearchResults() : _buildSearchSuggestions(),
    );
  }

  Widget _buildSearchSuggestions() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Recent Searches
          if (_recentSearches.isNotEmpty) ...[
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recent Searches',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      // Clear recent searches
                    },
                    child: const Text('Clear all'),
                  ),
                ],
              ),
            ),
            Container(
              color: Colors.white,
              child: Column(
                children: _recentSearches.map((search) {
                  return ListTile(
                    leading: const Icon(
                      Icons.history,
                      color: AppColors.textGray,
                    ),
                    title: Text(search),
                    trailing: IconButton(
                      icon: const Icon(Icons.close, size: 20),
                      onPressed: () {
                        // Remove from recent
                      },
                    ),
                    onTap: () {
                      _searchController.text = search;
                      setState(() {
                        _searchQuery = search;
                        _isSearching = true;
                      });
                    },
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Trending Searches
          Padding(
            padding: const EdgeInsets.all(16),
            child: const Text(
              'Trending Searches',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Container(
            color: Colors.white,
            child: Column(
              children: _trendingSearches.map((search) {
                return ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      gradient: AppColors.orangePinkGradient,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(
                      Icons.trending_up,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                  title: Text(search),
                  trailing: const Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: AppColors.textGray,
                  ),
                  onTap: () {
                    _searchController.text = search;
                    setState(() {
                      _searchQuery = search;
                      _isSearching = true;
                    });
                  },
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    final results = MockData.products
        .where((p) => p.name.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();

    return Column(
      children: [
        // Filter & Sort Bar
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          color: Colors.white,
          child: Row(
            children: [
              Expanded(
                child: _buildFilterChip(
                  icon: Icons.tune,
                  label: 'Filters',
                  onTap: () {
                    _showFiltersBottomSheet();
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildFilterChip(
                  icon: Icons.sort,
                  label: 'Sort',
                  onTap: () {
                    _showSortBottomSheet();
                  },
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 1),
        
        // Results Count
        Container(
          padding: const EdgeInsets.all(16),
          color: Colors.white,
          width: double.infinity,
          child: Text(
            '${results.length} Results for "$_searchQuery"',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(height: 8),
        
        // Results Grid
        Expanded(
          child: results.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.search_off,
                        size: 80,
                        color: AppColors.textGray.withOpacity(0.5),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'No products found',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Try searching with different keywords',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppColors.textGray,
                        ),
                      ),
                    ],
                  ),
                )
              : GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 0.65,
                  ),
                  itemCount: results.length,
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ProductDetailScreen(
                              product: results[index],
                            ),
                          ),
                        );
                      },
                      child: ProductCard(product: results[index]),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildFilterChip({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.border),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 20, color: AppColors.textDark),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showFiltersBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.8,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: AppColors.borderLight),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Filters',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      // Clear all filters
                    },
                    child: const Text('Clear all'),
                  ),
                ],
              ),
            ),
            // Filter Options
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildFilterSection('Price Range', [
                      'Under ₹1,000',
                      '₹1,000 - ₹3,000',
                      '₹3,000 - ₹5,000',
                      'Above ₹5,000',
                    ]),
                    _buildFilterSection('Brand', [
                      'AudioTech',
                      'TechGear',
                      'Luxe',
                      'SportPro',
                      'SunStyle',
                    ]),
                    _buildFilterSection('Discount', [
                      '50% or more',
                      '40% or more',
                      '30% or more',
                      '20% or more',
                      '10% or more',
                    ]),
                    _buildFilterSection('Customer Rating', [
                      '4★ & above',
                      '3★ & above',
                      '2★ & above',
                      '1★ & above',
                    ]),
                  ],
                ),
              ),
            ),
            // Apply Button
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(
                  top: BorderSide(color: AppColors.borderLight),
                ),
              ),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryOrange,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Apply Filters',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterSection(String title, List<String> options) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        ...options.map((option) => CheckboxListTile(
              title: Text(option),
              value: false,
              onChanged: (value) {},
              dense: true,
              contentPadding: EdgeInsets.zero,
              activeColor: AppColors.primaryOrange,
            )),
        const Divider(height: 32),
      ],
    );
  }

  void _showSortBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(
                  bottom: BorderSide(color: AppColors.borderLight),
                ),
              ),
              child: const Text(
                'Sort By',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            _buildSortOption('Popularity', true),
            _buildSortOption('Price: Low to High', false),
            _buildSortOption('Price: High to Low', false),
            _buildSortOption('Newest First', false),
            _buildSortOption('Customer Rating', false),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildSortOption(String label, bool isSelected) {
    return ListTile(
      title: Text(
        label,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          color: isSelected ? AppColors.primaryOrange : AppColors.textDark,
        ),
      ),
      trailing: isSelected
          ? const Icon(Icons.check, color: AppColors.primaryOrange)
          : null,
      onTap: () {
        Navigator.pop(context);
      },
    );
  }
}
