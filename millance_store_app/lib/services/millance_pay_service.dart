import 'api_service.dart';
import '../config/api_config.dart';

class MillancePayService {
  // Search Millance Store user by phone
  static Future<Map<String, dynamic>> searchUser(String phone) async {
    return await ApiService.get('${ApiConfig.millancePayBase}/search?phone=$phone');
  }

  // Get recent contacts (default 5)
  static Future<Map<String, dynamic>> getRecentContacts({int limit = 5}) async {
    return await ApiService.get('${ApiConfig.millancePayBase}/recent?limit=$limit');
  }

  // Get all contacts (paginated)
  static Future<Map<String, dynamic>> getAllContacts({
    int page = 1,
    int pageSize = 20,
  }) async {
    return await ApiService.get(
      '${ApiConfig.millancePayBase}/contacts?page=$page&page_size=$pageSize',
    );
  }

  // Get transaction history with specific user
  static Future<Map<String, dynamic>> getTransactionHistory({
    required String phone,
    int page = 1,
    int pageSize = 20,
  }) async {
    return await ApiService.get(
      '${ApiConfig.millancePayBase}/history/$phone?page=$page&page_size=$pageSize',
    );
  }

  // Send money to another user
  static Future<Map<String, dynamic>> sendMoney({
    required String recipientPhone,
    required double amount,
    required String pin,
    String? note,
  }) async {
    return await ApiService.post(
      '${ApiConfig.millancePayBase}/send',
      {
        'recipient_phone': recipientPhone,
        'amount': amount,
        'pin': pin,
        'note': note ?? 'Money transfer',
      },
    );
  }

  // Get suggested accounts
  static Future<Map<String, dynamic>> getSuggestedAccounts() async {
    return await ApiService.get('${ApiConfig.millancePayBase}/suggested');
  }
}
