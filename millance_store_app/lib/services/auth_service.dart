import 'dart:convert';
import '../config/api_config.dart';
import '../models/user_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService {
  // Login
  static Future<Map<String, dynamic>> login({
    required String emailOrPhone,
    required String mpin,
  }) async {
    final response = await ApiService.post(
      ApiConfig.login,
      {
        'email_or_phone': emailOrPhone,
        'mpin': mpin,
      },
      requiresAuth: false,
    );

    if (response['success'] == true) {
      final data = response['data'];
      
      // Save tokens
      await StorageService.saveTokens(
        accessToken: data['access_token'],
        refreshToken: data['refresh_token'],
      );
      
      // Save user data
      if (data['customer'] != null) {
        final user = UserModel.fromJson(data['customer']);
        await StorageService.saveUserId(user.id);
        await StorageService.saveUserData(jsonEncode(user.toJson()));
      }
    }

    return response;
  }

  // Register
  static Future<Map<String, dynamic>> register({
    required String username,
    required String name,
    required String email,
    required String phone,
    required String mpin,
    String? referredBy,
  }) async {
    final body = {
      'username': username,
      'name': name,
      'email': email,
      'phone': phone,
      'mpin': mpin,
    };

    if (referredBy != null && referredBy.isNotEmpty) {
      body['referred_by'] = referredBy;
    }

    final response = await ApiService.post(
      ApiConfig.register,
      body,
      requiresAuth: false,
    );

    if (response['success'] == true) {
      final data = response['data'];
      
      // Save tokens
      await StorageService.saveTokens(
        accessToken: data['access_token'],
        refreshToken: data['refresh_token'],
      );
      
      // Save user data
      if (data['customer'] != null) {
        final user = UserModel.fromJson(data['customer']);
        await StorageService.saveUserId(user.id);
        await StorageService.saveUserData(jsonEncode(user.toJson()));
      }
    }

    return response;
  }

  // Logout
  static Future<void> logout() async {
    try {
      await ApiService.post(ApiConfig.logout, {});
    } catch (e) {
      // Continue even if API call fails
    }
    await StorageService.clearAll();
  }

  // Get current user
  static Future<UserModel?> getCurrentUser() async {
    final userData = await StorageService.getUserData();
    if (userData != null) {
      return UserModel.fromJson(jsonDecode(userData));
    }
    return null;
  }

  // Check if logged in
  static Future<bool> isLoggedIn() async {
    return await StorageService.isLoggedIn();
  }
}
