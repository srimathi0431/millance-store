import 'package:flutter/material.dart';
import '../../config/app_colors.dart';

class PrivacyPolicyScreen extends StatelessWidget {
  const PrivacyPolicyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Privacy Policy'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Privacy Policy',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Last updated: ${DateTime.now().year}',
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            
            _buildSection(
              'Introduction',
              'Millance Store ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.',
            ),
            
            _buildSection(
              '1. Information We Collect',
              'Personal Information:\n• Name, email address, phone number\n• Delivery address\n• Date of birth and gender (optional)\n• Profile picture (optional)\n\nFinancial Information:\n• Wallet balances and transaction history\n• Order history and payment details\n• Affiliate earnings and referral data\n\nDevice Information:\n• Device type and operating system\n• Unique device identifiers\n• Mobile network information\n• IP address and location data',
            ),
            
            _buildSection(
              '2. How We Use Your Information',
              'We use the information we collect to:\n• Process your orders and deliver products\n• Manage your wallet and process payments\n• Administer the affiliate program\n• Send order confirmations and updates\n• Provide customer support\n• Improve our app and services\n• Detect and prevent fraud\n• Comply with legal obligations',
            ),
            
            _buildSection(
              '3. Information Sharing',
              'We do not sell your personal information. We may share your information with:\n\nService Providers:\n• Payment processors\n• Delivery partners\n• Cloud hosting providers\n• Analytics services\n\nLegal Requirements:\n• When required by law\n• To protect our rights and safety\n• In connection with legal proceedings\n\nBusiness Transfers:\n• In case of merger, acquisition, or sale',
            ),
            
            _buildSection(
              '4. Data Security',
              'We implement appropriate security measures to protect your information:\n• Encryption of sensitive data\n• Secure MPIN for wallet access\n• Regular security audits\n• Access controls and authentication\n\nHowever, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
            ),
            
            _buildSection(
              '5. Your Rights',
              'You have the right to:\n• Access your personal information\n• Update or correct your data\n• Delete your account\n• Object to data processing\n• Export your data\n• Withdraw consent\n\nTo exercise these rights, please contact us at support@millance.store',
            ),
            
            _buildSection(
              '6. Cookies and Tracking',
              'We use cookies and similar tracking technologies to:\n• Remember your preferences\n• Analyze app usage\n• Improve user experience\n• Provide personalized content\n\nYou can control cookies through your device settings.',
            ),
            
            _buildSection(
              '7. Children\'s Privacy',
              'Our app is not intended for children under 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.',
            ),
            
            _buildSection(
              '8. Third-Party Links',
              'Our app may contain links to third-party websites or services. We are not responsible for their privacy practices. We encourage you to read their privacy policies.',
            ),
            
            _buildSection(
              '9. Data Retention',
              'We retain your information for as long as necessary to:\n• Provide our services\n• Comply with legal obligations\n• Resolve disputes\n• Enforce our agreements\n\nYou can request deletion of your account at any time.',
            ),
            
            _buildSection(
              '10. International Data Transfers',
              'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data.',
            ),
            
            _buildSection(
              '11. Marketing Communications',
              'We may send you promotional emails and notifications about:\n• New products and offers\n• Affiliate program updates\n• Special events and discounts\n\nYou can opt-out of marketing communications through app settings or by contacting us.',
            ),
            
            _buildSection(
              '12. Changes to Privacy Policy',
              'We may update this Privacy Policy from time to time. We will notify you of significant changes through:\n• In-app notifications\n• Email notifications\n• Update to "Last updated" date\n\nContinued use of the app constitutes acceptance of changes.',
            ),
            
            _buildSection(
              '13. Contact Us',
              'If you have questions about this Privacy Policy, please contact us:\n\n• Email: privacy@millance.store\n• Phone: +91 XXXXXXXXXX\n• Address: [Your Business Address]\n\nData Protection Officer:\nEmail: dpo@millance.store',
            ),
            
            const SizedBox(height: 24),
            
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.lightBlue.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.oceanBlue.withOpacity(0.3),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(
                        Icons.security,
                        color: AppColors.oceanBlue,
                      ),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Your Privacy Matters',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'We are committed to protecting your personal information and respecting your privacy rights. Your data is encrypted and stored securely.',
                    style: TextStyle(
                      fontSize: 13,
                      color: AppColors.textPrimary,
                      height: 1.5,
                    ),
                  ),
                ],
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
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
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
}
