import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_colors.dart';
import '../../providers/cart_provider.dart';
import '../../providers/auth_provider.dart';
import '../../services/api_service.dart';
import '../../config/api_config.dart';
import 'order_success_screen.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  
  String _selectedPaymentMethod = 'cod'; // cod, online, millance_store_wallet
  bool _isPlacingOrder = false;
  double _walletBalance = 0.0;

  @override
  void initState() {
    super.initState();
    _loadWalletBalance();
    _prefillShippingInfo();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  Future<void> _loadWalletBalance() async {
    try {
      final response = await ApiService.get(ApiConfig.walletBalance);
      if (response['success'] == true) {
        setState(() {
          _walletBalance = (response['data']['millance_store_wallet'] ?? 0).toDouble();
        });
      }
    } catch (e) {
      // Ignore error, wallet balance will remain 0
    }
  }

  void _prefillShippingInfo() {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user != null) {
      _nameController.text = user.name;
      _phoneController.text = user.phone;
    }
  }

  Future<void> _placeOrder() async {
    if (!_formKey.currentState!.validate()) return;

    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    final cart = cartProvider.cart;
    
    if (cart == null || cart.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Your cart is empty'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    // Check wallet balance if using wallet payment
    if (_selectedPaymentMethod == 'millance_store_wallet' && _walletBalance < cart.total) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Insufficient wallet balance'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isPlacingOrder = true);

    try {
      final response = await ApiService.post(
        ApiConfig.orders,
        {
          'payment_method': _selectedPaymentMethod,
          'shipping_name': _nameController.text.trim(),
          'shipping_phone': _phoneController.text.trim(),
          'shipping_address': _addressController.text.trim(),
        },
      );

      if (!mounted) return;

      if (response['success'] == true) {
        // Clear cart
        await cartProvider.loadCart();
        
        // Navigate to success screen
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (_) => OrderSuccessScreen(
              orderNumber: response['data']['order_number'] ?? '',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response['message'] ?? 'Failed to place order'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }

    setState(() => _isPlacingOrder = false);
  }

  @override
  Widget build(BuildContext context) {
    final cartProvider = Provider.of<CartProvider>(context);
    final cart = cartProvider.cart;

    if (cart == null || cart.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Checkout'),
          backgroundColor: AppColors.forestGreen,
        ),
        body: const Center(
          child: Text('Your cart is empty'),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Checkout'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Order Summary
              _buildSectionTitle('Order Summary'),
              const SizedBox(height: 12),
              _buildOrderSummary(cart),
              
              const SizedBox(height: 24),
              
              // Shipping Information
              _buildSectionTitle('Shipping Information'),
              const SizedBox(height: 12),
              _buildShippingForm(),
              
              const SizedBox(height: 24),
              
              // Payment Method
              _buildSectionTitle('Payment Method'),
              const SizedBox(height: 12),
              _buildPaymentMethods(cart.total),
              
              const SizedBox(height: 24),
              
              // Total
              _buildTotalSection(cart.total),
              
              const SizedBox(height: 24),
              
              // Place Order Button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isPlacingOrder ? null : _placeOrder,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.forestGreen,
                  ),
                  child: _isPlacingOrder
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text(
                          'Place Order',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: AppColors.textPrimary,
      ),
    );
  }

  Widget _buildOrderSummary(cart) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          ...cart.items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    '${item.productName} x${item.quantity}',
                    style: const TextStyle(fontSize: 14),
                  ),
                ),
                Text(
                  '₹${item.total.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          )),
          const Divider(),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Subtotal',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                '₹${cart.subtotal.toStringAsFixed(2)}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.forestGreen,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildShippingForm() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Full Name',
              prefixIcon: Icon(Icons.person_outline),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your name';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            decoration: const InputDecoration(
              labelText: 'Phone Number',
              prefixIcon: Icon(Icons.phone_outlined),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter phone number';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _addressController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Shipping Address',
              prefixIcon: Icon(Icons.location_on_outlined),
              alignLabelWithHint: true,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter shipping address';
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentMethods(double total) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildPaymentOption(
            value: 'cod',
            title: 'Cash on Delivery',
            subtitle: 'Pay when you receive',
            icon: Icons.local_shipping_outlined,
          ),
          const Divider(height: 1),
          _buildPaymentOption(
            value: 'online',
            title: 'Online Payment',
            subtitle: 'Pay using UPI, Cards, Net Banking',
            icon: Icons.payment_outlined,
          ),
          const Divider(height: 1),
          _buildPaymentOption(
            value: 'millance_store_wallet',
            title: 'Millance Store Wallet',
            subtitle: 'Balance: ₹${_walletBalance.toStringAsFixed(2)}',
            icon: Icons.account_balance_wallet_outlined,
            enabled: _walletBalance >= total,
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentOption({
    required String value,
    required String title,
    required String subtitle,
    required IconData icon,
    bool enabled = true,
  }) {
    return RadioListTile<String>(
      value: value,
      groupValue: _selectedPaymentMethod,
      onChanged: enabled ? (val) => setState(() => _selectedPaymentMethod = val!) : null,
      title: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: enabled ? AppColors.textPrimary : AppColors.textSecondary,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          fontSize: 14,
          color: enabled ? AppColors.textSecondary : Colors.grey[400],
        ),
      ),
      secondary: Icon(
        icon,
        color: enabled ? AppColors.forestGreen : Colors.grey[400],
      ),
      activeColor: AppColors.forestGreen,
    );
  }

  Widget _buildTotalSection(double total) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.forestGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'Total Amount',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          Text(
            '₹${total.toStringAsFixed(2)}',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.forestGreen,
            ),
          ),
        ],
      ),
    );
  }
}
