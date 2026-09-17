class UserModel {
  final int id;
  final String username;
  final String name;
  final String email;
  final String phone;
  final String referralCode;
  final double millanceStoreWallet;
  final double incomeWallet;
  final double promoCash;

  UserModel({
    required this.id,
    required this.username,
    required this.name,
    required this.email,
    required this.phone,
    required this.referralCode,
    required this.millanceStoreWallet,
    required this.incomeWallet,
    required this.promoCash,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      referralCode: json['referral_code'] ?? '',
      millanceStoreWallet: (json['millance_store_wallet'] ?? 0).toDouble(),
      incomeWallet: (json['income_wallet'] ?? 0).toDouble(),
      promoCash: (json['promo_cash'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'name': name,
      'email': email,
      'phone': phone,
      'referral_code': referralCode,
      'millance_store_wallet': millanceStoreWallet,
      'income_wallet': incomeWallet,
      'promo_cash': promoCash,
    };
  }
}
