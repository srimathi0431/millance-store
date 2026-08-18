import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../theme/app_colors.dart';

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({super.key});

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  int? expandedIndex;

  final List<Map<String, String>> faqs = [
    {
      'question': 'How do I track my order?',
      'answer': 'You can track your order by going to "My Orders" section in your account. Click on the order you want to track and you will see the real-time tracking status with estimated delivery date.',
    },
    {
      'question': 'What is the return policy?',
      'answer': 'We offer a 7-day return policy for most products. Items must be unused, in original packaging with all tags intact. To initiate a return, go to your order history and select "Return" option.',
    },
    {
      'question': 'How can I cancel my order?',
      'answer': 'Orders can be cancelled before they are shipped. Go to "My Orders", select the order and click on "Cancel Order". Once shipped, cancellation is not possible, but you can return the product after delivery.',
    },
    {
      'question': 'What payment methods are accepted?',
      'answer': 'We accept UPI, Credit/Debit Cards, Net Banking, Wallets (Paytm, PhonePe, Amazon Pay), and Cash on Delivery (COD) for eligible orders.',
    },
    {
      'question': 'How do I apply a coupon code?',
      'answer': 'During checkout, you will see a "Apply Coupon" section. Enter your coupon code and click "Apply". The discount will be reflected in your total amount.',
    },
    {
      'question': 'What is Millance Gold Vault membership?',
      'answer': 'Millance Gold Vault is our premium membership program offering exclusive benefits like early access to sales, special discounts, free delivery, and priority customer support. Three tiers are available: Silver (Free), Gold (₹999/year), and Platinum (₹1,999/year).',
    },
    {
      'question': 'How do I change my delivery address?',
      'answer': 'You can manage your addresses in the "Saved Addresses" section under your account. Add, edit, or delete addresses as needed. During checkout, you can select or add a new delivery address.',
    },
    {
      'question': 'Is my payment information secure?',
      'answer': 'Yes, all payment transactions are encrypted and processed through secure payment gateways. We do not store your card details on our servers.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Help & Support'),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Quick Help Cards
            FadeInDown(
              duration: const Duration(milliseconds: 400),
              child: Container(
                padding: const EdgeInsets.all(16),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Quick Help',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildQuickHelpCard(
                            'Chat with Us',
                            Icons.chat_bubble_outline,
                            Colors.blue,
                            () {
                              // Open chat
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildQuickHelpCard(
                            'Call Us',
                            Icons.phone_outlined,
                            Colors.green,
                            () async {
                              final Uri phoneUri = Uri(scheme: 'tel', path: '18001234567');
                              if (await canLaunchUrl(phoneUri)) {
                                await launchUrl(phoneUri);
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildQuickHelpCard(
                            'Email Us',
                            Icons.email_outlined,
                            Colors.orange,
                            () async {
                              final Uri emailUri = Uri(
                                scheme: 'mailto',
                                path: 'support@millancestore.com',
                                query: 'subject=Support Request',
                              );
                              if (await canLaunchUrl(emailUri)) {
                                await launchUrl(emailUri);
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildQuickHelpCard(
                            'WhatsApp',
                            Icons.chat,
                            const Color(0xFF25D366),
                            () async {
                              final Uri whatsappUri = Uri.parse('https://wa.me/919876543210');
                              if (await canLaunchUrl(whatsappUri)) {
                                await launchUrl(whatsappUri);
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),

            // FAQ Section
            FadeInUp(
              duration: const Duration(milliseconds: 500),
              child: Container(
                padding: const EdgeInsets.all(16),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Frequently Asked Questions',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ...List.generate(
                      faqs.length,
                      (index) => _buildFAQItem(index),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Other Help Options
            FadeInUp(
              duration: const Duration(milliseconds: 600),
              child: Container(
                padding: const EdgeInsets.all(16),
                color: Colors.white,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Other Resources',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildHelpOption(
                      'Order Issues',
                      'Track, cancel, or return orders',
                      Icons.shopping_bag_outlined,
                      () {},
                    ),
                    _buildHelpOption(
                      'Payment & Refunds',
                      'Payment issues, refund status',
                      Icons.payment,
                      () {},
                    ),
                    _buildHelpOption(
                      'Account & Settings',
                      'Login, profile, security',
                      Icons.person_outline,
                      () {},
                    ),
                    _buildHelpOption(
                      'Membership',
                      'Millance Gold Vault benefits',
                      Icons.workspace_premium,
                      () {},
                    ),
                    _buildHelpOption(
                      'Report a Problem',
                      'Report technical or policy issues',
                      Icons.report_problem_outlined,
                      () {},
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Support Hours
            FadeInUp(
              duration: const Duration(milliseconds: 700),
              child: Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.primaryOrange.withOpacity(0.1),
                      AppColors.primaryPink.withOpacity(0.1),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.primaryOrange.withOpacity(0.3),
                  ),
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.access_time,
                      color: AppColors.primaryOrange,
                      size: 32,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Support Hours',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Monday - Saturday: 9:00 AM - 9:00 PM\nSunday: 10:00 AM - 6:00 PM',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textGray,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Average response time: 2-4 hours',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textGray,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickHelpCard(
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: color.withOpacity(0.3),
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: color,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFAQItem(int index) {
    final faq = faqs[index];
    final isExpanded = expandedIndex == index;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          ListTile(
            onTap: () {
              setState(() {
                expandedIndex = isExpanded ? null : index;
              });
            },
            title: Text(
              faq['question']!,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            trailing: Icon(
              isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
              color: AppColors.primaryOrange,
            ),
          ),
          if (isExpanded)
            Container(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Text(
                faq['answer']!,
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textGray,
                  height: 1.5,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildHelpOption(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(vertical: 4),
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: AppColors.lightGray,
          borderRadius: BorderRadius.circular(10),
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
          fontSize: 15,
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
      trailing: const Icon(
        Icons.chevron_right,
        color: AppColors.textGray,
      ),
      onTap: onTap,
    );
  }
}
