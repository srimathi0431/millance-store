import 'dart:async';
import 'package:app_links/app_links.dart';

class DeepLinkService {
  static final AppLinks _appLinks = AppLinks();
  static StreamSubscription? _linkSubscription;
  
  /// Get initial deep link (when app opens from closed state)
  static Future<String?> getInitialReferralCode() async {
    try {
      final uri = await _appLinks.getInitialLink();
      if (uri != null) {
        return extractReferralCode(uri.toString());
      }
    } catch (e) {
      print('Error getting initial link: $e');
    }
    return null;
  }
  
  /// Listen for incoming deep links (when app is running)
  static void listenForLinks(Function(String) onReferralCode) {
    _linkSubscription?.cancel();
    
    _linkSubscription = _appLinks.uriLinkStream.listen(
      (Uri? uri) {
        if (uri != null) {
          final referralCode = extractReferralCode(uri.toString());
          if (referralCode != null) {
            onReferralCode(referralCode);
          }
        }
      },
      onError: (err) {
        print('Error listening for links: $err');
      },
    );
  }
  
  /// Extract referral code from URL
  /// Example: https://millance.store/john123 -> john123
  static String? extractReferralCode(String url) {
    try {
      final uri = Uri.parse(url);
      
      // Check if it's millance.store domain
      if (uri.host == 'millance.store' || uri.host == 'www.millance.store') {
        // Get the first path segment (username/referral code)
        if (uri.pathSegments.isNotEmpty) {
          final code = uri.pathSegments.first;
          
          // Validate it's not empty and not just '/'
          if (code.isNotEmpty && code != '/' && code.length >= 3) {
            return code;
          }
        }
      }
    } catch (e) {
      print('Error extracting referral code from URL: $e');
    }
    return null;
  }
  
  /// Stop listening for deep links
  static void dispose() {
    _linkSubscription?.cancel();
    _linkSubscription = null;
  }
}
