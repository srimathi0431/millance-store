import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import 'storage_service.dart';

class ApiService {
  // GET request
  static Future<Map<String, dynamic>> get(String endpoint, {bool requiresAuth = true}) async {
    try {
      final headers = await _getHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
      
      final response = await http.get(uri, headers: headers)
          .timeout(ApiConfig.connectTimeout);

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  // POST request
  static Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> body, {
    bool requiresAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
      
      final response = await http.post(
        uri,
        headers: headers,
        body: jsonEncode(body),
      ).timeout(ApiConfig.connectTimeout);

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  // PUT request
  static Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> body, {
    bool requiresAuth = true,
  }) async {
    try {
      final headers = await _getHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
      
      final response = await http.put(
        uri,
        headers: headers,
        body: jsonEncode(body),
      ).timeout(ApiConfig.connectTimeout);

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  // DELETE request
  static Future<Map<String, dynamic>> delete(String endpoint, {bool requiresAuth = true}) async {
    try {
      final headers = await _getHeaders(requiresAuth: requiresAuth);
      final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
      
      final response = await http.delete(uri, headers: headers)
          .timeout(ApiConfig.connectTimeout);

      return _handleResponse(response);
    } catch (e) {
      return {
        'success': false,
        'message': 'Network error: ${e.toString()}',
      };
    }
  }

  // Get headers with auth token
  static Future<Map<String, String>> _getHeaders({bool requiresAuth = true}) async {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requiresAuth) {
      final token = await StorageService.getAccessToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Handle API response
  static Map<String, dynamic> _handleResponse(http.Response response) {
    try {
      final Map<String, dynamic> data = jsonDecode(response.body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return data;
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Request failed',
          'error': data,
        };
      }
    } catch (e) {
      return {
        'success': false,
        'message': 'Failed to parse response',
        'error': e.toString(),
      };
    }
  }
}
