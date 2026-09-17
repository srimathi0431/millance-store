import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../config/app_colors.dart';
import '../../services/millance_pay_service.dart';
import '../../models/millance_pay_models.dart';
import 'millance_pay_pin_screen.dart';

class MillancePayChatScreen extends StatefulWidget {
  final String phone;
  final String name;

  const MillancePayChatScreen({
    super.key,
    required this.phone,
    required this.name,
  });

  @override
  State<MillancePayChatScreen> createState() => _MillancePayChatScreenState();
}

class _MillancePayChatScreenState extends State<MillancePayChatScreen> {
  final _amountController = TextEditingController();
  final _noteController = TextEditingController();
  final _scrollController = ScrollController();
  List<MillancePayTransaction> _transactions = [];
  bool _isLoading = true;
  int _currentPage = 1;
  int _totalPages = 1;
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _loadTransactions();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels == 0 && _hasMore && !_isLoading) {
      _loadMoreTransactions();
    }
  }

  Future<void> _loadTransactions({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _currentPage = 1;
        _transactions = [];
      });
    }

    setState(() => _isLoading = true);

    try {
      final response = await MillancePayService.getTransactionHistory(
        phone: widget.phone,
        page: _currentPage,
        pageSize: 20,
      );

      if (response['success'] == true) {
        final data = response['data'];
        final List<dynamic> transactionsJson = data['transactions'] ?? [];

        setState(() {
          if (refresh) {
            _transactions = transactionsJson
                .map((json) => MillancePayTransaction.fromJson(json))
                .toList();
          } else {
            _transactions.insertAll(
              0,
              transactionsJson
                  .map((json) => MillancePayTransaction.fromJson(json))
                  .toList(),
            );
          }
          _totalPages = data['total_pages'] ?? 1;
          _hasMore = _currentPage < _totalPages;
        });
      }
    } catch (e) {
      print('Error loading transactions: $e');
    }

    setState(() => _isLoading = false);
  }

  Future<void> _loadMoreTransactions() async {
    if (_currentPage < _totalPages) {
      setState(() => _currentPage++);
      await _loadTransactions();
    }
  }

  void _proceedToSend() {
    final amount = double.tryParse(_amountController.text);

    if (amount == null || amount <= 0) {
      _showError('Please enter a valid amount');
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => MillancePayPinScreen(
          recipientPhone: widget.phone,
          recipientName: widget.name,
          amount: amount,
          note: _noteController.text.isEmpty
              ? 'Payment to ${widget.name}'
              : _noteController.text,
        ),
      ),
    ).then((success) {
      if (success == true) {
        _amountController.clear();
        _noteController.clear();
        _loadTransactions(refresh: true);
      }
    });
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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.name),
            Text(
              widget.phone,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.forestGreen,
      ),
      body: Column(
        children: [
          Expanded(
            child: _transactions.isEmpty && _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _transactions.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.chat_bubble_outline,
                              size: 64,
                              color: Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No transactions yet',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Send money to start the conversation',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[500],
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: () => _loadTransactions(refresh: true),
                        child: ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          reverse: true,
                          itemCount: _transactions.length + (_hasMore ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == _transactions.length) {
                              return const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(16),
                                  child: Text(
                                    'Load older messages',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                ),
                              );
                            }

                            final transaction = _transactions[
                                _transactions.length - 1 - index];
                            return _buildTransactionBubble(transaction);
                          },
                        ),
                      ),
          ),
          _buildSendMoneySection(),
        ],
      ),
    );
  }

  Widget _buildTransactionBubble(MillancePayTransaction transaction) {
    final isSent = transaction.type == 'sent';
    final date = transaction.date != null
        ? DateTime.parse(transaction.date!)
        : DateTime.now();
    final formattedDate = DateFormat('MMM d, h:mm a').format(date);

    return Align(
      alignment: isSent ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.75,
        ),
        decoration: BoxDecoration(
          color: isSent
              ? AppColors.forestGreen.withOpacity(0.1)
              : Colors.white,
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
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isSent ? Icons.arrow_upward : Icons.arrow_downward,
                  size: 16,
                  color: isSent ? AppColors.error : AppColors.success,
                ),
                const SizedBox(width: 8),
                Text(
                  '₹${transaction.amount.toStringAsFixed(2)}',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: isSent ? AppColors.error : AppColors.success,
                  ),
                ),
              ],
            ),
            if (transaction.note != null && transaction.note!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                transaction.note!,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
            const SizedBox(height: 8),
            Text(
              formattedDate,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSendMoneySection() {
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
      child: SafeArea(
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _amountController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      hintText: 'Amount',
                      prefixText: '₹ ',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                SizedBox(
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _proceedToSend,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.forestGreen,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Send Money'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _noteController,
              decoration: InputDecoration(
                hintText: 'Add note (optional)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
