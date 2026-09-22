import 'api_service.dart';
import '../config/api_config.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'storage_service.dart';

class ProfileService {
  // Get profile data
  static Future<Map<String, dynamic>> getProfile() async {
    return await ApiService.get(ApiConfig.profile);
  }

  // Update profile
  static Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? email,
    String? phone,
  }) async {
    final Map<String, dynamic> body = {};
    
    if (name != null) body['name'] = name;
    if (email != null) body['email'] = email;
    if (phone != null) body['phone'] = phone;
    
    return await ApiService.put(ApiConfig.updateProfile, body);
  }

  // Upload profile picture
  static Future<Map<String, dynamic>> uploadProfilePicture(File imageFile) async {
    try {
      final token = await StorageService.getAccessToken();
      final uri = Uri.parse('${ApiConfig.baseUrl}${ApiConfig.updateProfile}');
      
      var request = http.MultipartRequest('PUT', uri);
      request.headers['Authorization'] = 'Bearer $token';
      
      // Add image file
      var stream = http.ByteStream(imageFile.openRead());
      var length = await imageFile.length();
      var multipartFile = http.MultipartFile(
        'profile_picture',
        stream,
        length,
        filename: imageFile.path.split('/').last,
      );
      request.files.add(multipartFile);
      
      var response = await request.send();
      var responseData = await response.stream.bytesToString();
      
      return jsonDecode(responseData);
    } catch (e) {
      return {
        'success': false,
        'message': 'Failed to upload image: ${e.toString()}',
      };
    }
  }

  // Get addresses
  static Future<Map<String, dynamic>> getAddresses() async {
    return await ApiService.get(ApiConfig.addresses);
  }

  // Add address
  static Future<Map<String, dynamic>> addAddress({
    required String label,
    required String fullName,
    required String phone,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required String state,
    required String pincode,
    bool isDefault = false,
  }) async {
    final body = {
      'label': label,
      'full_name': fullName,
      'phone': phone,
      'address_line1': addressLine1,
      'address_line2': addressLine2,
      'city': city,
      'state': state,
      'pincode': pincode,
      'is_default': isDefault,
    };
    
    return await ApiService.post(ApiConfig.addresses, body);
  }

  // Update address
  static Future<Map<String, dynamic>> updateAddress({
    required int addressId,
    required String label,
    required String fullName,
    required String phone,
    required String addressLine1,
    String? addressLine2,
    required String city,
    required String state,
    required String pincode,
    bool isDefault = false,
  }) async {
    final body = {
      'label': label,
      'full_name': fullName,
      'phone': phone,
      'address_line1': addressLine1,
      'address_line2': addressLine2,
      'city': city,
      'state': state,
      'pincode': pincode,
      'is_default': isDefault,
    };
    
    return await ApiService.put('${ApiConfig.addresses}/$addressId', body);
  }

  // Delete address
  static Future<Map<String, dynamic>> deleteAddress(int addressId) async {
    return await ApiService.delete('${ApiConfig.addresses}/$addressId');
  }

  // Set default address
  static Future<Map<String, dynamic>> setDefaultAddress(int addressId) async {
    return await ApiService.put('${ApiConfig.addresses}/$addressId/set-default', {});
  }
}
