# Millancestoreapp - Developer Guide

## 🚀 Quick Start

### Prerequisites
- Flutter SDK >=3.0.0
- Dart >=3.0.0
- Android Studio or VS Code
- Android Emulator or iOS Simulator

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd "C:\Users\Srimathi\OneDrive\Desktop\Millance\millancestoreapp"
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

4. **Build for release**
   ```bash
   # Android
   flutter build apk --release
   
   # iOS
   flutter build ios --release
   ```

---

## 📁 Project Structure

### Core Directories

```
lib/
├── main.dart                    # App entry point
├── theme/                       # Design system
│   ├── app_colors.dart         # Colors & gradients
│   └── app_theme.dart          # Material theme
├── models/                      # Data models
│   ├── product.dart
│   ├── category.dart
│   └── cart_item.dart
├── data/                        # Mock data
│   └── mock_data.dart
├── widgets/                     # Reusable widgets
│   ├── main_shell.dart         # Bottom navigation
│   ├── search_bar_widget.dart
│   ├── category_card.dart
│   └── product_card.dart
└── screens/                     # All screens (21 total)
    ├── home/
    ├── categories/
    ├── product/
    ├── search/
    ├── cart/
    ├── checkout/
    ├── orders/
    ├── wishlist/
    ├── account/
    ├── auth/
    ├── notifications/
    ├── coupons/
    ├── membership/
    └── help/
```

---

## 🎨 Theme System

### Using Colors

```dart
import 'package:millancestoreapp/theme/app_colors.dart';

// Primary colors
AppColors.primaryOrange    // #FF7A00
AppColors.primaryPink      // #FF4F81
AppColors.primaryPurple    // #8B2BE2

// Background & Text
AppColors.background       // #E3E6E6
AppColors.textDark         // #0F1111
AppColors.textGray         // #565959

// Gradients
AppColors.primaryGradient      // Orange → Pink → Purple
AppColors.orangePinkGradient   // Orange → Pink

// Usage example
Container(
  decoration: BoxDecoration(
    gradient: AppColors.orangePinkGradient,
    borderRadius: BorderRadius.circular(12),
  ),
  child: Text('Hello'),
)
```

### Using Typography

```dart
import 'package:google_fonts/google_fonts.dart';

// The app uses Poppins font family
Text(
  'Hello World',
  style: GoogleFonts.poppins(
    fontSize: 16,
    fontWeight: FontWeight.w600,
  ),
)
```

---

## 🧩 Common Patterns

### Navigation

```dart
// Navigate to new screen
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => const TargetScreen(),
  ),
);

// Navigate with data
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => ProductDetailScreen(product: product),
  ),
);

// Go back
Navigator.pop(context);

// Go back to first route
Navigator.of(context).popUntil((route) => route.isFirst);
```

### Animations

```dart
import 'package:animate_do/animate_do.dart';

// Fade in from bottom
FadeInUp(
  duration: const Duration(milliseconds: 500),
  child: YourWidget(),
)

// Fade in from top
FadeInDown(
  duration: const Duration(milliseconds: 400),
  child: YourWidget(),
)

// Zoom in
ZoomIn(
  duration: const Duration(milliseconds: 600),
  child: YourWidget(),
)

// Slide in from left
SlideInLeft(
  duration: const Duration(milliseconds: 500),
  child: YourWidget(),
)
```

### Form Validation

```dart
final _formKey = GlobalKey<FormState>();

Form(
  key: _formKey,
  child: Column(
    children: [
      TextFormField(
        decoration: InputDecoration(
          labelText: 'Name',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter your name';
          }
          return null;
        },
      ),
      ElevatedButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            // Process data
          }
        },
        child: const Text('Submit'),
      ),
    ],
  ),
)
```

### Bottom Sheets

```dart
void _showBottomSheet(BuildContext context) {
  showModalBottomSheet(
    context: context,
    backgroundColor: Colors.transparent,
    isScrollControlled: true,
    builder: (context) => Container(
      height: MediaQuery.of(context).size.height * 0.7,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            child: const Text(
              'Title',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          // Content
          Expanded(
            child: ListView(
              children: [
                // Your content here
              ],
            ),
          ),
        ],
      ),
    ),
  );
}
```

### Dialogs

```dart
void _showDialog(BuildContext context) {
  showDialog(
    context: context,
    builder: (context) => AlertDialog(
      title: const Text('Title'),
      content: const Text('Message'),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            // Do something
            Navigator.pop(context);
          },
          child: const Text('Confirm'),
        ),
      ],
    ),
  );
}
```

---

## 🔧 Customization Guide

### Adding a New Screen

1. **Create screen file**
   ```dart
   // lib/screens/example/example_screen.dart
   import 'package:flutter/material.dart';
   import '../../theme/app_colors.dart';
   
   class ExampleScreen extends StatelessWidget {
     const ExampleScreen({super.key});
   
     @override
     Widget build(BuildContext context) {
       return Scaffold(
         appBar: AppBar(
           title: const Text('Example'),
           backgroundColor: Colors.white,
           elevation: 1,
         ),
         body: Container(
           // Your UI here
         ),
       );
     }
   }
   ```

2. **Add navigation**
   ```dart
   // In another screen
   Navigator.push(
     context,
     MaterialPageRoute(
       builder: (context) => const ExampleScreen(),
     ),
   );
   ```

### Adding Mock Data

```dart
// lib/data/mock_data.dart
class MockData {
  static final List<Product> products = [
    Product(
      id: 'new-id',
      name: 'New Product',
      category: 'Electronics',
      price: 1999,
      originalPrice: 2999,
      discountPercentage: 33,
      rating: 4.5,
      reviewsCount: 150,
      imageUrl: 'https://example.com/image.jpg',
      images: ['url1', 'url2'],
      description: 'Product description',
      highlights: ['Feature 1', 'Feature 2'],
      specifications: {'Brand': 'Brand Name'},
    ),
  ];
}
```

### Modifying Theme Colors

```dart
// lib/theme/app_colors.dart
class AppColors {
  // Change primary color
  static const Color primaryOrange = Color(0xFFFF7A00);  // Change here
  
  // Add new color
  static const Color customColor = Color(0xFF123456);
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Hot reload not working
**Solution:**
```bash
flutter clean
flutter pub get
flutter run
```

### Issue: Gradle build failed (Android)
**Solution:**
```bash
cd android
./gradlew clean
cd ..
flutter run
```

### Issue: CocoaPods error (iOS)
**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter run
```

### Issue: Image not loading
**Solution:**
- Check internet connection
- Verify image URL is valid
- Add internet permission in AndroidManifest.xml:
```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

### Issue: State not updating
**Solution:**
- Use StatefulWidget instead of StatelessWidget
- Call `setState(() {})` after updating state
```dart
setState(() {
  // Update state here
  counter++;
});
```

---

## 📝 Code Standards

### File Naming
- Use `snake_case` for file names
- Example: `product_detail_screen.dart`

### Class Naming
- Use `PascalCase` for class names
- Example: `ProductDetailScreen`

### Variable Naming
- Use `camelCase` for variables
- Example: `productName`, `isLoading`

### Constant Naming
- Use `camelCase` for constants
- Example: `const primaryColor = ...`

### Widget Structure
```dart
class MyWidget extends StatelessWidget {
  const MyWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      // Build UI
    );
  }
  
  // Private helper methods
  Widget _buildSection() {
    return Container();
  }
}
```

### Imports Order
```dart
// 1. Dart imports
import 'dart:async';

// 2. Flutter imports
import 'package:flutter/material.dart';

// 3. Package imports
import 'package:animate_do/animate_do.dart';

// 4. Project imports
import '../../theme/app_colors.dart';
import '../../models/product.dart';
```

---

## 🧪 Testing (To Be Implemented)

### Unit Tests
```dart
// test/models/product_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:millancestoreapp/models/product.dart';

void main() {
  group('Product Model', () {
    test('Should create product with correct data', () {
      final product = Product(
        id: '1',
        name: 'Test Product',
        price: 999,
        // ... other fields
      );
      
      expect(product.id, '1');
      expect(product.name, 'Test Product');
      expect(product.price, 999);
    });
  });
}
```

### Widget Tests
```dart
// test/widgets/product_card_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:millancestoreapp/widgets/product_card.dart';

void main() {
  testWidgets('ProductCard displays product name', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: ProductCard(product: mockProduct),
      ),
    );
    
    expect(find.text('Product Name'), findsOneWidget);
  });
}
```

---

## 📚 Resources

### Official Documentation
- [Flutter Docs](https://flutter.dev/docs)
- [Dart Docs](https://dart.dev/guides)

### Package Documentation
- [animate_do](https://pub.dev/packages/animate_do)
- [carousel_slider](https://pub.dev/packages/carousel_slider)
- [google_fonts](https://pub.dev/packages/google_fonts)
- [image_picker](https://pub.dev/packages/image_picker)
- [url_launcher](https://pub.dev/packages/url_launcher)

### Design Resources
- [Material Design](https://material.io/design)
- [Flutter Layout](https://flutter.dev/docs/development/ui/layout)

---

## 🤝 Contributing Guidelines

### Making Changes
1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit for review

### Commit Message Format
```
type: Brief description

Detailed description (if needed)

Examples:
- feat: Add product zoom functionality
- fix: Fix cart quantity update bug
- style: Update button styling
- docs: Update README
```

---

## 📞 Support

For technical questions or issues:
- Check PROGRESS.md for current status
- Review COMPLETED_FEATURES.md for feature list
- Check this guide for common patterns

---

**Happy Coding! 🚀**

Last Updated: January 5, 2026
Version: 1.0.0-dev
