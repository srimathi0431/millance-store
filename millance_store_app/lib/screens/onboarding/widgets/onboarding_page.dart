import 'package:flutter/material.dart';
import '../../../config/app_colors.dart';
import '../onboarding_screen.dart';

class OnboardingPage extends StatelessWidget {
  final OnboardingData data;

  const OnboardingPage({
    super.key,
    required this.data,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Spacer(flex: 1),
          
          // Icon Container
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  data.color.withOpacity(0.1),
                  data.color.withOpacity(0.05),
                ],
              ),
              borderRadius: BorderRadius.circular(100),
            ),
            child: Container(
              margin: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    data.color,
                    data.color.withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(80),
                boxShadow: [
                  BoxShadow(
                    color: data.color.withOpacity(0.3),
                    blurRadius: 32,
                    offset: const Offset(0, 16),
                  ),
                ],
              ),
              child: Icon(
                data.icon,
                size: 80,
                color: Colors.white,
              ),
            ),
          ),
          
          const SizedBox(height: 56),
          
          // Title
          Text(
            data.title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w700,
              color: AppColors.textPrimary,
              height: 1.3,
              letterSpacing: -0.5,
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Description
          Text(
            data.description,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: AppColors.textSecondary,
              height: 1.6,
              letterSpacing: 0.2,
            ),
          ),
          
          const Spacer(flex: 2),
        ],
      ),
    );
  }
}
