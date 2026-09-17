class MillancePayContact {
  final int? customerId;
  final String phone;
  final String name;
  final double lastAmount;
  final String lastType;
  final String? lastDate;
  final String? lastNote;

  MillancePayContact({
    this.customerId,
    required this.phone,
    required this.name,
    required this.lastAmount,
    required this.lastType,
    this.lastDate,
    this.lastNote,
  });

  factory MillancePayContact.fromJson(Map<String, dynamic> json) {
    return MillancePayContact(
      customerId: json['customer_id'],
      phone: json['phone'] ?? '',
      name: json['name'] ?? '',
      lastAmount: (json['last_amount'] ?? 0).toDouble(),
      lastType: json['last_type'] ?? 'sent',
      lastDate: json['last_date'],
      lastNote: json['last_note'],
    );
  }
}

class MillancePayTransaction {
  final int id;
  final String type;
  final double amount;
  final String? note;
  final String status;
  final String? date;
  final Map<String, dynamic>? otherParty;

  MillancePayTransaction({
    required this.id,
    required this.type,
    required this.amount,
    this.note,
    required this.status,
    this.date,
    this.otherParty,
  });

  factory MillancePayTransaction.fromJson(Map<String, dynamic> json) {
    return MillancePayTransaction(
      id: json['id'] ?? 0,
      type: json['type'] ?? 'sent',
      amount: (json['amount'] ?? 0).toDouble(),
      note: json['note'],
      status: json['status'] ?? 'completed',
      date: json['date'],
      otherParty: json['other_party'],
    );
  }
}

class MillancePayUser {
  final int id;
  final String name;
  final String phone;
  final String username;

  MillancePayUser({
    required this.id,
    required this.name,
    required this.phone,
    required this.username,
  });

  factory MillancePayUser.fromJson(Map<String, dynamic> json) {
    return MillancePayUser(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      username: json['username'] ?? '',
    );
  }
}
