import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class MembershipScreen extends StatelessWidget {
  const MembershipScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Gradient App Bar
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppColors.primaryGradient,
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      FadeInDown(
                        child: const Icon(
                          Icons.card_membership,
                          size: 60,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      FadeInUp(
                        child: const Text(
                          'MILLANCE GOLD VAULT',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Exclusive Rewards & Benefits',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          
          // Membership Tiers
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Choose Your Plan',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Silver Tier
                  FadeInLeft(
                    delay: const Duration(milliseconds: 200),
                    child: _buildMembershipCard(
                      title: 'Silver',
                      price: '₹0',
                      period: 'Forever Free',
                      color: Colors.grey.shade400,
                      benefits: [
                        '5% discount on all products',
                        'Free delivery on orders above ₹499',
                        'Early access to sales',
                        'Birthday special offers',
                      ],
                      isPopular: false,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Gold Tier
                  FadeInLeft(
                    delay: const Duration(milliseconds: 400),
                    child: _buildMembershipCard(
                      title: 'Gold',
                      price: '₹999',
                      period: 'per year',
                      color: const Color(0xFFFFD700),
                      benefits: [
                        '15% discount on all products',
                        'Free delivery on all orders',
                        'Priority customer support',
                        'Exclusive gold member deals',
                        '2x reward points',
                        'Extended return period (30 days)',
                      ],
                      isPopular: true,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Platinum Tier
                  FadeInLeft(
                    delay: const Duration(milliseconds: 600),
                    child: _buildMembershipCard(
                      title: 'Platinum',
                      price: '₹1,999',
                      period: 'per year',
                      color: const Color(0xFFE5E4E2),
                      benefits: [
                        '25% discount on all products',
                        'Free express delivery',
                        'Dedicated account manager',
                        'VIP event invitations',
                        '5x reward points',
                        'Lifetime return policy',
                        'Exclusive platinum lounge access',
                        'Personal shopping assistant',
                      ],
                      isPopular: false,
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          // Benefits Section
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: AppColors.cardShadow,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Why Join Millance Gold Vault?',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildBenefitItem(
                    Icons.local_offer,
                    'Exclusive Discounts',
                    'Save up to 25% on every purchase',
                  ),
                  _buildBenefitItem(
                    Icons.delivery_dining,
                    'Free Delivery',
                    'No delivery charges on any order',
                  ),
                  _buildBenefitItem(
                    Icons.stars,
                    'Reward Points',
                    'Earn points on every purchase',
                  ),
                  _buildBenefitItem(
                    Icons.support_agent,
                    'Priority Support',
                    '24/7 dedicated customer service',
                  ),
                  _buildBenefitItem(
                    Icons.event,
                    'Early Access',
                    'Be the first to shop new collections',
                  ),
                ],
              ),
            ),
          ),
          
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }

  Widget _buildMembershipCard({
    required String title,
    required String price,
    required String period,
    required Color color,
    required List<String> benefits,
    required bool isPopular,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: isPopular
            ? Border.all(color: AppColors.primaryOrange, width: 2)
            : null,
        boxShadow: isPopular ? AppColors.hoverShadow : AppColors.cardShadow,
      ),
      child: Column(
        children: [
          // Popular Badge
          if (isPopular)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                gradient: AppColors.orangePinkGradient,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(14),
                  topRight: Radius.circular(14),
                ),
              ),
              child: const Center(
                child: Text(
                  '⭐ MOST POPULAR',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                // Tier Icon
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.workspace_premium,
                    size: 40,
                    color: color,
                  ),
                ),
                const SizedBox(height: 12),
                
                // Title
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                
                // Price
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      price,
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        period,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppColors.textGray,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // Benefits
                ...benefits.map((benefit) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.check_circle,
                        color: AppColors.success,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          benefit,
                          style: const TextStyle(
                            fontSize: 14,
                            height: 1.4,
                          ),
                        ),
                      ),
                    ],
                  ),
                )),
                
                const SizedBox(height: 16),
                
                // CTA Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isPopular
                          ? AppColors.primaryOrange
                          : AppColors.textGray,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      price == '₹0' ? 'Current Plan' : 'Upgrade Now',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
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

  Widget _buildBenefitItem(IconData icon, String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: AppColors.orangePinkGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 13,
                    color: AppColors.textGray,
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
