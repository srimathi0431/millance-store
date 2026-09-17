# Millance Store - Mobile App

A complete e-commerce mobile application built with Flutter for Android and iOS.

## 🚀 Quick Start

```bash
# Navigate to project directory
cd "c:\Techneysoft apps\millancegold\millance-store\millance_store_app"

# Install dependencies
flutter pub get

# Run the app
flutter run

# Build release APK
flutter build apk --release
```

## ✨ Features

### 🛍️ Shopping
- Browse products with images
- Search and filter by category
- Product details with quantity selector
- Add to cart
- Cart management (update, remove)
- Checkout with multiple payment methods

### 💳 Payments
- Cash on Delivery (COD)
- Online Payment
- Millance Store Wallet
- QR Scan & Pay with camera
- 4-digit Wallet PIN security

### 💰 Wallet
- 3 wallet types (Store, Income, Promo)
- Transaction history
- Redeem promotional codes
- QR Payment history
- Real-time balance updates

### 👥 Affiliate Program
- Referral code & link generation
- WhatsApp sharing
- 10-level team tree
- Direct referrals list
- Income history tracking
- Copy referral code/link

### 📦 Orders
- Order history with filters
- Order details with tracking
- Status tracking
- Payment information
- Shipping details

### 👤 Profile
- User information display
- Wallet balances overview
- Affiliate program access
- Logout functionality

## 🎨 Design

- **Colors:** Forest Green (#234437), Ocean Blue (#1E40AF), Orange (#FF7A00)
- **Style:** Material Design 3
- **UI:** Professional, mobile-first, responsive
- **Theme:** Clean, modern, user-friendly

## 🔧 Technical Stack

- **Framework:** Flutter 3.5.0+
- **State Management:** Provider
- **API Client:** HTTP & Dio
- **Storage:** SharedPreferences
- **Camera:** qr_code_scanner
- **Images:** image_picker, cached_network_image
- **Sharing:** share_plus
- **URL Launcher:** url_launcher
- **Date Formatting:** intl

## 📱 Permissions

### Android
- Internet access
- Camera (QR scanning)
- Photo library (QR upload)
- Network state

### iOS
- Camera access
- Photo library access
- Internet access

## 🌐 Backend API

- **URL:** https://millance.store
- **Endpoints:** RESTful API
- **Authentication:** JWT Bearer tokens
- **Format:** JSON

## 📂 Project Structure

```
lib/
├── config/          # App configuration (colors, theme, API)
├── models/          # Data models
├── providers/       # State management
├── services/        # API services
├── screens/         # UI screens
│   ├── auth/        # Login, Register
│   ├── home/        # Products, Details
│   ├── cart/        # Shopping cart
│   ├── checkout/    # Checkout flow
│   ├── wallet/      # Wallet features
│   ├── orders/      # Order history
│   ├── affiliate/   # Referral program
│   └── profile/     # User profile
└── main.dart        # App entry point
```

## 🏗️ Build Instructions

### Android APK
```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle
```bash
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS
```bash
flutter build ios --release
# Then open ios/Runner.xcworkspace in Xcode
```

## 🧪 Testing

```bash
# Run tests
flutter test

# Analyze code
flutter analyze

# Check for issues
flutter doctor
```

## 📝 Environment

- **Minimum Android:** 5.0 (API 21)
- **Target Android:** 14.0 (API 34)
- **iOS:** 12.0+
- **Flutter:** 3.5.0+
- **Dart:** 3.5.0+

## 🔐 Security

- JWT token-based authentication
- Secure PIN storage (4-digit wallet PIN)
- HTTPS API communication
- Input validation
- Error handling

## 🌟 Key Highlights

✅ Native mobile app (NOT web view)
✅ Professional UI/UX design
✅ Real backend integration
✅ Hardware back button support
✅ Camera QR scanning
✅ WhatsApp deep linking
✅ Offline data caching
✅ Pull-to-refresh
✅ Loading states
✅ Error handling
✅ Form validation

## 📖 Documentation

- See `PERMISSIONS_AND_SETUP.md` for detailed setup instructions
- Check `pubspec.yaml` for dependencies
- Review code comments for implementation details

## 🤝 Development

1. Clone the repository
2. Install Flutter SDK
3. Run `flutter pub get`
4. Connect device or start emulator
5. Run `flutter run`

## 📞 Support

For technical issues:
- Check Flutter logs: `flutter logs`
- Check device logs: `adb logcat` (Android)
- Verify backend: `curl https://millance.store/api/customer/products`

## 📄 License

Proprietary - Millance Store

---

**Version:** 1.0.0
**Last Updated:** 2026
**Status:** Production Ready ✅
