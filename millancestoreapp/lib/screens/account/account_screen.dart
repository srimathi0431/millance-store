import 'package:flutter/material.dart';
import '../../theme/app_colors.dart';
import '../orders/orders_screen.dart';
import '../wishlist/wishlist_screen.dart';
import 'addresses_screen.dart';
import '../membership/membership_screen.dart';
import '../auth/login_screen.dart';
import '../coupons/coupons_screen.dart';
import 'profile_edit_screen.dart';
import '../help/help_support_screen.dart';
import '../reviews/my_reviews_screen.dart';
import '../static/about_screen.dart';
import '../static/terms_screen.dart';
import '../static/privacy_screen.dart';
import '../settings/payment_methods_screen.dart';
import '../settings/notification_settings_screen.dart';
import '../settings/language_screen.dart';

class AccountScreen extends StatelessWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Profile Header
          SliverAppBar(
            expandedHeight: 150,
            pinned: true,
            actions: [
              IconButton(
                icon: const Icon(Icons.edit, color: Colors.white),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ProfileEditScreen(),
                    ),
                  );
                },
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppColors.primaryGradient,
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Row(
                      children: [
                        Container(
                          width: 70,
                          height: 70,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 3),
                          ),
                          child: const Icon(
                            Icons.person,
                            size: 40,
                            color: AppColors.primaryOrange,
                          ),
                        ),
                        const SizedBox(width: 16),
                        const Expanded(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Guest User',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Login to access your account',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            backgroundColor: Colors.transparent,
            elevation: 0,
          ),
          
          // Menu Items
          SliverToBoxAdapter(
            child: Column(
              children: [
                const SizedBox(height: 8),
                
                // Orders Section
                Container(
                  color: Colors.white,
                  child: Column(
                    children: [
                      _buildMenuItem(
                        Icons.shopping_bag_outlined,
                        'My Orders',
                        'Check your order status',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const OrdersScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.favorite_border,
                        'My Wishlist',
                        'Your saved products',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const WishlistScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.star_border,
                        'My Reviews & Ratings',
                        'Review your purchases',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const MyReviewsScreen(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Rewards Section
                Container(
                  color: Colors.white,
                  child: Column(
                    children: [
                      _buildMenuItem(
                        Icons.card_giftcard,
                        'My Coupons',
                        'View available coupons',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const CouponsScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.workspace_premium,
                        'Millance Gold Vault',
                        'Exclusive membership benefits',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const MembershipScreen(),
                            ),
                          );
                        },
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            gradient: AppColors.orangePinkGradient,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'Upgrade',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Account Settings
                Container(
                  color: Colors.white,
                  child: Column(
                    children: [
                      _buildMenuItem(
                        Icons.location_on_outlined,
                        'Saved Addresses',
                        'Manage your addresses',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const AddressesScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.payment,
                        'Payment Methods',
                        'Saved cards & UPI',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const PaymentMethodsScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.notifications_outlined,
                        'Notifications',
                        'Manage notifications',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const NotificationSettingsScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.language,
                        'Language',
                        'English',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const LanguageScreen(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 8),
                
                // Help & Support
                Container(
                  color: Colors.white,
                  child: Column(
                    children: [
                      _buildMenuItem(
                        Icons.help_outline,
                        'Help Center',
                        'FAQs and support',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const HelpSupportScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.info_outline,
                        'About Us',
                        'Know more about Millance',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const AboutScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.description_outlined,
                        'Terms & Conditions',
                        'Read our policies',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const TermsScreen(),
                            ),
                          );
                        },
                      ),
                      _buildDivider(),
                      _buildMenuItem(
                        Icons.privacy_tip_outlined,
                        'Privacy Policy',
                        'Your data is safe',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const PrivacyScreen(),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Login/Logout Button
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const LoginScreen(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryOrange,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        'Login / Sign Up',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Version Info
                const Center(
                  child: Text(
                    'Version 1.0.0',
                    style: TextStyle(
                      color: AppColors.textGray,
                      fontSize: 12,
                    ),
                  ),
                ),
                
                const SizedBox(height: 80),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem(
    IconData icon,
    String title,
    String subtitle, {
    required VoidCallback onTap,
    Widget? trailing,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.lightGray,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          color: AppColors.primaryOrange,
          size: 24,
        ),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(
          fontSize: 13,
          color: AppColors.textGray,
        ),
      ),
      trailing: trailing ??
          const Icon(
            Icons.chevron_right,
            color: AppColors.textGray,
          ),
    );
  }

  Widget _buildDivider() {
    return const Divider(
      height: 1,
      indent: 72,
      endIndent: 16,
    );
  }
}
