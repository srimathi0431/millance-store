import 'package:flutter/material.dart';
import '../../config/app_colors.dart';

class AboutUsScreen extends StatelessWidget {
  const AboutUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('About Us'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Logo Section
            Center(
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: AppColors.forestGreen,
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    'M',
                    style: TextStyle(
                      fontSize: 64,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            const Center(
              child: Text(
                'Millance Store',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            
            const SizedBox(height: 8),
            
            const Center(
              child: Text(
                'Your Trusted Shopping Partner',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            
            const SizedBox(height: 32),
            
            _buildSection(
              'Our Story',
              'Millance Store was founded with a vision to revolutionize online shopping by combining quality products, competitive prices, and a rewarding affiliate program. We believe in creating value not just for our customers, but also for those who help us grow.',
            ),
            
            _buildSection(
              'Our Mission',
              'To provide a seamless shopping experience while empowering our community through our affiliate program. We strive to offer high-quality products at fair prices while building lasting relationships with our customers.',
            ),
            
            _buildSection(
              'What We Offer',
              '🛍️ Wide Range of Products\nFrom electronics to fashion, home essentials to beauty products, we offer a diverse selection to meet all your needs.\n\n💰 Millance Pay\nOur innovative payment system allows instant transfers between users, making transactions quick and secure.\n\n🤝 Affiliate Program\nEarn while you shop and share! Our unique multi-level affiliate program rewards you for growing our community.\n\n💳 Digital Wallet\nManage your shopping wallet, income wallet, and promo cash all in one place with our secure digital wallet system.',
            ),
            
            _buildSection(
              'Why Choose Us?',
              '✓ Quality Assurance: All products are carefully selected and verified\n✓ Secure Payments: Bank-grade security for all transactions\n✓ Fast Delivery: Quick and reliable delivery across India\n✓ 24/7 Support: Our customer support team is always here to help\n✓ Best Prices: Competitive pricing with regular discounts\n✓ Easy Returns: Hassle-free return and refund policy',
            ),
            
            _buildSection(
              'Our Values',
              'Trust: Building trust through transparency and reliability\n\nQuality: Never compromising on product quality\n\nInnovation: Constantly improving our technology and services\n\nCommunity: Growing together as a community of shoppers and entrepreneurs\n\nIntegrity: Conducting business with honesty and ethics',
            ),
            
            const SizedBox(height: 24),
            
            // Statistics Cards
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('10K+', 'Active Users', Icons.people),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('5K+', 'Products', Icons.inventory),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('99%', 'Satisfaction', Icons.star),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard('24/7', 'Support', Icons.support_agent),
                ),
              ],
            ),
            
            const SizedBox(height: 32),
            
            // Contact Section
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.forestGreen,
                    AppColors.forestGreen.withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Get in Touch',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildContactRow(Icons.email, 'support@millance.store'),
                  const SizedBox(height: 12),
                  _buildContactRow(Icons.phone, '+91 XXXXXXXXXX'),
                  const SizedBox(height: 12),
                  _buildContactRow(Icons.language, 'www.millance.store'),
                  const SizedBox(height: 12),
                  _buildContactRow(Icons.location_on, '[Your Business Address]'),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Social Media
            const Center(
              child: Text(
                'Follow Us',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            
            const SizedBox(height: 16),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildSocialIcon(Icons.facebook, AppColors.oceanBlue),
                const SizedBox(width: 16),
                _buildSocialIcon(Icons.camera_alt, AppColors.millancePurple),
                const SizedBox(width: 16),
                _buildSocialIcon(Icons.send, AppColors.lightBlue),
                const SizedBox(width: 16),
                _buildSocialIcon(Icons.play_arrow, AppColors.error),
              ],
            ),
            
            const SizedBox(height: 32),
            
            Center(
              child: Text(
                '© ${DateTime.now().year} Millance Store. All rights reserved.',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            
            const SizedBox(height: 16),
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
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textPrimary,
              height: 1.6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String value, String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
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
          Icon(icon, color: AppColors.forestGreen, size: 32),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: Colors.white, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.white,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSocialIcon(IconData icon, Color color) {
    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 24),
    );
  }
}
