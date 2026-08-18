import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About Us'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textDark,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header Banner with Logo
            FadeIn(
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                ),
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.store,
                        size: 60,
                        color: AppColors.primaryOrange,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Millance Store',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Your Trusted Shopping Partner',
                      style: TextStyle(
                        fontSize: 16,
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
                  // Our Story
                  FadeInUp(
                    delay: const Duration(milliseconds: 100),
                    child: _buildSection(
                      Icons.auto_stories,
                      'Our Story',
                      'Millance Store was founded in 2020 with a vision to revolutionize online shopping in India. We started as a small team passionate about bringing quality products to customers at the best prices. Today, we serve millions of customers across India, offering a wide range of products from fashion to electronics, home essentials to beauty products.',
                    ),
                  ),

                  // Our Mission
                  FadeInUp(
                    delay: const Duration(milliseconds: 200),
                    child: _buildSection(
                      Icons.flag,
                      'Our Mission',
                      'To provide a seamless, trustworthy, and delightful shopping experience for every Indian household. We believe in quality, affordability, and customer satisfaction above all else.',
                    ),
                  ),

                  // What We Offer
                  FadeInUp(
                    delay: const Duration(milliseconds: 300),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionTitle(Icons.shopping_bag, 'What We Offer'),
                        const SizedBox(height: 12),
                        _buildFeatureCard(
                          'Wide Range of Products',
                          '80+ categories with millions of products',
                          Icons.category,
                          Colors.blue,
                        ),
                        _buildFeatureCard(
                          'Best Prices',
                          'Competitive pricing with regular offers',
                          Icons.local_offer,
                          Colors.orange,
                        ),
                        _buildFeatureCard(
                          'Fast Delivery',
                          'Quick and reliable delivery across India',
                          Icons.local_shipping,
                          Colors.green,
                        ),
                        _buildFeatureCard(
                          'Secure Payments',
                          'Multiple payment options, all secure',
                          Icons.payment,
                          Colors.purple,
                        ),
                        _buildFeatureCard(
                          'Easy Returns',
                          '7-day return policy on most products',
                          Icons.keyboard_return,
                          Colors.red,
                        ),
                        _buildFeatureCard(
                          '24/7 Support',
                          'Always here to help you',
                          Icons.support_agent,
                          Colors.teal,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Our Values
                  FadeInUp(
                    delay: const Duration(milliseconds: 400),
                    child: _buildSection(
                      Icons.favorite,
                      'Our Values',
                      '• Customer First: Your satisfaction is our priority\n• Quality Assured: Only genuine products\n• Trust & Transparency: Honest pricing and policies\n• Innovation: Constantly improving our platform\n• Sustainability: Responsible business practices',
                    ),
                  ),

                  // Statistics
                  FadeInUp(
                    delay: const Duration(milliseconds: 500),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionTitle(Icons.analytics, 'Our Impact'),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatCard('10M+', 'Happy Customers'),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _buildStatCard('50M+', 'Products Sold'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: _buildStatCard('500+', 'Cities Covered'),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: _buildStatCard('4.5★', 'Average Rating'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Contact Section
                  FadeInUp(
                    delay: const Duration(milliseconds: 600),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            AppColors.primaryOrange.withOpacity(0.1),
                            AppColors.primaryPink.withOpacity(0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppColors.primaryOrange.withOpacity(0.3),
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.contact_support,
                            size: 48,
                            color: AppColors.primaryOrange,
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Get in Touch',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textDark,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildContactItem(Icons.email, 'support@millance.com'),
                          _buildContactItem(Icons.phone, '+91 8000000000'),
                          _buildContactItem(
                            Icons.location_on,
                            'Bangalore, Karnataka, India',
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildSocialIcon(Icons.facebook, Colors.blue),
                              _buildSocialIcon(
                                Icons.camera_alt,
                                Colors.pink,
                              ),
                              _buildSocialIcon(Icons.link, Colors.blue),
                              _buildSocialIcon(
                                Icons.play_arrow,
                                Colors.red,
                              ),
                            ],
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

  Widget _buildSection(IconData icon, String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionTitle(icon, title),
          const SizedBox(height: 12),
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

  Widget _buildSectionTitle(IconData icon, String title) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureCard(
    String title,
    String subtitle,
    IconData icon,
    Color color,
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
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
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
        ],
      ),
    );
  }

  Widget _buildStatCard(String number, String label) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            number,
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 13,
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primaryOrange, size: 20),
          const SizedBox(width: 12),
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

  Widget _buildSocialIcon(IconData icon, Color color) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(icon, color: color, size: 20),
    );
  }
}
