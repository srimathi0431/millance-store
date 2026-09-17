import 'api_service.dart';
import '../config/api_config.dart';

class WalletService {
  // Get wallet balance
  static Future<Map<String, dynamic>> getBalance() async {
    return await ApiService.get(ApiConfig.walletBalance);
  }

  // Get wallet transactions
  static Future<Map<String, dynamic>> getTransactions({
    int page = 1,
    int pageSize = 20,
  }) async {
    return await ApiService.get(
      '${ApiConfig.walletTransactions}?page=$page&page_size=$pageSize',
    );
  }

  // Redeem code
  static Future<Map<String, dynamic>> redeemCode(String code) async {
    return await ApiService.post(
      ApiConfig.redeemCode,
      {'code': code},
    );
  }

  // Wallet PIN - Check status
  static Future<Map<String, dynamic>> getPinStatus() async {
    return await ApiService.get(ApiConfig.walletPinStatus);
  }

  // Wallet PIN - Set
  static Future<Map<String, dynamic>> setPin({
    required String pin,
    required String confirmPin,
  }) async {
    return await ApiService.post(
      ApiConfig.setWalletPin,
      {
        'pin': pin,
        'confirm_pin': confirmPin,
      },
    );
  }

  // Wallet PIN - Change
  static Future<Map<String, dynamic>> changePin({
    required String newPin,
    required String confirmPin,
  }) async {
    return await ApiService.post(
      ApiConfig.changeWalletPin,
      {
        'new_pin': newPin,
        'confirm_pin': confirmPin,
      },
    );
  }

  // Wallet PIN - Verify
  static Future<Map<String, dynamic>> verifyPin(String pin) async {
    return await ApiService.post(
      ApiConfig.verifyWalletPin,
      {'pin': pin},
    );
  }

  // QR Payment - Pay
  static Future<Map<String, dynamic>> qrPay({
    required double amount,
    required String pin,
    String? description,
  }) async {
    return await ApiService.post(
      ApiConfig.qrPayment,
      {
        'amount': amount,
        'pin': pin,
        'description': description ?? 'QR Payment',
      },
    );
  }

  // QR Payment - History
  static Future<Map<String, dynamic>> getQRPaymentHistory({
    int page = 1,
    int pageSize = 20,
  }) async {
    return await ApiService.get(
      '${ApiConfig.qrPaymentHistory}?page=$page&page_size=$pageSize',
    );
  }

  // Get affiliate stats
  static Future<Map<String, dynamic>> getAffiliateStats() async {
    return await ApiService.get(ApiConfig.affiliateDashboard);
  }

  // Get affiliate dashboard
  static Future<Map<String, dynamic>> getAffiliateDashboard() async {
    return await ApiService.get(ApiConfig.affiliateDashboard);
  }

  // Get income wallet history
  static Future<Map<String, dynamic>> getIncomeWalletHistory({
    int page = 1,
    int pageSize = 20,
  }) async {
    return await ApiService.get(
      '${ApiConfig.incomeWalletHistory}?page=$page&page_size=$pageSize',
    );
  }

  // Get unilevel tree details for a specific level
  static Future<Map<String, dynamic>> getLevelDetails(int level) async {
    return await ApiService.get('${ApiConfig.affiliateLevelDetails}/$level');
  }
}
