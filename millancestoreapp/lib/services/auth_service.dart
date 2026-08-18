import 'package:flutter/foundation.dart';
import 'api_service.dart';

/// Holds the current logged-in customer profile and drives UI state.
class AuthService extends ChangeNotifier {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  Map<String, dynamic>? _profile;
  bool _loading = true;   // true while checking stored token on startup
  bool _loggedIn = false;

  Map<String, dynamic>? get profile => _profile;
  bool get isLoading => _loading;
  bool get isLoggedIn => _loggedIn;
  String get customerName => _profile?['name'] ?? 'Guest';
  String get customerPhone => _profile?['phone'] ?? '';
  String get customerEmail => _profile?['email'] ?? '';

  /// Call once on app startup — restores session if a valid token exists.
  Future<void> restoreSession() async {
    _loading = true;
    notifyListeners();
    try {
      final hasToken = await api.isLoggedIn;
      if (hasToken) {
        _profile  = await api.getProfile();
        _loggedIn = true;
      }
    } catch (_) {
      // Token expired or invalid — clear it
      await api.clearSession();
      _loggedIn = false;
      _profile  = null;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Step 1 — send OTP to phone. Returns the OTP (dev only).
  Future<Map<String, dynamic>> sendOtp(String phone, {String? name}) {
    return api.sendOtp(phone, name: name);
  }

  /// Step 2 — verify OTP, save tokens, load profile.
  Future<void> verifyOtp(String phone, String otp) async {
    await api.verifyOtp(phone, otp);   // saves tokens internally
    _profile  = await api.getProfile();
    _loggedIn = true;
    notifyListeners();
  }

  Future<void> logout() async {
    await api.logout();
    _profile  = null;
    _loggedIn = false;
    notifyListeners();
  }

  Future<void> refreshProfile() async {
    try {
      _profile = await api.getProfile();
      notifyListeners();
    } catch (_) {}
  }

  Future<void> updateProfile({String? name, String? email}) async {
    _profile = await api.updateProfile(name: name, email: email);
    notifyListeners();
  }
}

final authService = AuthService();
