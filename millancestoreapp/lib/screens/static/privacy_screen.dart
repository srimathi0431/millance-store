import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
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
                      Icons.privacy_tip,
                      size: 60,
                      color: Colors.white,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Privacy Policy',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Your privacy is important to us',
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
                      'Information We Collect',
                      'We collect information you provide directly to us, including:\n\n• Personal details (name, email, phone number)\n• Shipping and billing addresses\n• Payment information\n• Order history and preferences\n• Device information and browsing data\n• Location data (with permission)',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 200),
                    child: _buildSection(
                      'How We Use Your Information',
                      'We use the information we collect to:\n\n• Process and fulfill your orders\n• Send order confirmations and updates\n• Provide customer support\n• Personalize your shopping experience\n• Send promotional offers (with consent)\n• Improve our services and platform\n• Detect and prevent fraud',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 300),
                    child: _buildSection(
                      'Information Sharing',
                      'We do not sell your personal information. We may share your information with:\n\n• Delivery partners for order fulfillment\n• Payment processors for transactions\n• Service providers who assist our operations\n• Law enforcement when required by law\n• Business partners with your consent',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 400),
                    child: _buildSection(
                      'Data Security',
                      'We implement industry-standard security measures to protect your information:\n\n• SSL encryption for data transmission\n• Secure payment gateways\n• Regular security audits\n• Restricted employee access\n• Secure data storage\n\nHowever, no method is 100% secure, and we cannot guarantee absolute security.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 500),
                    child: _buildSection(
                      'Cookies and Tracking',
                      'We use cookies and similar technologies to:\n\n• Remember your preferences\n• Analyze site traffic and usage\n• Personalize content and ads\n• Improve user experience\n\nYou can control cookies through your browser settings, but this may affect functionality.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 600),
                    child: _buildSection(
                      'Your Rights',
                      'You have the right to:\n\n• Access your personal information\n• Correct inaccurate data\n• Request deletion of your data\n• Opt-out of marketing communications\n• Withdraw consent\n• Data portability\n\nContact us to exercise these rights.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 700),
                    child: _buildSection(
                      'Children\'s Privacy',
                      'Our services are not intended for children under 18. We do not knowingly collect information from children. If you believe we have collected information from a child, please contact us immediately.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 800),
                    child: _buildSection(
                      'Third-Party Links',
                      'Our app may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to read their privacy policies before providing any information.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 900),
                    child: _buildSection(
                      'Data Retention',
                      'We retain your information for as long as necessary to provide services and comply with legal obligations. When you delete your account, we will delete or anonymize your data within 30 days, except where required by law.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 1000),
                    child: _buildSection(
                      'Changes to Privacy Policy',
                      'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or app notification. Continued use after changes constitutes acceptance.',
                    ),
                  ),
                  FadeInUp(
                    delay: const Duration(milliseconds: 1100),
                    child: _buildSection(
                      'Contact Us',
                      'If you have questions about this Privacy Policy, please contact us:\n\nEmail: privacy@millance.com\nPhone: +91 8000000000\nAddress: Millance Store, Bangalore, India',
                    ),
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Security Badge
                  FadeInUp(
                    delay: const Duration(milliseconds: 1200),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: Colors.green.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.verified_user,
                            color: Colors.green,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Your data is encrypted and protected with industry-standard security.',
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
