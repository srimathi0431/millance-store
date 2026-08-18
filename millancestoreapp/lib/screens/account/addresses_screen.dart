import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';
import '../checkout/add_address_screen.dart';

class AddressesScreen extends StatefulWidget {
  const AddressesScreen({super.key});

  @override
  State<AddressesScreen> createState() => _AddressesScreenState();
}

class _AddressesScreenState extends State<AddressesScreen> {
  List<Map<String, String>> addresses = [
    {
      'name': 'Home',
      'address': '123, Main Street, Anna Nagar',
      'city': 'Chennai',
      'state': 'Tamil Nadu',
      'pincode': '600001',
      'phone': '+91 98765 43210',
      'isDefault': 'true',
    },
    {
      'name': 'Office',
      'address': '456, Park Avenue, T Nagar',
      'city': 'Chennai',
      'state': 'Tamil Nadu',
      'pincode': '600017',
      'phone': '+91 98765 43210',
      'isDefault': 'false',
    },
    {
      'name': 'Other',
      'address': '789, Beach Road, Besant Nagar',
      'city': 'Chennai',
      'state': 'Tamil Nadu',
      'pincode': '600090',
      'phone': '+91 98765 43210',
      'isDefault': 'false',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Addresses'),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Add New Address Button
          FadeInDown(
            duration: const Duration(milliseconds: 300),
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const AddAddressScreen(),
                  ),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.primaryOrange,
                    width: 2,
                    style: BorderStyle.solid,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: AppColors.orangePinkGradient,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.add,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Text(
                      'Add New Address',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryOrange,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Saved Addresses Title
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8),
            child: Text(
              'Saved Addresses',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),
          ),

          // Address Cards
          ...List.generate(
            addresses.length,
            (index) => FadeInUp(
              duration: Duration(milliseconds: 300 + (index * 100)),
              child: _buildAddressCard(addresses[index], index),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAddressCard(Map<String, String> address, int index) {
    final isDefault = address['isDefault'] == 'true';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDefault ? AppColors.primaryOrange : AppColors.border,
          width: isDefault ? 2 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.lightGray,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  address['name'] == 'Home'
                      ? Icons.home
                      : address['name'] == 'Office'
                          ? Icons.work
                          : Icons.location_on,
                  color: AppColors.primaryOrange,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                address['name']!,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 8),
              if (isDefault)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'DEFAULT',
                    style: TextStyle(
                      fontSize: 10,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '${address['address']}, ${address['city']}, ${address['state']} - ${address['pincode']}',
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textDark,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Mobile: ${address['phone']}',
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textGray,
            ),
          ),
          const Divider(height: 24),
          Row(
            children: [
              Expanded(
                child: TextButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const AddAddressScreen(isEdit: true),
                      ),
                    );
                  },
                  icon: const Icon(Icons.edit, size: 18),
                  label: const Text('Edit'),
                  style: TextButton.styleFrom(
                    foregroundColor: AppColors.primaryOrange,
                  ),
                ),
              ),
              Container(
                width: 1,
                height: 20,
                color: AppColors.border,
              ),
              Expanded(
                child: TextButton.icon(
                  onPressed: () {
                    _showDeleteDialog(index);
                  },
                  icon: const Icon(Icons.delete, size: 18),
                  label: const Text('Delete'),
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.red,
                  ),
                ),
              ),
              if (!isDefault) ...[
                Container(
                  width: 1,
                  height: 20,
                  color: AppColors.border,
                ),
                Expanded(
                  child: TextButton.icon(
                    onPressed: () {
                      _setAsDefault(index);
                    },
                    icon: const Icon(Icons.check_circle, size: 18),
                    label: const Text('Set Default'),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.green,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(int index) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Address'),
        content: const Text('Are you sure you want to delete this address?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                addresses.removeAt(index);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Address deleted'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            child: const Text(
              'Delete',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }

  void _setAsDefault(int index) {
    setState(() {
      // Remove default from all
      for (var address in addresses) {
        address['isDefault'] = 'false';
      }
      // Set current as default
      addresses[index]['isDefault'] = 'true';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Default address updated'),
        backgroundColor: Colors.green,
      ),
    );
  }
}
