import '../screens/wallet/wallet_screen.dart';

class WalletService {
  // Singleton pattern
  static final WalletService _instance = WalletService._internal();
  factory WalletService() => _instance;
  WalletService._internal();

  // In a real app, this would be stored in a database/backend
  double _promoCashBalance = 1000.0;
  final List<WalletTransaction> _transactions = [
    WalletTransaction(
      id: '1',
      type: TransactionType.credit,
      amount: 1000,
      description: 'Welcome Bonus - Sign Up Reward',
      date: DateTime.now(),
      status: 'Completed',
    ),
  ];

  // Getters
  double get promoCashBalance => _promoCashBalance;
  List<WalletTransaction> get transactions => List.unmodifiable(_transactions);

  // Promo cash rules
  static const double minimumOrderAmount = 299.0;
  static const double promoCashDiscount = 50.0;

  // Check if promo cash can be applied
  bool canApplyPromoCash(double orderAmount) {
    return orderAmount >= minimumOrderAmount && _promoCashBalance >= promoCashDiscount;
  }

  // Get discount amount for order
  double getDiscountAmount(double orderAmount) {
    if (canApplyPromoCash(orderAmount)) {
      return promoCashDiscount;
    }
    return 0.0;
  }

  // Deduct promo cash (called when order is placed)
  bool deductPromoCash(double amount, String orderId) {
    if (_promoCashBalance >= amount) {
      _promoCashBalance -= amount;
      
      // Add transaction record
      _transactions.insert(
        0,
        WalletTransaction(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          type: TransactionType.debit,
          amount: amount,
          description: 'Used for Order #$orderId',
          date: DateTime.now(),
          status: 'Completed',
        ),
      );
      
      return true;
    }
    return false;
  }

  // Credit promo cash (for refunds, etc.)
  void creditPromoCash(double amount, String description) {
    _promoCashBalance += amount;
    
    _transactions.insert(
      0,
      WalletTransaction(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        type: TransactionType.credit,
        amount: amount,
        description: description,
        date: DateTime.now(),
        status: 'Completed',
      ),
    );
  }

  // Reset wallet (for testing)
  void resetWallet() {
    _promoCashBalance = 1000.0;
    _transactions.clear();
    _transactions.add(
      WalletTransaction(
        id: '1',
        type: TransactionType.credit,
        amount: 1000,
        description: 'Welcome Bonus - Sign Up Reward',
        date: DateTime.now(),
        status: 'Completed',
      ),
    );
  }
}
