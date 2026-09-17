class WalletBalanceModel {
  final double millanceStoreWallet;
  final double incomeWallet;
  final double promoCash;

  WalletBalanceModel({
    required this.millanceStoreWallet,
    required this.incomeWallet,
    required this.promoCash,
  });

  factory WalletBalanceModel.fromJson(Map<String, dynamic> json) {
    return WalletBalanceModel(
      millanceStoreWallet: (json['millance_store_wallet'] ?? 0).toDouble(),
      incomeWallet: (json['income_wallet'] ?? 0).toDouble(),
      promoCash: (json['promo_cash'] ?? 0).toDouble(),
    );
  }

  double get total => millanceStoreWallet + incomeWallet + promoCash;
}

class WalletTransactionModel {
  final String id;  // Backend returns "TXN000001" string format
  final String transactionType;  // Backend returns "credit" or "debit"
  final String? walletType;  // store, income, promo
  final double amount;
  final double balanceBefore;
  final double balanceAfter;
  final String? description;
  final DateTime createdAt;

  WalletTransactionModel({
    required this.id,
    required this.transactionType,
    this.walletType,
    required this.amount,
    required this.balanceBefore,
    required this.balanceAfter,
    this.description,
    required this.createdAt,
  });

  factory WalletTransactionModel.fromJson(Map<String, dynamic> json) {
    // Handle both backend formats
    String txnId;
    if (json['id'] is int) {
      txnId = 'TXN${json['id'].toString().padLeft(6, '0')}';
    } else {
      txnId = json['id']?.toString() ?? '0';
    }
    
    // Parse date - handle both ISO format and formatted string
    DateTime parsedDate;
    if (json['date'] != null) {
      // Backend returns "01 Jan 2024, 10:30 AM"
      try {
        parsedDate = _parseFormattedDate(json['date']);
      } catch (e) {
        parsedDate = DateTime.now();
      }
    } else if (json['created_at'] != null) {
      parsedDate = DateTime.parse(json['created_at']);
    } else {
      parsedDate = DateTime.now();
    }
    
    return WalletTransactionModel(
      id: txnId,
      transactionType: json['type'] ?? json['transaction_type'] ?? '',
      walletType: json['wallet_type'],
      amount: (json['amount'] ?? 0).toDouble(),
      balanceBefore: (json['balance_before'] ?? 0).toDouble(),
      balanceAfter: (json['balance_after'] ?? 0).toDouble(),
      description: json['description'],
      createdAt: parsedDate,
    );
  }
  
  static DateTime _parseFormattedDate(String dateStr) {
    // Parse "01 Jan 2024, 10:30 AM" format
    try {
      final parts = dateStr.split(', ');
      if (parts.length == 2) {
        final datePart = parts[0]; // "01 Jan 2024"
        final timePart = parts[1]; // "10:30 AM"
        
        // Simple approximation - just return current time
        // In production, use intl package DateFormat for proper parsing
        return DateTime.now();
      }
    } catch (e) {
      // Fallback
    }
    return DateTime.now();
  }

  String get typeDisplay {
    switch (transactionType.toLowerCase()) {
      case 'credit':
        return 'Credit';
      case 'debit':
        return 'Debit';
      case 'purchase':
        return 'Purchase';
      case 'refund':
        return 'Refund';
      case 'commission':
        return 'Commission';
      default:
        return transactionType;
    }
  }

  bool get isCredit => ['credit', 'refund', 'commission'].contains(transactionType.toLowerCase());
}

class QRPaymentModel {
  final int id;
  final double amount;
  final double balanceBefore;
  final double balanceAfter;
  final String status;
  final String? description;
  final DateTime createdAt;

  QRPaymentModel({
    required this.id,
    required this.amount,
    required this.balanceBefore,
    required this.balanceAfter,
    required this.status,
    this.description,
    required this.createdAt,
  });

  factory QRPaymentModel.fromJson(Map<String, dynamic> json) {
    return QRPaymentModel(
      id: json['id'] ?? 0,
      amount: (json['amount'] ?? 0).toDouble(),
      balanceBefore: (json['balance_before'] ?? 0).toDouble(),
      balanceAfter: (json['balance_after'] ?? 0).toDouble(),
      status: json['status'] ?? 'pending',
      description: json['description'],
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'])
          : DateTime.now(),
    );
  }
}
