import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../config/app_colors.dart';
import '../../models/wallet_model.dart';
import '../../services/wallet_service.dart';
import 'transactions_screen.dart';
import 'qr_scan_pay_screen.dart';
import 'wallet_pin_screen.dart';
import 'redeem_code_screen.dart';
import '../millance_pay/millance_pay_home_screen.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  WalletBalanceModel? _balance;
  bool _isLoading = true;
  bool _hasPIN = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    
    await Future.wait([
      _loadBalance(),
      _checkPINStatus(),
    ]);
    
    setState(() => _isLoading = false);
  }

  Future<void> _loadBalance() async {
    try {
      final response = await WalletService.getBalance();
      
      if (response['success'] == true) {
        setState(() {
          _balance = WalletBalanceModel.fromJson(response['data'] ?? {});
        });
      }
    } catch (e) {
      // Ignore error
    }
  }

  Future<void> _checkPINStatus() async {
    try {
      final response = await WalletService.getPinStatus();
      
      if (response['success'] == true) {
        final data = response['data'];
        setState(() {
          // Backend returns 'has_pin', not 'pin_set'
          _hasPIN = data['has_pin'] ?? data['pin_set'] ?? false;
        });
      }
    } catch (e) {
      // If error, assume no PIN for safety
      setState(() {
        _hasPIN = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Wallet'),
        backgroundColor: AppColors.forestGreen,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () async {
              await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const WalletPinScreen()),
              );
              _checkPINStatus();
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Balance Cards
                    _buildBalanceCard(
                      'Millance Store Wallet',
                      _balance?.millanceStoreWallet ?? 0,
                      AppColors.forestGreen,
                      Icons.account_balance_wallet,
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildBalanceCard(
                      'Income Wallet',
                      _balance?.incomeWallet ?? 0,
                      AppColors.oceanBlue,
                      Icons.attach_money,
                    ),
                    
                    const SizedBox(height: 12),
                    
                    _buildBalanceCard(
                      'Promo Cash',
                      _balance?.promoCash ?? 0,
                      AppColors.orange,
                      Icons.card_giftcard,
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Quick Actions
                    const Text(
                      'Quick Actions',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    
                    const SizedBox(height: 16),
                    
                    Row(
                      children: [
                        Expanded(
                          child: _buildActionButton(
                            'Scan & Pay',
                            Icons.qr_code_scanner,
                            AppColors.forestGreen,
                            () {
                              if (!_hasPIN) {
                                _showSetPINDialog();
                              } else {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const QRScanPayScreen(),
                                  ),
                                );
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildActionButton(
                            'Millance Pay',
                            Icons.send,
                            AppColors.oceanBlue,
                            () {
                              if (!_hasPIN) {
                                _showSetPINDialog();
                              } else {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const MillancePayHomeScreen(),
                                  ),
                                ).then((_) => _loadBalance());
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 12),
                    
                    Row(
                      children: [
                        Expanded(
                          child: _buildActionButton(
                            'Redeem Code',
                            Icons.redeem,
                            AppColors.orange,
                            () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const RedeemCodeScreen(),
                                ),
                              ).then((_) => _loadBalance());
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildActionButton(
                            'Transactions',
                            Icons.history,
                            AppColors.textSecondary,
                            () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const TransactionsScreen(),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Info Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightBlue.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: AppColors.oceanBlue.withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.info_outline,
                            color: AppColors.oceanBlue,
                            size: 24,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Wallet PIN',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _hasPIN
                                      ? 'PIN is set. Use Scan & Pay for quick payments'
                                      : 'Set your 4-digit PIN to use Scan & Pay',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildBalanceCard(String title, double amount, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color, color.withOpacity(0.8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '₹${amount.toStringAsFixed(2)}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.copy, color: Colors.white, size: 20),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: amount.toStringAsFixed(2)));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Amount copied to clipboard'),
                  duration: Duration(seconds: 1),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(String label, IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  void _showSetPINDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Set Wallet PIN'),
        content: const Text(
          'You need to set a 4-digit PIN before using Scan & Pay feature.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const WalletPinScreen()),
              ).then((_) => _checkPINStatus());
            },
            child: const Text('Set PIN'),
          ),
        ],
      ),
    );
  }
}
