import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';
import 'order_confirmation_screen.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  String selectedPaymentMethod = 'upi';

  final List<Map<String, dynamic>> paymentMethods = [
    {
      'id': 'upi',
      'title': 'UPI',
      'subtitle': 'Pay via Google Pay, PhonePe, Paytm & more',
      'icon': Icons.payment,
    },
    {
      'id': 'card',
      'title': 'Credit / Debit Card',
      'subtitle': 'Visa, Mastercard, RuPay & more',
      'icon': Icons.credit_card,
    },
    {
      'id': 'netbanking',
      'title': 'Net Banking',
      'subtitle': 'All major banks supported',
      'icon': Icons.account_balance,
    },
    {
      'id': 'wallet',
      'title': 'Wallets',
      'subtitle': 'Paytm, PhonePe, Amazon Pay & more',
      'icon': Icons.account_balance_wallet,
    },
    {
      'id': 'cod',
      'title': 'Cash on Delivery',
      'subtitle': 'Pay when you receive',
      'icon': Icons.money,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Payment'),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: Column(
        children: [
          // Order Summary Banner
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Order Total',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textGray,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      '₹4,999',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text('View Details'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Payment Methods
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: paymentMethods.length,
              itemBuilder: (context, index) {
                return FadeInUp(
                  duration: Duration(milliseconds: 300 + (index * 100)),
                  child: _buildPaymentMethodCard(paymentMethods[index]),
                );
              },
            ),
          ),

          // Pay Now Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 8,
                  offset: Offset(0, -2),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Amount Payable',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.textGray,
                      ),
                    ),
                    const Text(
                      '₹4,999',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      _processPayment();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryOrange,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Pay Now',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethodCard(Map<String, dynamic> method) {
    final isSelected = selectedPaymentMethod == method['id'];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? AppColors.primaryOrange : AppColors.border,
          width: isSelected ? 2 : 1,
        ),
      ),
      child: RadioListTile<String>(
        value: method['id'],
        groupValue: selectedPaymentMethod,
        onChanged: (value) {
          setState(() {
            selectedPaymentMethod = value!;
          });
        },
        activeColor: AppColors.primaryOrange,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.lightGray,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                method['icon'],
                color: AppColors.primaryOrange,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    method['title'],
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    method['subtitle'],
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textGray,
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

  void _processPayment() {
    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(
          color: AppColors.primaryOrange,
        ),
      ),
    );

    // Simulate payment processing
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.pop(context); // Close loading
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => const OrderConfirmationScreen(),
        ),
      );
    });
  }
}
