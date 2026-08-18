import 'package:flutter/material.dart';

/// Millance Store Brand Colors (from web store)
class AppColors {
  // Primary Brand Colors
  static const Color primaryOrange = Color(0xFFFF7A00);
  static const Color primaryPink = Color(0xFFFF4F81);
  static const Color primaryPurple = Color(0xFF8B2BE2);
  
  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primaryOrange, primaryPink, primaryPurple],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
  
  static const LinearGradient orangePinkGradient = LinearGradient(
    colors: [primaryOrange, primaryPink],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
  
  static const LinearGradient pinkPurpleGradient = LinearGradient(
    colors: [primaryPink, primaryPurple],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
  
  // Background Colors
  static const Color background = Color(0xFFE3E6E6);
  static const Color cardWhite = Color(0xFFFFFFFF);
  static const Color lightGray = Color(0xFFF0F2F2);
  
  // Text Colors
  static const Color textDark = Color(0xFF0F1111);
  static const Color textGray = Color(0xFF565959);
  static const Color textLight = Color(0xFF888888);
  
  // Accent Colors
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color info = Color(0xFF3B82F6);
  
  // Borders
  static const Color border = Color(0xFFDDDDDD);
  static const Color borderLight = Color(0xFFE0E0E0);
  
  // WhatsApp
  static const Color whatsapp = Color(0xFF25D366);
  
  // Shadows
  static List<BoxShadow> get cardShadow => [
        BoxShadow(
          color: Colors.black.withOpacity(0.08),
          blurRadius: 8,
          offset: const Offset(0, 2),
        ),
      ];
  
  static List<BoxShadow> get hoverShadow => [
        BoxShadow(
          color: Colors.black.withOpacity(0.15),
          blurRadius: 24,
          offset: const Offset(0, 8),
        ),
      ];
}
