import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../services/wallet_service.dart';

class UnilevelTreeScreen extends StatefulWidget {
  const UnilevelTreeScreen({super.key});

  @override
  State<UnilevelTreeScreen> createState() => _UnilevelTreeScreenState();
}

class _UnilevelTreeScreenState extends State<UnilevelTreeScreen> {
  bool _isLoading = true;
  Map<int, List<Map<String, dynamic>>> _levelData = {};
  Map<int, bool> _expandedLevels = {};

  @override
  void initState() {
    super.initState();
    _loadAllLevels();
  }

  Future<void> _loadAllLevels() async {
    setState(() => _isLoading = true);

    try {
      Map<int, List<Map<String, dynamic>>> tempData = {};
      
      for (int level = 1; level <= 10; level++) {
        final response = await WalletService.getLevelDetails(level);
        
        if (response['success'] == true) {
          final dynamic data = response['data'];
          if (data is Map<String, dynamic>) {
            final users = data['users'] as List? ?? [];
            tempData[level] = users.cast<Map<String, dynamic>>();
          }
        }
      }

      setState(() {
        _levelData = tempData;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading tree: $e')),
        );
      }
    }

    setState(() => _isLoading = false);
  }

  int _getTotalUsers() {
    int total = 0;
    _levelData.forEach((level, users) {
      total += users.length;
    });
    return total;
  }

  double _getTotalEarnings() {
    double total = 0.0;
    _levelData.forEach((level, users) {
      for (var user in users) {
        total += (user['total_earned'] as num?)?.toDouble() ?? 0.0;
      }
    });
    return total;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Unilevel Team Tree'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppColors.forestGreen,
                        AppColors.forestGreen.withOpacity(0.8),
                      ],
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: _buildSummaryCard(
                          'Total Team',
                          '${_getTotalUsers()}',
                          Icons.people,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildSummaryCard(
                          'Total Earnings',
                          '₹${_getTotalEarnings().toStringAsFixed(2)}',
                          Icons.account_balance_wallet,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadAllLevels,
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: 10,
                      itemBuilder: (context, index) {
                        final level = index + 1;
                        return _buildLevelSection(level);
                      },
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildSummaryCard(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.white70,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildLevelSection(int level) {
    final users = _levelData[level] ?? [];
    final isExpanded = _expandedLevels[level] ?? false;
    
    double levelEarnings = 0.0;
    double totalSpent = 0.0;
    
    for (var user in users) {
      levelEarnings += (user['total_earned'] as num?)?.toDouble() ?? 0.0;
      totalSpent += (user['total_spent'] as num?)?.toDouble() ?? 0.0;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
          InkWell(
            onTap: () {
              if (users.isNotEmpty) {
                setState(() {
                  _expandedLevels[level] = !isExpanded;
                });
              }
            },
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppColors.millanceOrange.withOpacity(0.2),
                          AppColors.millancePurple.withOpacity(0.2),
                        ],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        'L$level',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.millancePurple,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Level $level',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${users.length} member${users.length != 1 ? 's' : ''} • ₹${totalSpent.toStringAsFixed(2)} spent',
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '₹${levelEarnings.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.success,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Your Earnings',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 8),
                  if (users.isNotEmpty)
                    Icon(
                      isExpanded ? Icons.expand_less : Icons.expand_more,
                      color: AppColors.textSecondary,
                    ),
                ],
              ),
            ),
          ),
          if (isExpanded && users.isNotEmpty)
            Container(
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(
                    color: AppColors.textSecondary.withOpacity(0.1),
                    width: 1,
                  ),
                ),
              ),
              child: Column(
                children: users.map((user) => _buildUserCard(user, level)).toList(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildUserCard(Map<String, dynamic> user, int level) {
    final username = user['username'] ?? 'Unknown';
    final name = user['name'] ?? username;
    final orderCount = user['order_count'] ?? 0;
    final totalSpent = (user['total_spent'] as num?)?.toDouble() ?? 0.0;
    final totalEarned = (user['total_earned'] as num?)?.toDouble() ?? 0.0;

    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.only(left: 16, right: 16, bottom: 12, top: 12),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: AppColors.millanceOrange.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 45,
                height: 45,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppColors.millanceOrange,
                      AppColors.millanceRed,
                    ],
                  ),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    name[0].toUpperCase(),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '@$username',
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              children: [
                _buildUserStatRow(
                  'Orders Placed',
                  '$orderCount',
                  Icons.shopping_bag_outlined,
                  AppColors.oceanBlue,
                ),
                const Divider(height: 20),
                _buildUserStatRow(
                  'Total Spent',
                  '₹${totalSpent.toStringAsFixed(2)}',
                  Icons.payments_outlined,
                  AppColors.millanceOrange,
                ),
                const Divider(height: 20),
                _buildUserStatRow(
                  'Your Earnings',
                  '₹${totalEarned.toStringAsFixed(2)}',
                  Icons.account_balance_wallet_outlined,
                  AppColors.success,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserStatRow(String label, String value, IconData icon, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
            ),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}
