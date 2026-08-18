import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<Map<String, dynamic>> notifications = [
    {
      'id': '1',
      'type': 'order',
      'icon': Icons.local_shipping,
      'color': Colors.orange,
      'title': 'Order Delivered',
      'message': 'Your order #ORD123456789 has been delivered successfully',
      'time': '2 hours ago',
      'isRead': false,
    },
    {
      'id': '2',
      'type': 'offer',
      'icon': Icons.local_offer,
      'color': Colors.green,
      'title': 'Special Offer!',
      'message': 'Get 50% off on your next purchase. Use code: SAVE50',
      'time': '5 hours ago',
      'isRead': false,
    },
    {
      'id': '3',
      'type': 'order',
      'icon': Icons.inventory,
      'color': Colors.blue,
      'title': 'Order Shipped',
      'message': 'Your order is on its way! Expected delivery by tomorrow',
      'time': '1 day ago',
      'isRead': true,
    },
    {
      'id': '4',
      'type': 'payment',
      'icon': Icons.payment,
      'color': Colors.purple,
      'title': 'Payment Successful',
      'message': 'Payment of ₹4,999 received successfully',
      'time': '2 days ago',
      'isRead': true,
    },
    {
      'id': '5',
      'type': 'wishlist',
      'icon': Icons.favorite,
      'color': Colors.red,
      'title': 'Price Drop Alert',
      'message': 'Product in your wishlist is now available at lower price',
      'time': '3 days ago',
      'isRead': true,
    },
    {
      'id': '6',
      'type': 'membership',
      'icon': Icons.workspace_premium,
      'color': AppColors.primaryOrange,
      'title': 'Membership Expiring Soon',
      'message': 'Your Gold membership expires in 7 days. Renew now!',
      'time': '4 days ago',
      'isRead': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final unreadCount = notifications.where((n) => !n['isRead']).length;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Notifications'),
            if (unreadCount > 0)
              Text(
                '$unreadCount unread',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.normal,
                  color: AppColors.textGray,
                ),
              ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        actions: [
          if (unreadCount > 0)
            TextButton(
              onPressed: () {
                setState(() {
                  for (var notification in notifications) {
                    notification['isRead'] = true;
                  }
                });
              },
              child: const Text('Mark all read'),
            ),
        ],
      ),
      body: notifications.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.only(top: 8),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                return FadeInUp(
                  duration: Duration(milliseconds: 300 + (index * 50)),
                  child: _buildNotificationCard(notifications[index], index),
                );
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(40),
            decoration: BoxDecoration(
              color: AppColors.lightGray,
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.notifications_off_outlined,
              size: 80,
              color: AppColors.textGray,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'No notifications',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'We\'ll notify you when something arrives',
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textGray,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification, int index) {
    final isRead = notification['isRead'] as bool;

    return Dismissible(
      key: Key(notification['id']),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        color: Colors.red,
        child: const Icon(
          Icons.delete,
          color: Colors.white,
          size: 28,
        ),
      ),
      onDismissed: (direction) {
        setState(() {
          notifications.removeAt(index);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Notification deleted'),
            duration: Duration(seconds: 2),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 1),
        color: isRead ? Colors.white : AppColors.primaryOrange.withOpacity(0.05),
        child: ListTile(
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 8,
          ),
          leading: Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: notification['color'].withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              notification['icon'],
              color: notification['color'],
              size: 24,
            ),
          ),
          title: Row(
            children: [
              Expanded(
                child: Text(
                  notification['title'],
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: isRead ? FontWeight.w600 : FontWeight.bold,
                  ),
                ),
              ),
              if (!isRead)
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: AppColors.primaryOrange,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 4),
              Text(
                notification['message'],
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.textGray,
                  height: 1.4,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),
              Text(
                notification['time'],
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textGray,
                ),
              ),
            ],
          ),
          onTap: () {
            setState(() {
              notification['isRead'] = true;
            });
            // Handle notification tap - navigate to relevant screen
            _handleNotificationTap(notification['type']);
          },
        ),
      ),
    );
  }

  void _handleNotificationTap(String type) {
    // Navigate to relevant screen based on notification type
    switch (type) {
      case 'order':
        // Navigate to orders screen
        break;
      case 'offer':
        // Navigate to home or offers screen
        break;
      case 'payment':
        // Navigate to payment history
        break;
      case 'wishlist':
        // Navigate to wishlist
        break;
      case 'membership':
        // Navigate to membership screen
        break;
    }
  }
}
