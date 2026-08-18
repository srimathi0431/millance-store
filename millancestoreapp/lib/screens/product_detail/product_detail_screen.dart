import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:animate_do/animate_do.dart';
import '../../models/product.dart';
import '../../theme/app_colors.dart';
import '../../data/mock_data.dart';
import '../checkout/address_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;

  const ProductDetailScreen({
    super.key,
    required this.product,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _currentImageIndex = 0;
  bool _isFavorite = false;
  final CarouselSliderController _carouselController = CarouselSliderController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            pinned: true,
            backgroundColor: Colors.white,
            elevation: 1,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.black),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search, color: Colors.black),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.shopping_cart_outlined, color: Colors.black),
                onPressed: () {},
              ),
            ],
          ),

          // Product Images Carousel
          SliverToBoxAdapter(
            child: Column(
              children: [
                Stack(
                  children: [
                    CarouselSlider(
                      carouselController: _carouselController,
                      options: CarouselOptions(
                        height: 400,
                        viewportFraction: 1.0,
                        enableInfiniteScroll: false,
                        onPageChanged: (index, reason) {
                          setState(() {
                            _currentImageIndex = index;
                          });
                        },
                      ),
                      items: widget.product.images.map((image) {
                        return GestureDetector(
                          onTap: () {
                            // Open full screen image viewer
                          },
                          child: Container(
                            width: double.infinity,
                            color: AppColors.lightGray,
                            child: Image.network(
                              image,
                              fit: BoxFit.contain,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    // Wishlist Button
                    Positioned(
                      top: 16,
                      right: 16,
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            _isFavorite = !_isFavorite;
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: AppColors.cardShadow,
                          ),
                          child: Icon(
                            _isFavorite ? Icons.favorite : Icons.favorite_border,
                            color: _isFavorite ? Colors.red : AppColors.textGray,
                            size: 24,
                          ),
                        ),
                      ),
                    ),
                    // Share Button
                    Positioned(
                      top: 16,
                      left: 16,
                      child: GestureDetector(
                        onTap: () {
                          // Share product
                          _shareProduct();
                        },
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            boxShadow: AppColors.cardShadow,
                          ),
                          child: const Icon(
                            Icons.share_outlined,
                            color: AppColors.textGray,
                            size: 24,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Image Indicators
                if (widget.product.images.length > 1)
                  AnimatedSmoothIndicator(
                    activeIndex: _currentImageIndex,
                    count: widget.product.images.length,
                    effect: const WormEffect(
                      dotHeight: 8,
                      dotWidth: 8,
                      activeDotColor: AppColors.primaryOrange,
                      dotColor: AppColors.borderLight,
                    ),
                  ),
                const SizedBox(height: 16),
              ],
            ),
          ),

          // Product Info
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Brand
                  if (widget.product.brand != null)
                    FadeInLeft(
                      child: Text(
                        widget.product.brand!,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppColors.textGray,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  const SizedBox(height: 4),
                  
                  // Product Name
                  FadeInLeft(
                    delay: const Duration(milliseconds: 100),
                    child: Text(
                      widget.product.name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        height: 1.3,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  
                  // Rating & Reviews
                  FadeInLeft(
                    delay: const Duration(milliseconds: 200),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.success,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Row(
                            children: [
                              Text(
                                widget.product.rating.toString(),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(width: 4),
                              const Icon(
                                Icons.star,
                                color: Colors.white,
                                size: 14,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '${widget.product.reviews.toStringAsFixed(0)} Ratings',
                          style: const TextStyle(
                            color: AppColors.textGray,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Price Section
                  FadeInLeft(
                    delay: const Duration(milliseconds: 300),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightGray,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Text(
                            '₹${widget.product.price.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                          const SizedBox(width: 12),
                          if (widget.product.originalPrice != null) ...[
                            Text(
                              '₹${widget.product.originalPrice!.toStringAsFixed(0)}',
                              style: const TextStyle(
                                fontSize: 16,
                                color: AppColors.textGray,
                                decoration: TextDecoration.lineThrough,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                gradient: AppColors.orangePinkGradient,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                '${widget.product.discount}% OFF',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Offers Section
                  _buildSectionTitle('Available Offers'),
                  const SizedBox(height: 12),
                  _buildOfferItem('10% Instant Discount on HDFC Bank Cards'),
                  _buildOfferItem('5% Cashback on Millance Gold Vault'),
                  _buildOfferItem('No Cost EMI available on orders above ₹3,000'),
                  const SizedBox(height: 20),
                  
                  // Highlights
                  if (widget.product.highlights.isNotEmpty) ...[
                    _buildSectionTitle('Highlights'),
                    const SizedBox(height: 12),
                    ...widget.product.highlights.map((highlight) => 
                      _buildBulletPoint(highlight)
                    ),
                    const SizedBox(height: 20),
                  ],
                  
                  // Description
                  _buildSectionTitle('Product Description'),
                  const SizedBox(height: 12),
                  Text(
                    widget.product.description,
                    style: const TextStyle(
                      fontSize: 14,
                      height: 1.6,
                      color: AppColors.textGray,
                    ),
                  ),
                  const SizedBox(height: 20),
                  
                  // Specifications
                  if (widget.product.specifications != null) ...[
                    _buildSectionTitle('Specifications'),
                    const SizedBox(height: 12),
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.borderLight),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Column(
                        children: widget.product.specifications!.entries
                            .map((entry) => _buildSpecRow(entry.key, entry.value))
                            .toList(),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                  
                  // Ratings & Reviews Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildSectionTitle('Ratings & Reviews'),
                      TextButton(
                        onPressed: () {},
                        child: const Text('See all'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _buildRatingOverview(),
                  const SizedBox(height: 20),
                  
                  // Similar Products
                  _buildSectionTitle('Similar Products'),
                  const SizedBox(height: 12),
                ],
              ),
            ),
          ),
          
          // Similar Products Horizontal List
          SliverToBoxAdapter(
            child: SizedBox(
              height: 280,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: MockData.products.length,
                itemBuilder: (context, index) {
                  final product = MockData.products[index];
                  return Container(
                    width: 160,
                    margin: const EdgeInsets.only(right: 12),
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ProductDetailScreen(
                              product: product,
                            ),
                          ),
                        );
                      },
                      child: _buildSimilarProductCard(product),
                    ),
                  );
                },
              ),
            ),
          ),
          
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      
      // Bottom Action Bar
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  // Add to cart
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Added to cart!'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryOrange,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  'ADD TO CART',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: ElevatedButton(
                  onPressed: () {
                    // Navigate to address screen for checkout
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const AddressScreen(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'BUY NOW',
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

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildOfferItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          const Icon(
            Icons.local_offer,
            size: 16,
            color: AppColors.success,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textDark,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(fontSize: 16)),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                height: 1.5,
                color: AppColors.textGray,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecRow(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        border: Border(
          bottom: BorderSide(color: AppColors.borderLight),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textGray,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingOverview() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.lightGray,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          Column(
            children: [
              Text(
                widget.product.rating.toString(),
                style: const TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Row(
                children: [
                  Icon(Icons.star, color: AppColors.success, size: 16),
                  Icon(Icons.star, color: AppColors.success, size: 16),
                  Icon(Icons.star, color: AppColors.success, size: 16),
                  Icon(Icons.star, color: AppColors.success, size: 16),
                  Icon(Icons.star_half, color: AppColors.success, size: 16),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                '${widget.product.reviews} ratings',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textGray,
                ),
              ),
            ],
          ),
          const SizedBox(width: 24),
          Expanded(
            child: Column(
              children: [
                _buildRatingBar(5, 0.7),
                _buildRatingBar(4, 0.2),
                _buildRatingBar(3, 0.05),
                _buildRatingBar(2, 0.03),
                _buildRatingBar(1, 0.02),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRatingBar(int stars, double percentage) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Text(
            '$stars',
            style: const TextStyle(fontSize: 12),
          ),
          const SizedBox(width: 4),
          const Icon(Icons.star, size: 12, color: AppColors.textGray),
          const SizedBox(width: 8),
          Expanded(
            child: LinearProgressIndicator(
              value: percentage,
              backgroundColor: AppColors.borderLight,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.success),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '${(percentage * 100).toInt()}%',
            style: const TextStyle(fontSize: 11, color: AppColors.textGray),
          ),
        ],
      ),
    );
  }

  Widget _buildSimilarProductCard(Product product) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 160,
            decoration: BoxDecoration(
              color: AppColors.lightGray,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(8),
                topRight: Radius.circular(8),
              ),
              image: DecorationImage(
                image: NetworkImage(product.image),
                fit: BoxFit.cover,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '₹${product.price.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _shareProduct() {
    // Share product details
    final shareText = '${widget.product.name}\n'
        '₹${widget.product.price.toStringAsFixed(0)}\n'
        'Check out this amazing product on Millance Store!';
    
    // Show share options dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Share Product'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.message, color: AppColors.primaryOrange),
              title: const Text('Share via WhatsApp'),
              onTap: () {
                Navigator.pop(context);
                // TODO: Implement WhatsApp sharing
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening WhatsApp...')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.copy, color: AppColors.primaryOrange),
              title: const Text('Copy Link'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Link copied to clipboard!')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
