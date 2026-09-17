import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../services/millance_pay_service.dart';
import '../../models/millance_pay_models.dart';
import 'millance_pay_chat_screen.dart';

class MillancePayAllContactsScreen extends StatefulWidget {
  const MillancePayAllContactsScreen({super.key});

  @override
  State<MillancePayAllContactsScreen> createState() => _MillancePayAllContactsScreenState();
}

class _MillancePayAllContactsScreenState extends State<MillancePayAllContactsScreen> {
  List<MillancePayContact> _contacts = [];
  bool _isLoading = false;
  int _currentPage = 1;
  int _totalPages = 1;
  final int _pageSize = 20;

  @override
  void initState() {
    super.initState();
    _loadContacts();
  }

  Future<void> _loadContacts({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _currentPage = 1;
        _contacts = [];
      });
    }

    setState(() => _isLoading = true);

    try {
      final response = await MillancePayService.getAllContacts(
        page: _currentPage,
        pageSize: _pageSize,
      );

      if (response['success'] == true) {
        final data = response['data'];
        final List<dynamic> contactsJson = data['contacts'] ?? [];

        setState(() {
          if (refresh) {
            _contacts = contactsJson
                .map((json) => MillancePayContact.fromJson(json))
                .toList();
          } else {
            _contacts.addAll(
              contactsJson.map((json) => MillancePayContact.fromJson(json)),
            );
          }
          _totalPages = data['total_pages'] ?? 1;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }

    setState(() => _isLoading = false);
  }

  void _loadNextPage() {
    if (_currentPage < _totalPages && !_isLoading) {
      setState(() => _currentPage++);
      _loadContacts();
    }
  }

  void _loadPreviousPage() {
    if (_currentPage > 1 && !_isLoading) {
      setState(() => _currentPage--);
      _loadContacts(refresh: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('All Contacts'),
        backgroundColor: AppColors.forestGreen,
      ),
      body: _contacts.isEmpty && _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: () => _loadContacts(refresh: true),
                    child: _contacts.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.people_outline,
                                  size: 64,
                                  color: Colors.grey[400],
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'No contacts yet',
                                  style: TextStyle(
                                    fontSize: 16,
                                    color: Colors.grey[600],
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _contacts.length,
                            itemBuilder: (context, index) {
                              return _buildContactCard(_contacts[index]);
                            },
                          ),
                  ),
                ),
                if (_totalPages > 1) _buildPaginationControls(),
              ],
            ),
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

  Widget _buildPaginationControls() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          ElevatedButton(
            onPressed: _currentPage > 1 && !_isLoading ? _loadPreviousPage : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.forestGreen,
            ),
            child: const Text('Previous'),
          ),
          Text(
            'Page $_currentPage of $_totalPages',
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          ElevatedButton(
            onPressed: _currentPage < _totalPages && !_isLoading ? _loadNextPage : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.forestGreen,
            ),
            child: const Text('Next'),
          ),
        ],
      ),
    );
  }
}
