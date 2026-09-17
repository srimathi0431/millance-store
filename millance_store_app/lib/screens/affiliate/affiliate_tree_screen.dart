import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../services/wallet_service.dart';

class AffiliateTreeScreen extends StatefulWidget {
  const AffiliateTreeScreen({super.key});

  @override
  State<AffiliateTreeScreen> createState() => _AffiliateTreeScreenState();
}

class _AffiliateTreeScreenState extends State<AffiliateTreeScreen> {
  bool _isLoading = true;
  Map<String, dynamic> _treeData = {};

  @override
  void initState() {
    super.initState();
    _loadTree();
  }

  Future<void> _loadTree() async {
    setState(() => _isLoading = true);

    try {
      final response = await WalletService.getAffiliateDashboard();
      
      if (response['success'] == true) {
        final dynamic data = response['data'];
        if (data is Map<String, dynamic>) {
          setState(() {
            _treeData = data;
          });
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(response['message'] ?? 'Failed to load tree')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }

    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Team Tree - 10 Levels'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _treeData.isEmpty
              ? const Center(
                  child: Text('No team members yet'),
                )
              : RefreshIndicator(
                  onRefresh: _loadTree,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: 10,
                    itemBuilder: (context, level) {
                      return _buildLevelCard(level + 1);
                    },
                  ),
                ),
    );
  }

  Widget _buildLevelCard(int level) {
    // Backend returns level_stats array with {level, user_count, order_count, earnings}
    final levelStats = _treeData['level_stats'];
    
    if (levelStats == null || levelStats is! List) {
      return _buildEmptyLevelCard(level);
    }
    
    // Find stats for this level
    final stats = (levelStats as List).firstWhere(
      (s) => s['level'] == level,
      orElse: () => {'level': level, 'user_count': 0, 'order_count': 0, 'earnings': 0.0},
    );
    
    final userCount = stats['user_count'] ?? 0;
    final orderCount = stats['order_count'] ?? 0;
    final earnings = (stats['earnings'] ?? 0).toDouble();
    
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
      child: ExpansionTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.forestGreen.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              'L$level',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: AppColors.forestGreen,
              ),
            ),
          ),
        ),
        title: Text(
          'Level $level',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        subtitle: Text(
          '$userCount member${userCount != 1 ? 's' : ''} • $orderCount order${orderCount != 1 ? 's' : ''}',
          style: const TextStyle(
            fontSize: 12,
            color: AppColors.textSecondary,
          ),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '₹${earnings.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: AppColors.success,
              ),
            ),
            const Text(
              'Earnings',
              style: TextStyle(
                fontSize: 10,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        children: [
          if (userCount > 0)
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStatRow('Total Members', '$userCount'),
                  const SizedBox(height: 8),
                  _buildStatRow('Total Orders', '$orderCount'),
                  const SizedBox(height: 8),
                  _buildStatRow('Total Earnings', '₹${earnings.toStringAsFixed(2)}'),
                ],
              ),
            )
          else
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                'No members in this level yet',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 14,
                ),
                textAlign: TextAlign.center,
              ),
            ),
        ],
      ),
    );
  }
  
  Widget _buildEmptyLevelCard(int level) {
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
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.grey.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                'L$level',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[600],
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
                  'Level $level',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  'No data available',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildStatRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}
