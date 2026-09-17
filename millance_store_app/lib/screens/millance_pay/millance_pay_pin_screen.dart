import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../services/millance_pay_service.dart';
import 'millance_pay_success_screen.dart';

class MillancePayPinScreen extends StatefulWidget {
  final String recipientPhone;
  final String recipientName;
  final double amount;
  final String note;

  const MillancePayPinScreen({
    super.key,
    required this.recipientPhone,
    required this.recipientName,
    required this.amount,
    required this.note,
  });

  @override
  State<MillancePayPinScreen> createState() => _MillancePayPinScreenState();
}

class _MillancePayPinScreenState extends State<MillancePayPinScreen> {
  final List<TextEditingController> _pinControllers = List.generate(
    4,
    (index) => TextEditingController(),
  );
  final List<FocusNode> _focusNodes = List.generate(4, (index) => FocusNode());
  bool _isProcessing = false;

  @override
  void dispose() {
    for (var controller in _pinControllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNodes[0].requestFocus();
    });
  }

  void _onPinChanged(int index, String value) {
    if (value.length == 1) {
      if (index < 3) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _processPayment();
      }
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
  }

  String _getEnteredPin() {
    return _pinControllers.map((c) => c.text).join();
  }

  Future<void> _processPayment() async {
    final pin = _getEnteredPin();

    if (pin.length != 4) {
      _showError('Please enter 4-digit PIN');
      return;
    }

    setState(() => _isProcessing = true);

    try {
      final response = await MillancePayService.sendMoney(
        recipientPhone: widget.recipientPhone,
        amount: widget.amount,
        pin: pin,
        note: widget.note,
      );

      if (!mounted) return;

      setState(() => _isProcessing = false);

      if (response['success'] == true) {
        final data = response['data'];
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => MillancePaySuccessScreen(
              amount: widget.amount,
              recipientName: widget.recipientName,
              recipientPhone: widget.recipientPhone,
              transactionId: data['transaction_id'],
              newBalance: data['sender_new_balance'],
            ),
          ),
        );
      } else {
        _showError(response['message'] ?? 'Payment failed');
        _clearPin();
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _isProcessing = false);
      _showError('Error: $e');
      _clearPin();
    }
  }

  void _clearPin() {
    for (var controller in _pinControllers) {
      controller.clear();
    }
    _focusNodes[0].requestFocus();
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.error,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Enter PIN'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 40),
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.forestGreen.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.lock_outline,
                size: 40,
                color: AppColors.forestGreen,
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              'Sending to',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              widget.recipientName,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              widget.recipientPhone,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              '₹${widget.amount.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.bold,
                color: AppColors.forestGreen,
              ),
            ),
            const SizedBox(height: 48),
            const Text(
              'Enter your 4-digit PIN',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(4, (index) {
                return Container(
                  width: 60,
                  height: 60,
                  margin: const EdgeInsets.symmetric(horizontal: 8),
                  child: TextField(
                    controller: _pinControllers[index],
                    focusNode: _focusNodes[index],
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.number,
                    maxLength: 1,
                    obscureText: true,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                    decoration: InputDecoration(
                      counterText: '',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: AppColors.border,
                          width: 2,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: AppColors.forestGreen,
                          width: 2,
                        ),
                      ),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    onChanged: (value) => _onPinChanged(index, value),
                  ),
                );
              }),
            ),
            const SizedBox(height: 32),
            if (_isProcessing) ...[
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              const Text(
                'Processing payment...',
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
            const SizedBox(height: 48),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.shield_outlined,
                    color: AppColors.forestGreen,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Your PIN is encrypted and secure',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[700],
                      ),
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
}
