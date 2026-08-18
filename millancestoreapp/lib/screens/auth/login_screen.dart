import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';
import '../../services/auth_service.dart';
import 'otp_verification_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey        = GlobalKey<FormState>();
  final _phoneController = TextEditingController();
  final _nameController  = TextEditingController();
  bool _loading          = false;
  String? _error;

  @override
  void dispose() {
    _phoneController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _continue() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    try {
      final result = await authService.sendOtp(
        _phoneController.text.trim(),
        name: _nameController.text.trim().isNotEmpty
            ? _nameController.text.trim()
            : null,
      );
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OtpVerificationScreen(
            phoneNumber: _phoneController.text.trim(),
            devOtp:      result['otp'] as String?,   // shown in dev only
            isNewUser:   result['is_new'] as bool? ?? false,
          ),
        ),
      );
    } catch (e) {
      setState(() { _error = _friendlyError(e); });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  String _friendlyError(Object e) {
    final s = e.toString();
    if (s.contains('400')) return 'Name is required for new accounts.';
    if (s.contains('blocked')) return 'This account has been blocked.';
    if (s.contains('SocketException') || s.contains('connection'))
      return 'No internet connection. Check your network.';
    return 'Something went wrong. Please try again.';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FadeInDown(
                  duration: const Duration(milliseconds: 400),
                  child: Center(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20),
                      child: Image.asset(
                        'assets/images/logo.jpeg',
                        width: 120, height: 120, fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          width: 120, height: 120,
                          decoration: BoxDecoration(
                            gradient: AppColors.primaryGradient,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Icon(Icons.store, size: 60, color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 32),

                FadeInLeft(
                  duration: const Duration(milliseconds: 500),
                  child: const Text('Welcome to Millance Store',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold,
                        color: AppColors.textDark)),
                ),
                const SizedBox(height: 8),
                FadeInLeft(
                  duration: const Duration(milliseconds: 600),
                  child: const Text('Login or Sign up with your mobile number',
                    style: TextStyle(fontSize: 16, color: AppColors.textGray)),
                ),
                const SizedBox(height: 32),

                // Error banner
                if (_error != null)
                  FadeInUp(
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.red.shade50,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.red.shade200),
                      ),
                      child: Row(children: [
                        const Icon(Icons.error_outline, color: Colors.red, size: 18),
                        const SizedBox(width: 8),
                        Expanded(child: Text(_error!,
                            style: const TextStyle(color: Colors.red, fontSize: 13))),
                      ]),
                    ),
                  ),

                // Name field (for new users — always shown; backend ignores if existing)
                FadeInUp(
                  duration: const Duration(milliseconds: 650),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Your Name',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
                              color: AppColors.textDark)),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _nameController,
                        textCapitalization: TextCapitalization.words,
                        style: const TextStyle(fontSize: 16),
                        decoration: InputDecoration(
                          hintText: 'Enter your name (required for new accounts)',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.border)),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.border)),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.primaryOrange, width: 2)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Phone field
                FadeInUp(
                  duration: const Duration(milliseconds: 700),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Phone Number',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
                              color: AppColors.textDark)),
                      const SizedBox(height: 8),
                      TextFormField(
                        controller: _phoneController,
                        keyboardType: TextInputType.phone,
                        maxLength: 10,
                        style: const TextStyle(fontSize: 16),
                        decoration: InputDecoration(
                          hintText: 'Enter 10-digit mobile number',
                          prefixIcon: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: const Row(mainAxisSize: MainAxisSize.min, children: [
                              Text('+91', style: TextStyle(fontSize: 16,
                                  fontWeight: FontWeight.w600, color: AppColors.textDark)),
                              SizedBox(width: 8),
                              SizedBox(height: 24,
                                  child: VerticalDivider(color: AppColors.border, thickness: 1)),
                            ]),
                          ),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.border)),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.border)),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: AppColors.primaryOrange, width: 2)),
                          errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Colors.red)),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          counterText: '',
                        ),
                        validator: (v) {
                          if (v == null || v.isEmpty) return 'Please enter phone number';
                          if (v.length != 10) return 'Please enter valid 10-digit number';
                          return null;
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                FadeInUp(
                  duration: const Duration(milliseconds: 800),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _continue,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryOrange,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        elevation: 2,
                      ),
                      child: _loading
                          ? const SizedBox(height: 20, width: 20,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : const Text('Send OTP',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold,
                                  color: Colors.white)),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                FadeInUp(
                  duration: const Duration(milliseconds: 1000),
                  child: const Text(
                    'By continuing, you agree to our Terms of Service and Privacy Policy',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: AppColors.textGray, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
