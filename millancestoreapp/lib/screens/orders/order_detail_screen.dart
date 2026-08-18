import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:shimmer/shimmer.dart';
import '../../theme/app_colors.dart';
import '../../models/order.dart';
import '../../services/api_service.dart';

final _fmt = NumberFormat.currency(locale: 'en_IN', symbol: '₹', decimalDigits: 0);

class OrderDetailScreen extends StatefulWidget {
  final int orderId;

  const OrderDetailScreen({super.key, required this.orderId});

  @override
  State<OrderDetailScreen> createState() => _OrderDetailScreenState();
}

class _OrderDetailScreenState extends State<OrderDetailScreen> {
  Order? _order;
  bool  _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    try {
      final data = await api.getOrderById(widget.orderId);
      setState(() { _order = Order.fromJson(data); _loading = false; });
    } catch (e) {
      setState(() { _error = 'Failed to load order.'; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(_order != null ? '#${_order!.orderNumber}' : 'Order Detail'),
        backgroundColor: Colors.white, elevation: 1,
        leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.pop(context)),
      ),
      body: _loading ? _buildShimmer() : _error != null ? _buildError() : _buildBody(),
    );
  }

  Widget _buildBody() {
    final o = _order!;
    return RefreshIndicator(
      onRefresh: _load,
      color: AppColors.primaryOrange,
      child: ListView(padding: const EdgeInsets.all(16), children: [

        // Status card
        _card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text('Order Status', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            _statusBadge(o.status, o.statusLabel),
          ]),
          if (o.trackingNumber != null) ...[
            const SizedBox(height: 12),
            Row(children: [
              const Icon(Icons.local_shipping_outlined, size: 18, color: AppColors.primaryOrange),
              const SizedBox(width: 8),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Tracking Number', style: TextStyle(fontSize: 12, color: AppColors.textGray)),
                Text(o.trackingNumber!,
                    style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryOrange)),
                if (o.courierName != null)
                  Text(o.courierName!, style: const TextStyle(fontSize: 12, color: AppColors.textGray)),
              ])),
            ]),
          ],
        ])),

        const SizedBox(height: 12),

        // Timeline
        if (o.history.isNotEmpty) ...[
          _card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Order Timeline', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 16),
            ...o.history.asMap().entries.map((entry) {
              final h     = entry.value;
              final isLast = entry.key == o.history.length - 1;
              return Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Column(children: [
                  Container(width: 12, height: 12,
                      decoration: BoxDecoration(
                          color: isLast ? AppColors.primaryOrange : Colors.green,
                          shape: BoxShape.circle)),
                  if (!isLast) Container(width: 2, height: 36, color: Colors.grey.shade300),
                ]),
                const SizedBox(width: 12),
                Expanded(child: Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(h.label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                    Text(DateFormat('dd MMM yyyy, hh:mm a').format(h.changedAt.toLocal()),
                        style: const TextStyle(fontSize: 12, color: AppColors.textGray)),
                    if (h.notes != null && h.notes!.isNotEmpty)
                      Text(h.notes!, style: const TextStyle(fontSize: 12, color: AppColors.textGray)),
                  ]),
                )),
              ]);
            }),
          ])),
          const SizedBox(height: 12),
        ],

        // Items
        _card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('Items (${o.items.length})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          ...o.items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(item.productName,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                Text('Qty: ${item.quantity} × ${_fmt.format(item.unitPrice)}',
                    style: const TextStyle(fontSize: 13, color: AppColors.textGray)),
              ])),
              Text(_fmt.format(item.totalPrice),
                  style: const TextStyle(fontWeight: FontWeight.bold)),
            ]),
          )),
        ])),

        const SizedBox(height: 12),

        // Pricing
        _card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('Price Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          _priceLine('Subtotal',  o.subtotal),
          if (o.discountAmount > 0) _priceLine('Discount', -o.discountAmount, color: Colors.green),
          if (o.taxAmount > 0)      _priceLine('Tax',       o.taxAmount),
          if (o.shippingAmount > 0) _priceLine('Shipping',  o.shippingAmount),
          const Divider(),
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            const Text('Total', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Text(_fmt.format(o.totalAmount),
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16,
                    color: AppColors.primaryOrange)),
          ]),
        ])),

        const SizedBox(height: 12),

        // Shipping address
        if (o.shippingAddress != null)
          _card(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Shipping Address', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            if (o.shippingName != null)
              Text(o.shippingName!, style: const TextStyle(fontWeight: FontWeight.w600)),
            if (o.shippingPhone != null)
              Text(o.shippingPhone!, style: const TextStyle(color: AppColors.textGray, fontSize: 13)),
            Text(o.shippingAddress!, style: const TextStyle(color: AppColors.textGray, fontSize: 13)),
          ])),

        const SizedBox(height: 24),

        // Actions
        if (o.canReturn)
          ElevatedButton.icon(
            onPressed: _requestReturn,
            icon: const Icon(Icons.assignment_return_outlined),
            label: const Text('Request Return'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              minimumSize: const Size(double.infinity, 48),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),

        const SizedBox(height: 80),
      ]),
    );
  }

  Widget _card({required Widget child}) => Container(
        margin: const EdgeInsets.only(bottom: 4),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04),
              blurRadius: 6, offset: const Offset(0, 2))],
        ),
        child: child,
      );

  Widget _priceLine(String label, double amount, {Color? color}) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(label, style: const TextStyle(color: AppColors.textGray)),
          Text(_fmt.format(amount.abs()),
              style: TextStyle(fontWeight: FontWeight.w600,
                  color: color ?? AppColors.textDark)),
        ]),
      );

  Widget _statusBadge(String status, String label) {
    const colors = {
      'DELIVERED':  Colors.green,
      'CANCELLED':  Colors.red,
      'RETURNED':   Colors.grey,
    };
    final color = colors[status] ?? AppColors.primaryOrange;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20)),
      child: Text(label,
          style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13)),
    );
  }

  Future<void> _requestReturn() async {
    final reason = await showDialog<String>(
      context: context,
      builder: (ctx) {
        final ctrl = TextEditingController();
        return AlertDialog(
          title: const Text('Request Return'),
          content: TextField(controller: ctrl,
              decoration: const InputDecoration(hintText: 'Reason for return'),
              maxLines: 3),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () => Navigator.pop(ctx, ctrl.text),
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryOrange),
              child: const Text('Submit'),
            ),
          ],
        );
      },
    );
    if (reason == null || reason.isEmpty) return;
    try {
      await api.requestReturn(_order!.id, reason);
      await _load();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Return request submitted'),
              backgroundColor: Colors.green));
      }
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to submit return'),
              backgroundColor: Colors.red));
      }
    }
  }

  Widget _buildShimmer() => Shimmer.fromColors(
        baseColor: Colors.grey.shade300,
        highlightColor: Colors.grey.shade100,
        child: ListView(padding: const EdgeInsets.all(16), children: [
          Container(height: 120, decoration: BoxDecoration(color: Colors.white,
              borderRadius: BorderRadius.circular(12))),
          const SizedBox(height: 12),
          Container(height: 200, decoration: BoxDecoration(color: Colors.white,
              borderRadius: BorderRadius.circular(12))),
        ]),
      );

  Widget _buildError() => Center(child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, size: 60, color: Colors.red),
          const SizedBox(height: 16),
          Text(_error!, style: const TextStyle(color: AppColors.textGray)),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: _load, child: const Text('Retry'),
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryOrange)),
        ],
      ));
}
