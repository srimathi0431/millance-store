import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../services/wallet_service.dart';

class RedeemCodeScreen extends StatefulWidget {
  const RedeemCodeScreen({super.key});

  @override
  State<RedeemCodeScreen> createState() => _RedeemCodeScreenState();
}

class _RedeemCodeScreenState extends State<RedeemCodeScreen> with SingleTickerProviderStateMixin {
  final _codeController = TextEditingController();
  bool _isRedeeming = false;
  late TabController _tabController;
  List<dynamic> _redeemHistory = [];
  bool _isLoadingHistory = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadRedeemHistory();
  }

  @override
  void dispose() {
    _codeController.dispose();
    _tabController.dispose();
    super.dispose();
  }
  
  Future<void> _loadRedeemHistory() async {
    setState(() => _isLoadingHistory = true);
    
    try {
      final response = await WalletService.getTransactions();
      
      if (response['success'] == true) {
        final dynamic data = response['data'];
        List<dynamic> allTransactions = [];
        
        if (data is List) {
          allTransactions = data;
        } else if (data is Map) {
          allTransactions = data['items'] ?? data['transactions'] ?? [];
        }
        
        // Filter only redeem code transactions
        setState(() {
          _redeemHistory = allTransactions.where((txn) {
            final description = txn['description']?.toString().toLowerCase() ?? '';
            return description.contains('redeem') && description.contains('code');
          }).toList();
        });
      }
    } catch (e) {
      // Ignore error
    }
    
    setState(() => _isLoadingHistory = false);
  }

  Future<void> _handleRedeem() async {
    if (_codeController.text.trim().isEmpty) {
      _showError('Please enter a redeem code');
      return;
    }

    setState(() => _isRedeeming = true);

    try {
      final response = await WalletService.redeemCode(_codeController.text.trim());

      if (!mounted) return;

      if (response['success'] == true) {
        final amount = response['data']?['amount'] ?? 0;
        
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle,
                    color: AppColors.success,
                    size: 32,
                  ),
                ),
                const SizedBox(width: 12),
                const Text('Success!'),
              ],
            ),
            content: Text(
              '₹${amount.toStringAsFixed(2)} has been added to your wallet',
              style: const TextStyle(fontSize: 16),
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.pop(context);
                },
                child: const Text('OK'),
              ),
            ],
          ),
        );

        _codeController.clear();
        await _loadRedeemHistory();
      } else {
        _showError(response['message'] ?? 'Invalid or expired code');
      }
    } catch (e) {
      _showError('Error: $e');
    }

    setState(() => _isRedeeming = false);
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppColors.error,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Redeem Code',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: AppColors.forestGreen,
        iconTheme: const IconThemeData(color: Colors.white),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          indicatorWeight: 3,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          labelStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
          unselectedLabelStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.normal,
          ),
          tabs: const [
            Tab(text: 'Redeem'),
            Tab(text: 'History'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildRedeemTab(),
          _buildHistoryTab(),
        ],
      ),
    );
  }
  
  Widget _buildRedeemTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon
          Center(
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.orange.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.redeem,
                size: 50,
                color: AppColors.orange,
              ),
            ),
          ),
          
          const SizedBox(height: 32),
          
          const Text(
            'Enter Redeem Code',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          
          const SizedBox(height: 8),
          
          const Text(
            'Enter your code below to redeem rewards',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Code Input
          TextField(
            controller: _codeController,
            textCapitalization: TextCapitalization.characters,
            decoration: InputDecoration(
              labelText: 'Redeem Code',
              hintText: 'Enter code here',
              prefixIcon: const Icon(Icons.code),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Redeem Button
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton(
              onPressed: _isRedeeming ? null : _handleRedeem,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.orange,
              ),
              child: _isRedeeming
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Redeem'),
            ),
          ),
          
          const SizedBox(height: 32),
          
          // Info Box
          Container(
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.info_outline,
                      color: AppColors.oceanBlue,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'How it works',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _buildInfoItem('1. Enter your redeem code in the field above'),
                _buildInfoItem('2. Tap the "Redeem" button'),
                _buildInfoItem('3. Amount will be added to your wallet instantly'),
                _buildInfoItem('4. Codes are case-insensitive and one-time use'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.check_circle_outline,
            size: 16,
            color: AppColors.success,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryTab() {
    if (_isLoadingHistory) {
      return const Center(child: CircularProgressIndicator());
    }
    
    if (_redeemHistory.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No redeem history',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }
    
    return RefreshIndicator(
      onRefresh: _loadRedeemHistory,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _redeemHistory.length,
        itemBuilder: (context, index) {
          final txn = _redeemHistory[index];
          final amount = (txn['amount'] ?? 0).toDouble();
          final description = txn['description']?.toString() ?? '';
          final date = txn['date']?.toString() ?? txn['created_at']?.toString() ?? '';
          
          // Extract code from description "Redeemed Code: MGOLD-1234"
          String code = '';
          if (description.contains(':')) {
            code = description.split(':').last.trim();
          }
          
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
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
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.check_circle,
                    color: AppColors.success,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        code.isNotEmpty ? code : 'Redeemed',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        date,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  '+₹${amount.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.success,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
