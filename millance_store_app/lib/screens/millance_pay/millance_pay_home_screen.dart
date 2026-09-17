import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../services/millance_pay_service.dart';
import '../../models/millance_pay_models.dart';
import 'millance_pay_chat_screen.dart';
import 'millance_pay_all_contacts_screen.dart';

class MillancePayHomeScreen extends StatefulWidget {
  const MillancePayHomeScreen({super.key});

  @override
  State<MillancePayHomeScreen> createState() => _MillancePayHomeScreenState();
}

class _MillancePayHomeScreenState extends State<MillancePayHomeScreen> {
  final _searchController = TextEditingController();
  List<MillancePayContact> _recentContacts = [];
  List<Map<String, dynamic>> _suggestedAccounts = [];
  bool _isLoading = true;
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    await Future.wait([
      _loadRecentContacts(),
      _loadSuggestedAccounts(),
    ]);

    setState(() => _isLoading = false);
  }

  Future<void> _loadRecentContacts() async {
    try {
      final response = await MillancePayService.getRecentContacts(limit: 5);

      if (response['success'] == true) {
        final data = response['data'];
        final List<dynamic> contacts = data['contacts'] ?? [];

        setState(() {
          _recentContacts = contacts
              .map((json) => MillancePayContact.fromJson(json))
              .toList();
        });
      }
    } catch (e) {
      print('Error loading recent contacts: $e');
    }
  }

  Future<void> _loadSuggestedAccounts() async {
    try {
      final response = await MillancePayService.getSuggestedAccounts();

      if (response['success'] == true) {
        final data = response['data'];
        final List<dynamic> accounts = data['accounts'] ?? [];

        setState(() {
          _suggestedAccounts = List<Map<String, dynamic>>.from(accounts);
        });
      }
    } catch (e) {
      print('Error loading suggested accounts: $e');
    }
  }

  Future<void> _searchUser() async {
    final phone = _searchController.text.trim();

    if (phone.isEmpty) {
      _showError('Please enter a phone number');
      return;
    }

    setState(() => _isSearching = true);

    try {
      final response = await MillancePayService.searchUser(phone);

      if (!mounted) return;

      setState(() => _isSearching = false);

      if (response['success'] == true) {
        final userData = response['data'];
        final user = MillancePayUser.fromJson(userData);

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => MillancePayChatScreen(
              phone: user.phone,
              name: user.name,
            ),
          ),
        );
      } else {
        _showError(response['message'] ?? 'User not found');
      }
    } catch (e) {
      setState(() => _isSearching = false);
      _showError('Error: $e');
    }
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
        title: const Text('Millance Pay'),
        backgroundColor: AppColors.forestGreen,
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
                    _buildSearchSection(),
                    const SizedBox(height: 24),
                    _buildRecentContactsSection(),
                    const SizedBox(height: 24),
                    _buildSuggestedAccountsSection(),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSearchSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Send Money',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _searchController,
            keyboardType: TextInputType.phone,
            decoration: InputDecoration(
              hintText: 'Enter phone number',
              prefixIcon: const Icon(Icons.phone, color: AppColors.forestGreen),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
            ),
            onSubmitted: (_) => _searchUser(),
          ),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: _isSearching ? null : _searchUser,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.forestGreen,
              ),
              child: _isSearching
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : const Text('Search'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentContactsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Recent Contacts',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            if (_recentContacts.isNotEmpty)
              TextButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const MillancePayAllContactsScreen(),
                    ),
                  );
                },
                child: const Text('View All'),
              ),
          ],
        ),
        const SizedBox(height: 12),
        if (_recentContacts.isEmpty)
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Column(
                children: [
                  Icon(
                    Icons.people_outline,
                    size: 48,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'No recent contacts',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ...(_recentContacts.map((contact) => _buildContactCard(contact))),
      ],
    );
  }

  Widget _buildContactCard(MillancePayContact contact) {
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
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.forestGreen.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              contact.name.isNotEmpty ? contact.name[0].toUpperCase() : 'U',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.forestGreen,
              ),
            ),
          ),
        ),
        title: Text(
          contact.name,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              contact.phone,
              style: TextStyle(
                fontSize: 13,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${contact.lastType == 'sent' ? 'Sent' : 'Received'} ₹${contact.lastAmount.toStringAsFixed(2)}',
              style: TextStyle(
                fontSize: 12,
                color: contact.lastType == 'sent'
                    ? AppColors.error
                    : AppColors.success,
              ),
            ),
          ],
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: AppColors.textSecondary,
        ),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => MillancePayChatScreen(
                phone: contact.phone,
                name: contact.name,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSuggestedAccountsSection() {
    if (_suggestedAccounts.isEmpty) return const SizedBox();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Suggested Accounts',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 12),
        ...(_suggestedAccounts.map((account) => _buildSuggestedCard(account))),
      ],
    );
  }

  Widget _buildSuggestedCard(Map<String, dynamic> account) {
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
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.oceanBlue.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: const Center(
            child: Icon(
              Icons.store,
              color: AppColors.oceanBlue,
              size: 24,
            ),
          ),
        ),
        title: Text(
          account['name'] ?? '',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              account['phone'] ?? '',
              style: TextStyle(
                fontSize: 13,
                color: Colors.grey[600],
              ),
            ),
            if (account['description'] != null) ...[
              const SizedBox(height: 4),
              Text(
                account['description'],
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ],
        ),
        trailing: const Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: AppColors.textSecondary,
        ),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => MillancePayChatScreen(
                phone: account['phone'],
                name: account['name'],
              ),
            ),
          );
        },
      ),
    );
  }
}
