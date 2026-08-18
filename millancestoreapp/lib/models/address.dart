class Address {
  final int id;
  final String name;
  final String phone;
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final String state;
  final String country;
  final String pincode;
  final bool isDefault;

  String get fullAddress {
    final parts = [
      addressLine1,
      if (addressLine2 != null && addressLine2!.isNotEmpty) addressLine2!,
      city,
      '$state $pincode',
      country,
    ];
    return parts.join(', ');
  }

  const Address({
    required this.id,
    required this.name,
    required this.phone,
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    required this.state,
    this.country = 'India',
    required this.pincode,
    this.isDefault = false,
  });

  factory Address.fromJson(Map<String, dynamic> j) => Address(
        id:           j['id'] as int,
        name:         j['name'] as String,
        phone:        j['phone'] as String,
        addressLine1: j['address_line1'] as String,
        addressLine2: j['address_line2'] as String?,
        city:         j['city'] as String,
        state:        j['state'] as String,
        country:      j['country'] as String? ?? 'India',
        pincode:      j['pincode'] as String,
        isDefault:    j['is_default'] as bool? ?? false,
      );

  Map<String, dynamic> toJson() => {
        'name':          name,
        'phone':         phone,
        'address_line1': addressLine1,
        if (addressLine2 != null) 'address_line2': addressLine2,
        'city':          city,
        'state':         state,
        'country':       country,
        'pincode':       pincode,
        'is_default':    isDefault,
      };
}
