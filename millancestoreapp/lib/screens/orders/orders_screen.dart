import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import 'package:shimmer/shimmer.dart';
import 'package:intl/intl.dart';
import '../../theme/app_colors.dart';
import '../../models/order.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../auth/login_screen.dart';
import 'order_detail_screen.dart';

final _fmt = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tab;

  List<Order> _activeOrders    = [];
  List<Order> _completedOrders = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 2, vsync: this);
    _loadOrders();
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  Future<void> _loadOrders() async {
    if (!authService.isLoggedIn) {
      setState(() { _loading = false; });
      return;
    }
    setState(() { _loading = true; _error = null; });
    try {
      final data = await api.getOrders(pageSize: 50);
      final items = (data['items'] as List)
          .map((e) => Order.fromJson(e as Map<String, dynamic>))
          .toList();

      final active    = items.where((o) => o.isActive).toList();
      final completed = items.where((o) => !o.isActive).toList();

      setState(() {
        _activeOrders    = active;
        _completedOrders = completed;
        _loading         = false;
      });
    } catch (e) {
      setState(() {
        _error   = 'Failed to load orders. Pull to refresh.';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!authService.isLoggedIn) {
      return Scaffold(
        appBar: AppBar(title: const Text('My Orders'), backgroundColor: Colors.white, elevation: 1),
        body: Center(
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            const Icon(Icons.shopping_bag_outlined, size: 80, color: AppColors.textGray),
            const SizedBox(height: 16),
            const Text('Please log in to view orders',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const LoginScreen())),
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryOrange),
              child: const Text('Login', style: TextStyle(color: Colors.white)),
            ),
          ]),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Orders'),
        backgroundColor: Colors.white,
        elevation: 1,
        bottom: TabBar(
          controller: _tab,
          indicatorColor: AppColors.primaryOrange,
          labelColor: AppColors.primaryOrange,
          unselectedLabelColor: AppColors.textGray,
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          tabs: [
            Tab(text: 'Active (${_activeOrders.length})'),
            Tab(text: 'Completed (${_completedOrders.length})'),
          ],
        ),
      ),
      body: _loading
          ? _buildShimmer()
          : _error != null
              ? _buildError()
              : RefreshIndicator(
                  onRefresh: _loadOrders,
                  color: AppColors.primaryOrange,
                  child: TabBarView(
                    controller: _tab,
                    children: [
                      _buildList(_activeOrders, isActive: true),
                      _buildList(_completedOrders, isActive: false),
                    ],
                  ),
                ),
    );
  }

  Widget _buildList(List<Order> orders, {required bool isActive}) {
    if (orders.isEmpty) {
      return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Container(
            padding: const EdgeInsets.all(40),
            decoration: BoxDecoration(color: AppColors.lightGray, shape: BoxShape.circle),
            child: Icon(Icons.shopping_bag_outlined, size: 80, color: AppColors.textGray),
          ),
          const SizedBox(height: 24),
          Text(isActive ? 'No active orders' : 'No completed orders',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Your orders will appear here',
              style: TextStyle(fontSize: 14, color: AppColors.textGray)),
        ]),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (_, i) => FadeInUp(
        duration: Duration(milliseconds: 300 + (i * 80)),
        child: _buildCard(orders[i], isActive: isActive),
      ),
    );
  }

  Widget _buildCard(Order order, {required bool isActive}) {
    final statusColor = _statusColor(order.status);
    return GestureDetector(
      onTap: () => Navigator.push(context,
          MaterialPageRoute(builder: (_) => OrderDetailScreen(orderId: order.id))),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05),
              blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('#${order.orderNumber}',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Text(order.statusLabel,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: statusColor)),
            ),
          ]),
          const SizedBox(height: 4),
          Text(DateFormat('dd MMM yyyy').format(order.createdAt),
              style: const TextStyle(fontSize: 12, color: AppColors.textGray)),
          const Divider(height: 24),

          Row(children: [
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${order.itemCount} item${order.itemCount != 1 ? "s" : ""}',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(_fmt.format(order.totalAmount),
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                if (order.trackingNumber != null)
                  Text('Tracking: ${order.trackingNumber}',
                      style: const TextStyle(fontSize: 12, color: AppColors.primaryOrange,
                          fontWeight: FontWeight.w600)),
                if (order.deliveredAt != null)
                  Text('Delivered on ${DateFormat("dd MMM yyyy").format(order.deliveredAt!)}',
                      style: const TextStyle(fontSize: 12, color: Colors.green,
                          fontWeight: FontWeight.w600)),
              ]),
            ),
          ]),
          const SizedBox(height: 16),

          Row(children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => Navigator.push(context,
                    MaterialPageRoute(builder: (_) => OrderDetailScreen(orderId: order.id))),
                style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.primaryOrange),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                child: Text(isActive ? 'Track Order' : 'View Details',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600,
                        color: AppColors.primaryOrange)),
              ),
            ),
            if (!isActive) ...[
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryOrange,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
                  child: const Text('Reorder',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.white)),
                ),
              ),
            ],
          ]),
        ]),
      ),
    );
  }

  Widget _buildShimmer() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 3,
      itemBuilder: (_, __) => Shimmer.fromColors(
        baseColor: Colors.grey.shade300,
        highlightColor: Colors.grey.shade100,
        child: Container(
          height: 180, margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  Widget _buildError() {
    return Center(child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      const Icon(Icons.error_outline, size: 60, color: Colors.red),
      const SizedBox(height: 16),
      Text(_error!, style: const TextStyle(fontSize: 16, color: AppColors.textGray)),
      const SizedBox(height: 16),
      ElevatedButton.icon(
        onPressed: _loadOrders,
        icon: const Icon(Icons.refresh),
        label: const Text('Retry'),
        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryOrange),
      ),
    ]));
  }

  Color _statusColor(String status) {
    const map = {
      'PENDING':          Colors.orange,
      'CONFIRMED':        Colors.blue,
      'PROCESSING':       Colors.purple,
      'PACKED':           Colors.blue,
      'SHIPPED':          Colors.orange,
      'OUT_FOR_DELIVERY': Colors.orange,
      'DELIVERED':        Colors.green,
      'CANCELLED':        Colors.red,
      'RETURN_REQUESTED': Colors.orange,
      'RETURNED':         Colors.grey,
    };
    return map[status] ?? Colors.grey;
  }
}
