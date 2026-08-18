import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class CouponsScreen extends StatefulWidget {
  const CouponsScreen({super.key});

  @override
  State<CouponsScreen> createState() => _CouponsScreenState();
}

class _CouponsScreenState extends State<CouponsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> availableCoupons = [
    {
      'code': 'FIRST100',
      'title': '₹100 off on first order',
      'description': 'Use this code to get ₹100 off on your first order',
      'discount': '₹100 OFF',
      'minOrder': '₹500',
      'validity': 'Valid till 31 Dec 2024',
      'terms': ['Valid on first order only', 'Minimum order value ₹500', 'Not applicable with other offers'],
    },
    {
      'code': 'SAVE200',
      'title': '₹200 off on orders above ₹1000',
      'description': 'Save big on orders above ₹1000',
      'discount': '₹200 OFF',
      'minOrder': '₹1000',
      'validity': 'Valid till 31 Dec 2024',
      'terms': ['Minimum order value ₹1000', 'Valid on all products', 'Can be used once per user'],
    },
    {
      'code': 'FESTIVE15',
      'title': '15% off up to ₹300',
      'description': 'Festive season special discount',
      'discount': '15% OFF',
      'minOrder': '₹999',
      'validity': 'Valid till 31 Dec 2024',
      'terms': ['Maximum discount ₹300', 'Valid on all products', 'Limited time offer'],
    },
    {
      'code': 'GOLD50',
      'title': '₹50 off for Gold members',
      'description': 'Exclusive discount for Millance Gold members',
      'discount': '₹50 OFF',
      'minOrder': '₹300',
      'validity': 'Valid till 31 Dec 2024',
      'terms': ['Valid for Gold members only', 'Minimum order value ₹300', 'Can be used multiple times'],
    },
  ];

  final List<Map<String, dynamic>> usedCoupons = [
    {
      'code': 'WELCOME50',
      'title': '₹50 off on first order',
      'usedOn': '15 Dec 2024',
      'savedAmount': '₹50',
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Coupons'),
        backgroundColor: Colors.white,
        elevation: 1,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.primaryOrange,
          labelColor: AppColors.primaryOrange,
          unselectedLabelColor: AppColors.textGray,
          labelStyle: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
          tabs: [
            Tab(text: 'Available (${availableCoupons.length})'),
            Tab(text: 'Used (${usedCoupons.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildAvailableCoupons(),
          _buildUsedCoupons(),
        ],
      ),
    );
  }

  Widget _buildAvailableCoupons() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: availableCoupons.length,
      itemBuilder: (context, index) {
        return FadeInUp(
          duration: Duration(milliseconds: 300 + (index * 100)),
          child: _buildCouponCard(availableCoupons[index], false),
        );
      },
    );
  }

  Widget _buildUsedCoupons() {
    if (usedCoupons.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(40),
              decoration: BoxDecoration(
                color: AppColors.lightGray,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.local_offer_outlined,
                size: 80,
                color: AppColors.textGray,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No coupons used yet',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Start shopping to use coupons',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textGray,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: usedCoupons.length,
      itemBuilder: (context, index) {
        return FadeInUp(
          duration: Duration(milliseconds: 300 + (index * 100)),
          child: _buildUsedCouponCard(usedCoupons[index]),
        );
      },
    );
  }

  Widget _buildCouponCard(Map<String, dynamic> coupon, bool isUsed) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.primaryOrange.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Coupon Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.primaryOrange.withOpacity(0.1),
                  AppColors.primaryPink.withOpacity(0.1),
                ],
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: AppColors.orangePinkGradient,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.local_offer,
                    color: Colors.white,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        coupon['discount'],
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryOrange,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        coupon['title'],
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Coupon Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  coupon['description'],
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textGray,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _buildInfoChip(Icons.shopping_cart, 'Min: ${coupon['minOrder']}'),
                    const SizedBox(width: 12),
                    _buildInfoChip(Icons.calendar_today, coupon['validity']),
                  ],
                ),
                const SizedBox(height: 16),

                // Coupon Code
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.lightGray,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: AppColors.border,
                            style: BorderStyle.solid,
                          ),
                        ),
                        child: Text(
                          coupon['code'],
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: coupon['code']));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Coupon code copied!'),
                            duration: Duration(seconds: 2),
                            backgroundColor: Colors.green,
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryOrange,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Copy',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Terms Button
                TextButton(
                  onPressed: () {
                    _showTermsDialog(coupon);
                  },
                  child: const Text(
                    'View Terms & Conditions',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.primaryOrange,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUsedCouponCard(Map<String, dynamic> coupon) {
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
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 28,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  coupon['code'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  coupon['title'],
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textGray,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(
                      Icons.calendar_today,
                      size: 12,
                      color: AppColors.textGray,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Used on ${coupon['usedOn']}',
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
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                coupon['savedAmount'],
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.green,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Saved',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.green,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.lightGray,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.textGray),
          const SizedBox(width: 4),
          Text(
            text,
            style: const TextStyle(
              fontSize: 11,
              color: AppColors.textGray,
            ),
          ),
        ],
      ),
    );
  }

  void _showTermsDialog(Map<String, dynamic> coupon) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Terms & Conditions'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                coupon['code'],
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryOrange,
                ),
              ),
              const SizedBox(height: 16),
              ...List.generate(
                coupon['terms'].length,
                (index) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('• ', style: TextStyle(fontSize: 14)),
                      Expanded(
                        child: Text(
                          coupon['terms'][index],
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
