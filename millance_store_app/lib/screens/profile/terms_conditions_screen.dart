import 'package:flutter/material.dart';
import '../../config/app_colors.dart';

class TermsConditionsScreen extends StatelessWidget {
  const TermsConditionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Terms & Conditions'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Terms & Conditions',
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
              'Welcome to Millance Store',
              'These terms and conditions outline the rules and regulations for the use of Millance Store\'s mobile application and services. By accessing this app, we assume you accept these terms and conditions. Do not continue to use Millance Store if you do not agree to all of the terms and conditions stated on this page.',
            ),
            
            _buildSection(
              '1. User Account',
              'When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.\n\nYou are responsible for safeguarding the password and MPIN that you use to access the service and for any activities or actions under your account.',
            ),
            
            _buildSection(
              '2. Shopping & Orders',
              'All orders placed through our app are subject to product availability and acceptance. We reserve the right to refuse or cancel any order for any reason.\n\nPrices for products are subject to change without notice. We reserve the right to modify or discontinue any product without notice.',
            ),
            
            _buildSection(
              '3. Wallet & Payments',
              'Your Millance Store Wallet can be used to make purchases within the app. Wallet funds are non-refundable and cannot be transferred to external accounts.\n\nIncome Wallet contains your affiliate earnings and can be withdrawn as per our withdrawal policy.\n\nPromo Cash is promotional credit that can only be used for purchases and has an expiry date.',
            ),
            
            _buildSection(
              '4. Affiliate Program',
              'By participating in our affiliate program, you agree to:\n• Promote Millance Store in a professional manner\n• Not engage in spam or misleading practices\n• Comply with all applicable laws and regulations\n\nWe reserve the right to suspend or terminate affiliate accounts that violate our policies.',
            ),
            
            _buildSection(
              '5. Millance Pay',
              'Millance Pay allows you to make QR code-based payments to other users. All transactions are final and cannot be reversed except in cases of technical errors verified by our support team.\n\nYou must ensure sufficient balance and verify recipient details before making payments.',
            ),
            
            _buildSection(
              '6. Intellectual Property',
              'The app and its original content, features, and functionality are owned by Millance Store and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.',
            ),
            
            _buildSection(
              '7. Prohibited Uses',
              'You may not use our app:\n• For any unlawful purpose\n• To solicit others to perform unlawful acts\n• To violate any regulations or laws\n• To infringe upon intellectual property rights\n• To transmit malicious code or viruses\n• To engage in fraudulent activities',
            ),
            
            _buildSection(
              '8. Limitation of Liability',
              'In no event shall Millance Store, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.',
            ),
            
            _buildSection(
              '9. Delivery & Returns',
              'We strive to deliver products within the estimated timeframe. However, delays may occur due to circumstances beyond our control.\n\nReturns and refunds are subject to our Return Policy. Please contact customer support for assistance.',
            ),
            
            _buildSection(
              '10. Privacy',
              'Your use of our app is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.',
            ),
            
            _buildSection(
              '11. Changes to Terms',
              'We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days\' notice prior to any new terms taking effect.',
            ),
            
            _buildSection(
              '12. Governing Law',
              'These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.',
            ),
            
            _buildSection(
              '13. Contact Us',
              'If you have any questions about these Terms, please contact us:\n• Email: support@millance.store\n• Phone: +91 XXXXXXXXXX\n• Address: [Your Business Address]',
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
              child: const Row(
                children: [
                  Icon(
                    Icons.info_outline,
                    color: AppColors.oceanBlue,
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'By using Millance Store, you acknowledge that you have read and understood these Terms & Conditions.',
                      style: TextStyle(
                        fontSize: 13,
                        color: AppColors.textPrimary,
                        height: 1.5,
                      ),
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
