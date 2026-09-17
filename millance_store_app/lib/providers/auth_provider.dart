import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  String? _error;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _user != null;

  // Initialize - check if user is already logged in
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      final isLoggedIn = await AuthService.isLoggedIn();
      if (isLoggedIn) {
        _user = await AuthService.getCurrentUser();
      }
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  // Login
  Future<bool> login(String emailOrPhone, String mpin) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await AuthService.login(
        emailOrPhone: emailOrPhone,
        mpin: mpin,
      );

      if (response['success'] == true) {
        _user = await AuthService.getCurrentUser();
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Login failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Register
  Future<bool> register({
    required String username,
    required String name,
    required String email,
    required String phone,
    required String mpin,
    String? referredBy,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await AuthService.register(
        username: username,
        name: name,
        email: email,
        phone: phone,
        mpin: mpin,
        referredBy: referredBy,
      );

      if (response['success'] == true) {
        _user = await AuthService.getCurrentUser();
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['message'] ?? 'Registration failed';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Logout
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await AuthService.logout();
    _user = null;
    _error = null;

    _isLoading = false;
    notifyListeners();
  }

  // Refresh user data
  Future<void> refreshUser() async {
    try {
      _user = await AuthService.getCurrentUser();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  // Clear error
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
