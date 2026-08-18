import 'package:flutter/material.dart';
import 'package:animate_do/animate_do.dart';
import '../../theme/app_colors.dart';

class LanguageScreen extends StatefulWidget {
  const LanguageScreen({super.key});

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen> {
  String _selectedLanguage = 'English';

  final List<Map<String, String>> _languages = [
    {'name': 'English', 'native': 'English'},
    {'name': 'Hindi', 'native': 'हिंदी'},
    {'name': 'Tamil', 'native': 'தமிழ்'},
    {'name': 'Telugu', 'native': 'తెలుగు'},
    {'name': 'Kannada', 'native': 'ಕನ್ನಡ'},
    {'name': 'Malayalam', 'native': 'മലയാളം'},
    {'name': 'Bengali', 'native': 'বাংলা'},
    {'name': 'Marathi', 'native': 'मराठी'},
    {'name': 'Gujarati', 'native': 'ગુજરાતી'},
    {'name': 'Punjabi', 'native': 'ਪੰਜਾਬੀ'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Language'),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textDark,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Header
          FadeIn(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.language,
                    size: 60,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Choose Language',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Select your preferred language',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Language List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _languages.length,
              itemBuilder: (context, index) {
                final language = _languages[index];
                final isSelected = _selectedLanguage == language['name'];
                
                return FadeInUp(
                  delay: Duration(milliseconds: index * 50),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected
                            ? AppColors.primaryOrange
                            : AppColors.border,
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: RadioListTile<String>(
                      value: language['name']!,
                      groupValue: _selectedLanguage,
                      onChanged: (value) {
                        setState(() => _selectedLanguage = value!);
                      },
                      activeColor: AppColors.primaryOrange,
                      title: Text(
                        language['name']!,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: isSelected
                              ? FontWeight.w600
                              : FontWeight.normal,
                          color: AppColors.textDark,
                        ),
                      ),
                      subtitle: Text(
                        language['native']!,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppColors.textGray,
                        ),
                      ),
                      secondary: isSelected
                          ? Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                gradient: AppColors.primaryGradient,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(
                                Icons.check,
                                color: Colors.white,
                                size: 20,
                              ),
                            )
                          : null,
                    ),
                  ),
                );
              },
            ),
          ),

          // Save Button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: const Offset(0, -5),
                ),
              ],
            ),
            child: SafeArea(
              child: SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Language changed to $_selectedLanguage'),
                        backgroundColor: Colors.green,
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryOrange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Save Language',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
