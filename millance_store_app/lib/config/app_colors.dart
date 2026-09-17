import 'package:flutter/material.dart';

class AppColors {
  // Millance Brand Colors (Multi-Color Gradient Palette)
  static const Color millanceOrange = Color(0xFFFE7504);    // 🟠 Orange
  static const Color millanceRed = Color(0xFFFF1F24);       // 🔴 Red
  static const Color millancePink = Color(0xFFF50087);      // 🌸 Pink/Magenta
  static const Color millancePurple = Color(0xFF6B0080);    // 🟣 Purple
  static const Color millanceNavy = Color(0xFF060E29);      // 🔵 Dark Navy (MILLANCE)
  
  // Primary Colors (Main theme colors)
  static const Color primary = millanceNavy;                 // Main brand color
  static const Color secondary = millanceOrange;             // Accent color
  static const Color accent = millancePink;                  // Highlight color
  
  // Legacy compatibility (keeping old names for existing code)
  static const Color forestGreen = millanceNavy;             // Replace with Navy
  static const Color oceanBlue = millancePurple;             // Replace with Purple
  static const Color orange = millanceOrange;                // Keep Orange
  
  // Gradient Colors for Millance branding
  static const LinearGradient millanceGradient = LinearGradient(
    colors: [
      millanceOrange,   // 🟠
      millanceRed,      // 🔴
      millancePink,     // 🌸
      millancePurple,   // 🟣
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  
  static const LinearGradient millanceGradientHorizontal = LinearGradient(
    colors: [
      millanceOrange,   // 🟠
      millanceRed,      // 🔴
      millancePink,     // 🌸
      millancePurple,   // 🟣
    ],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
  
  // Background Colors
  static const Color lightBlue = Color(0xFFF5F5FF);          // Light tint
  static const Color background = Color(0xFFF9FAFB);
  static const Color cardBackground = Color(0xFFFFFFFF);
  
  // Status Colors
  static const Color success = Color(0xFF16A34A);
  static const Color error = millanceRed;                    // Use brand red
  static const Color warning = millanceOrange;               // Use brand orange
  static const Color info = millancePurple;                  // Use brand purple
  
  // Text Colors
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textTertiary = Color(0xFF9CA3AF);
  static const Color textWhite = Color(0xFFFFFFFF);
  
  // Border Colors
  static const Color border = Color(0xFFE5E7EB);
  static const Color borderDark = Color(0xFFD1D5DB);
  
  // Overlay
  static const Color overlay = Color(0x80000000);
  static const Color shimmerBase = Color(0xFFE0E0E0);
  static const Color shimmerHighlight = Color(0xFFF5F5F5);
}

