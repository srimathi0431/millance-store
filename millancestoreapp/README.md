# Millance Store App 🛍️

<div align="center">

**A Complete Flipkart-Style E-Commerce Mobile Application**

[![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B?logo=flutter)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.0+-0175C2?logo=dart)](https://dart.dev)
[![Progress](https://img.shields.io/badge/Progress-85%25-success)](./PROGRESS.md)
[![License](https://img.shields.io/badge/License-Private-red)](./LICENSE)

*Built with ❤️ for Millance Store*

</div>

---

## 📱 About

Millancestoreapp is a feature-rich e-commerce mobile application built with Flutter, inspired by Flipkart's UI/UX while maintaining Millance Store's unique branding with a beautiful **Orange→Pink→Purple gradient** theme. The app includes **21 fully functional screens** covering the complete shopping experience from browsing to order tracking.

## ✨ Key Features

### 🛍️ Shopping Experience
- **Home Screen** with auto-carousel, categories, and trending products
- **Advanced Search** with filters (price, brand, discount, rating) and sorting
- **Product Detail** page with image carousel, specifications, and reviews
- **Shopping Cart** with quantity management, coupons, and price breakdown
- **Wishlist** for saving favorite products
- **Multiple Payment Methods**: UPI, Cards, Net Banking, Wallets, COD

### 📦 Order Management
- **Complete Checkout Flow**: Address → Payment → Confirmation
- **Order Tracking** with visual timeline (5 stages)
- **Order History** with Active/Completed tabs
- **Invoice Download** functionality

### 👤 User Features
- **Login/Sign Up** with phone number and OTP verification
- **Social Login** options (Google, Facebook)
- **Profile Management** with picture upload and personal info
- **Address Management** (Add/Edit/Delete/Set Default)
- **Notifications** with swipe to delete and mark as read

### 🎁 Rewards & Engagement
- **3-Tier Membership System**: Silver (Free), Gold (₹999/year), Platinum (₹1,999/year)
- **Coupons System** with Available/Used tabs and copy functionality
- **Help & Support** with FAQ, quick help (Chat/Call/Email/WhatsApp)

### 🎨 Design Highlights
- Consistent **gradient theme** throughout
- **Smooth animations** (FadeIn, SlideIn, ZoomIn)
- **Empty states** for all screens
- **Form validation** on all inputs
- **Beautiful UI** matching Flipkart's design language

---

## 📊 Project Status

**Completion: 85%**

### ✅ Completed (21 Screens)
1. Home Screen
2. Categories/Explore Screen
3. Product Detail Screen
4. Search Screen
5. Cart Screen
6. Address Selection Screen
7. Add/Edit Address Screen
8. Payment Screen
9. Order Confirmation Screen
10. Orders Screen
11. Order Detail Screen
12. Wishlist Screen
13. Addresses Management Screen
14. Membership Screen
15. Account Screen
16. Profile Edit Screen
17. Login Screen
18. OTP Verification Screen
19. Notifications Screen
20. Coupons Screen
21. Help & Support Screen

### 🚧 Remaining (15%)
- Shimmer loading states
- Product image zoom (pinch to zoom)
- Reviews submission form
- State management (Provider/Riverpod)
- API integration layer
- Unit & widget tests

---

## 🚀 Getting Started

### Prerequisites
- Flutter SDK `>=3.0.0`
- Dart SDK `>=3.0.0`
- Android Studio / VS Code
- Android Emulator or iOS Simulator

### Installation

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

```
lib/
├── main.dart                          # App entry point
├── theme/                             # Design system
│   ├── app_colors.dart               # Colors & gradients
│   └── app_theme.dart                # Material theme config
├── models/                            # Data models
│   ├── product.dart
│   ├── category.dart
│   └── cart_item.dart
├── data/                              # Mock data
│   └── mock_data.dart                # 3 banners, 8 categories, 5 products
├── widgets/                           # Reusable widgets
│   ├── main_shell.dart               # 5-tab bottom navigation
│   ├── search_bar_widget.dart
│   ├── category_card.dart
│   └── product_card.dart
└── screens/                           # All screens (21 total)
    ├── home/                         # Home screen
    ├── categories/                   # Categories screen
    ├── product/                      # Product detail
    ├── search/                       # Search with filters
    ├── cart/                         # Shopping cart
    ├── checkout/                     # Address, payment, confirmation
    │   ├── address_screen.dart
    │   ├── add_address_screen.dart
    │   ├── payment_screen.dart
    │   └── order_confirmation_screen.dart
    ├── orders/                       # Orders list & detail
    │   ├── orders_screen.dart
    │   └── order_detail_screen.dart
    ├── wishlist/                     # Wishlist screen
    ├── account/                      # Account & profile
    │   ├── account_screen.dart
    │   ├── profile_edit_screen.dart
    │   └── addresses_screen.dart
    ├── auth/                         # Login & OTP
    │   ├── login_screen.dart
    │   └── otp_verification_screen.dart
    ├── notifications/                # Notifications screen
    ├── coupons/                      # Coupons screen
    ├── membership/                   # Membership screen
    └── help/                         # Help & support
```

---

## 🎨 Design System

### Color Palette
```dart
Primary Orange:  #FF7A00
Primary Pink:    #FF4F81
Primary Purple:  #8B2BE2
Background:      #E3E6E6
Card:            #FFFFFF
Text Dark:       #0F1111
Text Gray:       #565959
Success:         #388E3C
```

### Gradients
- **Primary Gradient**: Orange → Pink → Purple
- **Orange-Pink Gradient**: Orange → Pink

### Typography
- **Font**: Poppins (Google Fonts)
- **Headers**: 18-24px, Bold
- **Body**: 14-16px, Regular
- **Captions**: 12-13px, Regular

### Components
- **Border Radius**: 8-12px
- **Elevation**: 0-4px
- **Spacing**: 4, 8, 12, 16, 20, 24px
- **Animations**: FadeIn, SlideIn, ZoomIn (300-800ms)

---

## 📦 Dependencies

```yaml
dependencies:
  flutter_sdk: ">=3.0.0"
  
  # Navigation
  go_router: ^14.7.1
  
  # UI & Animations
  animate_do: ^3.3.4
  carousel_slider: ^5.0.0
  smooth_page_indicator: ^1.2.0+3
  shimmer: ^3.0.0
  
  # Typography
  google_fonts: ^6.2.1
  
  # Media
  image_picker: ^1.1.2
  
  # Storage
  shared_preferences: ^2.3.3
  
  # Utilities
  url_launcher: ^6.3.1
  intl: ^0.19.0
  qr_flutter: ^4.1.0
```

---

## 🔗 Navigation Flow

```
Home → Product Detail → Cart → Address → Payment → Confirmation → Orders
  ↓
Notifications, Wishlist
  ↓
Account → Profile Edit, Addresses, Coupons, Membership, Help & Support
  ↓
Login → OTP Verification
```

**All 21 screens are interconnected with proper navigation!**

---

## 📸 Screenshots

*Screenshots will be added here once the app is built and tested on devices*

---

## 🎯 Roadmap

### Phase 1 - Core Development ✅ (COMPLETED)
- [x] All 21 screens implemented
- [x] Complete navigation flow
- [x] UI/UX matching Flipkart
- [x] Animations and transitions
- [x] Form validation
- [x] Mock data integration

### Phase 2 - Polish (In Progress)
- [ ] Add shimmer loading states
- [ ] Implement product image zoom
- [ ] Create reviews submission form
- [ ] Add more animations

### Phase 3 - Backend Integration (Planned)
- [ ] State management with Provider/Riverpod
- [ ] REST API integration
- [ ] User authentication with backend
- [ ] Real-time order updates
- [ ] Payment gateway integration

### Phase 4 - Testing & Launch (Planned)
- [ ] Unit tests
- [ ] Widget tests
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Beta testing
- [ ] Production release

---

## 📚 Documentation

- **[PROGRESS.md](./PROGRESS.md)** - Detailed development progress tracker
- **[COMPLETED_FEATURES.md](./COMPLETED_FEATURES.md)** - Complete list of all 21 screens and features
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Quick start guide, patterns, and best practices

---

## 🤝 Contributing

This is a private project for Millance Store. For any changes:
1. Review the existing code structure
2. Follow the established design patterns
3. Maintain consistent styling
4. Update documentation
5. Test thoroughly before committing

---

## 📝 License

**Private** - Millance Store © 2026

All rights reserved. This application is proprietary software developed exclusively for Millance Store.

---

## 👥 Credits

- **Design Inspiration**: Flipkart Android App
- **Branding**: Millance Store
- **Theme**: Orange→Pink→Purple Gradient
- **Typography**: Poppins (Google Fonts)
- **Framework**: Flutter & Dart

---

## 📞 Contact

For questions or support, contact the Millance Store development team.

---

<div align="center">

**Built with ❤️ using Flutter**

**Version**: 1.0.0-dev  
**Last Updated**: January 5, 2026  
**Status**: 85% Complete - MVP Ready! 🎉

[View Progress](./PROGRESS.md) • [Features List](./COMPLETED_FEATURES.md) • [Developer Guide](./DEVELOPER_GUIDE.md)

</div>
