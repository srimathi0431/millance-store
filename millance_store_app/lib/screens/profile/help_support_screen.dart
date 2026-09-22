import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_colors.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  Future<void> _launchEmail() async {
    final Uri emailUri = Uri(
      scheme: 'mailto',
      path: 'support@millance.store',
      query: 'subject=Help Request',
    );
    if (await canLaunchUrl(emailUri)) {
      await launchUrl(emailUri);
    }
  }

  Future<void> _launchPhone() async {
    final Uri phoneUri = Uri(
      scheme: 'tel',
      path: '+91XXXXXXXXXX',
    );
    if (await canLaunchUrl(phoneUri)) {
      await launchUrl(phoneUri);
    }
  }

  Future<void> _launchWhatsApp() async {
    final Uri whatsappUri = Uri.parse('https://wa.me/91XXXXXXXXXX');
    if (await canLaunchUrl(whatsappUri)) {
      await launchUrl(whatsappUri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Help & Support'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.forestGreen,
                    AppColors.forestGreen.withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                children: [
                  Icon(Icons.support_agent, color: Colors.white, size: 48),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'We\'re Here to Help!',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Get assistance anytime, anywhere',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Contact Methods
            const Text(
              'Contact Us',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            
            const SizedBox(height: 16),
            
            _buildContactCard(
              icon: Icons.email,
              title: 'Email Support',
              subtitle: 'support@millance.store',
              description: 'Response within 24 hours',
              color: AppColors.oceanBlue,
              onTap: _launchEmail,
            ),
            
            _buildContactCard(
              icon: Icons.phone,
              title: 'Call Us',
              subtitle: '+91 XXXXXXXXXX',
              description: 'Mon-Sat, 9 AM - 6 PM',
              color: AppColors.forestGreen,
              onTap: _launchPhone,
            ),
            
            _buildContactCard(
              icon: Icons.chat,
              title: 'WhatsApp',
              subtitle: 'Chat with us',
              description: 'Quick response',
              color: Colors.green,
              onTap: _launchWhatsApp,
            ),
            
            const SizedBox(height: 32),
            
            // FAQs Section
            const Text(
              'Frequently Asked Questions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            
            const SizedBox(height: 16),
            
            _buildFAQSection('Orders & Delivery', [
              {
                'question': 'How can I track my order?',
                'answer': 'Go to Orders tab → Select your order → View tracking details'
              },
              {
                'question': 'What is the delivery time?',
                'answer': 'Delivery typically takes 3-7 business days depending on your location.'
              },
              {
                'question': 'Can I change my delivery address?',
                'answer': 'Yes, you can change the address before the order is dispatched. Contact support immediately.'
              },
            ]),
            
            _buildFAQSection('Wallet & Payments', [
              {
                'question': 'How do I add money to my wallet?',
                'answer': 'Currently, wallet can be loaded through affiliate earnings, promo codes, and refunds.'
              },
              {
                'question': 'Can I withdraw money from my wallet?',
                'answer': 'Income Wallet balance can be withdrawn. Store Wallet and Promo Cash are for purchases only.'
              },
              {
                'question': 'Is Millance Pay secure?',
                'answer': 'Yes, all transactions are protected with MPIN and bank-grade encryption.'
              },
            ]),
            
            _buildFAQSection('Affiliate Program', [
              {
                'question': 'How do I earn through affiliates?',
                'answer': 'Share your referral code. When someone joins and makes purchases, you earn commissions.'
              },
              {
                'question': 'What are the commission levels?',
                'answer': 'We offer up to 5 levels of commissions. Check the Affiliate section for detailed structure.'
              },
              {
                'question': 'When do I receive my earnings?',
                'answer': 'Earnings are credited to your Income Wallet immediately after successful purchases.'
              },
            ]),
            
            _buildFAQSection('Returns & Refunds', [
              {
                'question': 'What is the return policy?',
                'answer': 'Products can be returned within 7 days if unopened and in original condition.'
              },
              {
                'question': 'How long does refund take?',
                'answer': 'Refunds are processed within 7-10 business days after we receive the returned item.'
              },
              {
                'question': 'Where will I get my refund?',
                'answer': 'Refunds are credited to your Millance Store Wallet for faster processing.'
              },
            ]),
            
            _buildFAQSection('Account & Security', [
              {
                'question': 'How do I reset my MPIN?',
                'answer': 'Go to Profile → Settings → Change MPIN. You\'ll need to verify your identity.'
              },
              {
                'question': 'Is my data secure?',
                'answer': 'Yes, we use industry-standard encryption to protect all your personal and financial data.'
              },
              {
                'question': 'Can I delete my account?',
                'answer': 'Yes, contact support to request account deletion. Note that this action is permanent.'
              },
            ]),
            
            const SizedBox(height: 32),
            
            // Support Hours
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.lightBlue.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.oceanBlue.withOpacity(0.3),
                ),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.schedule, color: AppColors.oceanBlue),
                      SizedBox(width: 12),
                      Text(
                        'Support Hours',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Monday - Saturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM\n\nEmail support available 24/7',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.textPrimary,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Feedback Section
            Container(
              padding: const EdgeInsets.all(20),
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.feedback, color: AppColors.forestGreen),
                      SizedBox(width: 12),
                      Text(
                        'Share Your Feedback',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Your feedback helps us improve. Let us know about your experience!',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _launchEmail,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.forestGreen,
                      ),
                      child: const Text('Send Feedback'),
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

  Widget _buildContactCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required String description,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 28),
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
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      description,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: AppColors.textSecondary,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFAQSection(String title, List<Map<String, String>> faqs) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 12, top: 8),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        ...faqs.map((faq) => _buildFAQItem(
          faq['question']!,
          faq['answer']!,
        )),
        const SizedBox(height: 8),
      ],
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Theme(
        data: ThemeData(dividerColor: Colors.transparent),
        child: ExpansionTile(
          title: Text(
            question,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Text(
                answer,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
