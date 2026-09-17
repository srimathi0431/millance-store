import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../services/wallet_service.dart';

class WalletPinScreen extends StatefulWidget {
  const WalletPinScreen({super.key});

  @override
  State<WalletPinScreen> createState() => _WalletPinScreenState();
}

class _WalletPinScreenState extends State<WalletPinScreen> {
  final _pinController = TextEditingController();
  final _confirmPinController = TextEditingController();
  bool _hasPIN = false;
  bool _isLoading = true;
  bool _isSubmitting = false;
  bool _obscurePIN = true;
  bool _obscureConfirmPIN = true;

  @override
  void initState() {
    super.initState();
    _checkPINStatus();
  }

  @override
  void dispose() {
    _pinController.dispose();
    _confirmPinController.dispose();
    super.dispose();
  }

  Future<void> _checkPINStatus() async {
    try {
      final response = await WalletService.getPinStatus();
      
      if (response['success'] == true) {
        setState(() {
          _hasPIN = response['data']['pin_set'] ?? false;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleSubmit() async {
    if (_pinController.text.length != 4) {
      _showError('PIN must be 4 digits');
      return;
    }

    if (_pinController.text != _confirmPinController.text) {
      _showError('PINs do not match');
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final response = _hasPIN
          ? await WalletService.changePin(
              newPin: _pinController.text,
              confirmPin: _confirmPinController.text,
            )
          : await WalletService.setPin(
              pin: _pinController.text,
              confirmPin: _confirmPinController.text,
            );

      if (!mounted) return;

      if (response['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(response['message'] ?? 'PIN updated successfully'),
            backgroundColor: AppColors.success,
          ),
        );
        Navigator.pop(context);
      } else {
        _showError(response['message'] ?? 'Failed to update PIN');
      }
    } catch (e) {
      _showError('Error: $e');
    }

    setState(() => _isSubmitting = false);
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.error,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(_hasPIN ? 'Change Wallet PIN' : 'Set Wallet PIN'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Info Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.lightBlue.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppColors.oceanBlue.withOpacity(0.3),
                      ),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.info_outline,
                          color: AppColors.oceanBlue,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _hasPIN
                                ? 'Enter your new 4-digit PIN. Note: You don\'t need the old PIN to change it.'
                                : 'Set a 4-digit PIN to secure your wallet and enable Scan & Pay feature.',
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // PIN Field
                  Text(
                    _hasPIN ? 'New PIN' : 'PIN',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _pinController,
                    obscureText: _obscurePIN,
                    keyboardType: TextInputType.number,
                    maxLength: 4,
                    decoration: InputDecoration(
                      hintText: 'Enter 4-digit PIN',
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePIN ? Icons.visibility_off : Icons.visibility,
                        ),
                        onPressed: () {
                          setState(() => _obscurePIN = !_obscurePIN);
                        },
                      ),
                      counterText: '',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Confirm PIN Field
                  const Text(
                    'Confirm PIN',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _confirmPinController,
                    obscureText: _obscureConfirmPIN,
                    keyboardType: TextInputType.number,
                    maxLength: 4,
                    decoration: InputDecoration(
                      hintText: 'Re-enter 4-digit PIN',
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureConfirmPIN ? Icons.visibility_off : Icons.visibility,
                        ),
                        onPressed: () {
                          setState(() => _obscureConfirmPIN = !_obscureConfirmPIN);
                        },
                      ),
                      counterText: '',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Submit Button
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _isSubmitting ? null : _handleSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.forestGreen,
                      ),
                      child: _isSubmitting
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : Text(_hasPIN ? 'Change PIN' : 'Set PIN'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
