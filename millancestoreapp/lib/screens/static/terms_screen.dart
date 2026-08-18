import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class TermsScreen extends StatelessWidget {
  const TermsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms & Conditions'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textDark,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header Banner
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
                      Icons.description,
                      size: 60,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Terms & Conditions',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Last updated: August 3, 2026',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  FadeInUp(
                    delay: const Duration(milliseconds: 100),
                    child: _buildSection(
                      '1. Acceptance of Terms',
                      'By accessing and using Millance Store, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 200),
                    child: _buildSection(
                      '2. Use of Service',
                      'You must be at least 18 years old to use Millance Store. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 300),
                    child: _buildSection(
                      '3. Product Information',
                      'We strive to provide accurate product information. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. Colors may vary due to screen settings.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 400),
                    child: _buildSection(
                      '4. Pricing and Payment',
                      'All prices are in Indian Rupees (₹) and are inclusive of applicable taxes. We reserve the right to change prices at any time. Payment must be made in full before order processing. We accept various payment methods including UPI, cards, net banking, and COD.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 500),
                    child: _buildSection(
                      '5. Shipping and Delivery',
                      'We deliver across India. Delivery times vary by location and product availability. Standard delivery takes 5-7 business days. Express delivery options are available at checkout. Delivery charges apply based on order value and location.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 600),
                    child: _buildSection(
                      '6. Returns and Refunds',
                      'Most items can be returned within 7 days of delivery. Items must be unused, with original tags and packaging. Certain items like intimate wear, beauty products, and custom jewelry are non-returnable. Refunds are processed within 5-7 business days.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 700),
                    child: _buildSection(
                      '7. Promo Cash & Offers',
                      'Promo cash is non-withdrawable and can only be used for purchases. Offers are subject to terms and conditions. Promo cash expires after 1 year of inactivity. Cannot be combined with certain offers.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 800),
                    child: _buildSection(
                      '8. Intellectual Property',
                      'All content on Millance Store, including images, text, logos, and graphics, is the property of Millance and protected by copyright laws. You may not reproduce, distribute, or create derivative works without permission.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 900),
                    child: _buildSection(
                      '9. User Conduct',
                      'You agree not to use our service for any unlawful purpose or to violate any laws. You will not post false reviews, engage in fraudulent activity, or interfere with other users\' experience.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 1000),
                    child: _buildSection(
                      '10. Limitation of Liability',
                      'Millance shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability is limited to the amount you paid for the product.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 1100),
                    child: _buildSection(
                      '11. Changes to Terms',
                      'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 1200),
                    child: _buildSection(
                      '12. Contact Information',
                      'For questions about these Terms & Conditions, please contact us:\n\nEmail: support@millance.com\nPhone: +91 8000000000\nAddress: Millance Store, Bangalore, India',
                    ),
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Agreement Notice
                  FadeInUp(
                    delay: const Duration(milliseconds: 1300),
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
                              'By using Millance Store, you agree to these terms and conditions.',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppColors.textDark,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textGray,
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }
}
