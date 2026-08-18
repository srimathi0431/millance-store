import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class MyReviewsScreen extends StatelessWidget {
  const MyReviewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Reviews & Ratings'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textDark,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Header Stats
          FadeIn(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatItem('12', 'Reviews'),
                  Container(
                    width: 1,
                    height: 40,
                    color: Colors.white30,
                  ),
                  _buildStatItem('4.5', 'Avg Rating'),
                  Container(
                    width: 1,
                    height: 40,
                    color: Colors.white30,
                  ),
                  _buildStatItem('89%', 'Helpful'),
                ],
              ),
            ),
          ),

          // Tabs
          Container(
            color: Colors.white,
            child: TabBar(
              controller: DefaultTabController.of(context),
              labelColor: AppColors.primaryOrange,
              unselectedLabelColor: AppColors.textGray,
              indicatorColor: AppColors.primaryOrange,
              tabs: const [
                Tab(text: 'My Reviews'),
                Tab(text: 'Pending'),
              ],
            ),
          ),

          // Content
          Expanded(
            child: DefaultTabController(
              length: 2,
              child: TabBarView(
                children: [
                  _buildReviewsList(),
                  _buildPendingList(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 13,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }

  Widget _buildReviewsList() {
    final reviews = [
      {
        'product': 'Designer Silk Saree',
        'image': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200',
        'rating': 5,
        'date': 'July 28, 2026',
        'review': 'Absolutely beautiful saree! The quality is excellent and the color is exactly as shown. Received many compliments at the wedding.',
        'helpful': 15,
      },
      {
        'product': 'Gold Plated Necklace Set',
        'image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200',
        'rating': 4,
        'date': 'July 25, 2026',
        'review': 'Beautiful design but the clasp could be better. Overall good value for money.',
        'helpful': 8,
      },
      {
        'product': 'Cotton Kurti Set',
        'image': 'https://images.unsplash.com/photo-1583391733981-72c88ac7f363?w=200',
        'rating': 5,
        'date': 'July 20, 2026',
        'review': 'Perfect fit and very comfortable fabric. Great for daily wear. Highly recommended!',
        'helpful': 23,
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: reviews.length,
      itemBuilder: (context, index) {
        final review = reviews[index];
        return FadeInUp(
          delay: Duration(milliseconds: index * 100),
          child: _buildReviewCard(review),
        );
      },
    );
  }

  Widget _buildReviewCard(Map<String, dynamic> review) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product Info
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  review['image'],
                  width: 60,
                  height: 60,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      width: 60,
                      height: 60,
                      color: AppColors.lightGray,
                      child: Icon(Icons.image, color: AppColors.textGray),
                    );
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review['product'],
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        ...List.generate(5, (i) {
                          return Icon(
                            i < review['rating']
                                ? Icons.star
                                : Icons.star_border,
                            color: Colors.amber,
                            size: 16,
                          );
                        }),
                        const SizedBox(width: 8),
                        Text(
                          review['date'],
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textGray,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              PopupMenuButton(
                icon: const Icon(Icons.more_vert, size: 20),
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'edit',
                    child: Row(
                      children: [
                        Icon(Icons.edit, size: 18),
                        SizedBox(width: 8),
                        Text('Edit Review'),
                      ],
                    ),
                  ),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Row(
                      children: [
                        Icon(Icons.delete, size: 18, color: Colors.red),
                        SizedBox(width: 8),
                        Text('Delete Review', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          
          // Review Text
          Text(
            review['review'],
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textDark,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          
          // Helpful Count
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.thumb_up,
                  size: 14,
                  color: Colors.green,
                ),
                const SizedBox(width: 6),
                Text(
                  '${review['helpful']} found this helpful',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.green,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPendingList() {
    final pending = [
      {
        'product': 'Diamond Earrings',
        'image': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200',
        'orderDate': 'July 30, 2026',
      },
      {
        'product': 'Designer Bracelet',
        'image': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200',
        'orderDate': 'August 1, 2026',
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: pending.length,
      itemBuilder: (context, index) {
        final item = pending[index];
        return FadeInUp(
          delay: Duration(milliseconds: index * 100),
          child: _buildPendingCard(item),
        );
      },
    );
  }

  Widget _buildPendingCard(Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              item['image'],
              width: 70,
              height: 70,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  width: 70,
                  height: 70,
                  color: AppColors.lightGray,
                  child: Icon(Icons.image, color: AppColors.textGray),
                );
              },
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item['product'],
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Ordered on ${item['orderDate']}',
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textGray,
                  ),
                ),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryOrange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 8,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Rate & Review',
                    style: TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
