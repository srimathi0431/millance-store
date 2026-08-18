import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'dart:async';
import '../../theme/app_colors.dart';
import '../../services/auth_service.dart';
import '../../services/cart_service.dart';
import '../../widgets/main_shell.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String phoneNumber;
  final String? devOtp;      // shown in dev — remove in production
  final bool   isNewUser;

  const OtpVerificationScreen({
    super.key,
    required this.phoneNumber,
    this.devOtp,
    this.isNewUser = false,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final List<TextEditingController> _ctrl =
      List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _nodes = List.generate(6, (_) => FocusNode());

  int  _remainingSeconds = 30;
  Timer? _timer;
  bool _canResend  = false;
  bool _loading    = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _startTimer();
    // Pre-fill OTP in dev mode
    if (widget.devOtp != null && widget.devOtp!.length == 6) {
      for (int i = 0; i < 6; i++) {
        _ctrl[i].text = widget.devOtp![i];
      }
    }
  }

  @override
  void dispose() {
    for (final c in _ctrl)  c.dispose();
    for (final n in _nodes) n.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    setState(() { _canResend = false; _remainingSeconds = 30; });
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) { t.cancel(); return; }
      setState(() {
        if (_remainingSeconds > 0) { _remainingSeconds--; }
        else { _canResend = true; t.cancel(); }
      });
    });
  }

  Future<void> _resendOtp() async {
    if (!_canResend) return;
    setState(() { _loading = true; _error = null; });
    try {
      final result = await authService.sendOtp(widget.phoneNumber);
      if (!mounted) return;
      // Dev: pre-fill again
      final otp = result['otp'] as String?;
      if (otp != null && otp.length == 6) {
        for (int i = 0; i < 6; i++) _ctrl[i].text = otp[i];
      }
      _startTimer();
    } catch (e) {
      setState(() { _error = 'Failed to resend OTP. Try again.'; });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  Future<void> _verify() async {
    final otp = _ctrl.map((c) => c.text).join();
    if (otp.length != 6) {
      setState(() { _error = 'Please enter the complete 6-digit OTP.'; });
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      await authService.verifyOtp(widget.phoneNumber, otp);
      // Load server cart after login
      await cartService.loadCart();
      if (!mounted) return;
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const MainShell()),
        (route) => false,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(widget.isNewUser
              ? 'Welcome to Millance Store! 🎉'
              : 'Welcome back! 👋'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      setState(() { _error = 'Invalid or expired OTP. Please try again.'; });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textDark),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FadeInDown(
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: AppColors.orangePinkGradient,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(Icons.message, size: 60, color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              FadeInLeft(
                child: const Text('Verify OTP',
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold,
                        color: AppColors.textDark)),
              ),
              const SizedBox(height: 8),
              FadeInLeft(
                duration: const Duration(milliseconds: 600),
                child: RichText(
                  text: TextSpan(
                    style: const TextStyle(fontSize: 16, color: AppColors.textGray),
                    children: [
                      const TextSpan(text: 'Code sent to\n'),
                      TextSpan(
                        text: '+91 ${widget.phoneNumber}',
                        style: const TextStyle(fontWeight: FontWeight.bold,
                            color: AppColors.textDark),
                      ),
                    ],
                  ),
                ),
              ),

              // Dev OTP hint
              if (widget.devOtp != null) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.amber.shade300),
                  ),
                  child: Text('Dev OTP: ${widget.devOtp}',
                      style: TextStyle(fontSize: 13, color: Colors.amber.shade800,
                          fontWeight: FontWeight.w600)),
                ),
              ],

              const SizedBox(height: 32),

              // Error banner
              if (_error != null)
                Container(
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

              // OTP boxes
              FadeInUp(
                duration: const Duration(milliseconds: 700),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(6, (i) => _buildBox(i)),
                ),
              ),
              const SizedBox(height: 28),

              // Resend
              Center(
                child: _canResend
                    ? TextButton(
                        onPressed: _loading ? null : _resendOtp,
                        child: const Text('Resend OTP',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
                                color: AppColors.primaryOrange)))
                    : Text('Resend OTP in $_remainingSeconds s',
                        style: const TextStyle(fontSize: 14, color: AppColors.textGray)),
              ),
              const SizedBox(height: 28),

              FadeInUp(
                duration: const Duration(milliseconds: 900),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _verify,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryOrange,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 2,
                    ),
                    child: _loading
                        ? const SizedBox(height: 20, width: 20,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Verify & Continue',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold,
                                color: Colors.white)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBox(int i) {
    return SizedBox(
      width: 50, height: 56,
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: _ctrl[i].text.isNotEmpty ? AppColors.primaryOrange : AppColors.border,
            width: _ctrl[i].text.isNotEmpty ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: TextField(
          controller: _ctrl[i],
          focusNode: _nodes[i],
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          maxLength: 1,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          decoration: const InputDecoration(
              border: InputBorder.none, counterText: '', contentPadding: EdgeInsets.zero),
          onChanged: (v) {
            if (v.isNotEmpty && i < 5) _nodes[i + 1].requestFocus();
            if (v.isEmpty   && i > 0) _nodes[i - 1].requestFocus();
            setState(() {});
          },
        ),
      ),
    );
  }
}
