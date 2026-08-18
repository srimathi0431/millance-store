import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() =>
      _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState
    extends State<NotificationSettingsScreen> {
  bool _orderUpdates = true;
  bool _offers = true;
  bool _priceDrops = true;
  bool _newArrivals = false;
  bool _membership = true;
  bool _emailNotif = true;
  bool _smsNotif = false;
  bool _pushNotif = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notification Settings'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textDark,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header
            FadeIn(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.notifications_active,
                      size: 60,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Manage Notifications',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Choose what you want to hear about',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Notification Types
                  FadeInUp(
                    delay: const Duration(milliseconds: 100),
                    child: const Text(
                      'Notification Types',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 200),
                    child: _buildSwitchTile(
                      'Order Updates',
                      'Get updates about your orders',
                      Icons.local_shipping,
                      Colors.blue,
                      _orderUpdates,
                      (value) => setState(() => _orderUpdates = value),
                    ),
                  ),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 300),
                    child: _buildSwitchTile(
                      'Offers & Discounts',
                      'Never miss a great deal',
                      Icons.local_offer,
                      Colors.orange,
                      _offers,
                      (value) => setState(() => _offers = value),
                    ),
                  ),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 400),
                    child: _buildSwitchTile(
                      'Price Drops',
                      'Wishlist items on sale',
                      Icons.trending_down,
                      Colors.green,
                      _priceDrops,
                      (value) => setState(() => _priceDrops = value),
                    ),
                  ),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 500),
                    child: _buildSwitchTile(
                      'New Arrivals',
                      'Latest products in your categories',
                      Icons.new_releases,
                      Colors.purple,
                      _newArrivals,
                      (value) => setState(() => _newArrivals = value),
                    ),
                  ),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 600),
                    child: _buildSwitchTile(
                      'Membership Updates',
                      'Exclusive member benefits',
                      Icons.card_membership,
                      Colors.pink,
                      _membership,
                      (value) => setState(() => _membership = value),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Delivery Methods
                  FadeInUp(
                    delay: const Duration(milliseconds: 700),
                    child: const Text(
                      'Delivery Methods',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 800),
                    child: _buildSwitchTile(
                      'Push Notifications',
                      'Instant alerts on your device',
                      Icons.phone_android,
                      Colors.blue,
                      _pushNotif,
                      (value) => setState(() => _pushNotif = value),
                    ),
                  ),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 900),
                    child: _buildSwitchTile(
                      'Email Notifications',
                      'Updates via email',
                      Icons.email,
                      Colors.red,
                      _emailNotif,
                      (value) => setState(() => _emailNotif = value),
                    ),
                  ),
                  
                  FadeInUp(
                    delay: const Duration(milliseconds: 1000),
                    child: _buildSwitchTile(
                      'SMS Notifications',
                      'Text message alerts',
                      Icons.sms,
                      Colors.green,
                      _smsNotif,
                      (value) => setState(() => _smsNotif = value),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Info Box
                  FadeInUp(
                    delay: const Duration(milliseconds: 1100),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.primaryOrange.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppColors.primaryOrange.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: AppColors.primaryOrange,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Important order updates and security alerts cannot be turned off.',
                              style: TextStyle(
                                fontSize: 13,
                                color: AppColors.textDark,
                              ),
                            ),
                          ),
                        ],
                      ),
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

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    IconData icon,
    Color color,
    bool value,
    Function(bool) onChanged,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 4),
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
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppColors.primaryOrange,
          ),
        ],
      ),
    );
  }
}
