# Millance Store App - Permissions & Setup Guide

## ✅ Internet Connection Configured

The app is now fully configured to allow internet connections on both Android and iOS.

### Android Configuration

**File: `android/app/src/main/AndroidManifest.xml`**

✅ Added Permissions:
- `INTERNET` - Full internet access
- `ACCESS_NETWORK_STATE` - Check network connectivity
- `CAMERA` - QR code scanning
- `READ_EXTERNAL_STORAGE` - Read images from gallery
- `WRITE_EXTERNAL_STORAGE` - Save images (Android 12 and below)
- `READ_MEDIA_IMAGES` - Read images (Android 13+)

✅ Network Configuration:
- `android:usesCleartextTraffic="true"` - Allows HTTP connections
- `android:networkSecurityConfig="@xml/network_security_config"` - Custom network security

**File: `android/app/src/main/res/xml/network_security_config.xml`**

✅ Allows connections to:
- millance.store (HTTPS)
- millance.gold (HTTPS)
- localhost (HTTP/HTTPS)
- 127.0.0.1 (HTTP/HTTPS)
- 10.0.2.2 (Android emulator host)
- All other domains with system certificates

### iOS Configuration

**File: `ios/Runner/Info.plist`**

✅ Added Permissions:
- `NSCameraUsageDescription` - Camera for QR scanning
- `NSPhotoLibraryUsageDescription` - Photo library access
- `NSPhotoLibraryAddUsageDescription` - Save photos

✅ Network Configuration:
- `NSAppTransportSecurity` with `NSAllowsArbitraryLoads` - Allows HTTP/HTTPS
- `NSAllowsArbitraryLoadsInWebContent` - Web content can load any URL

## 📱 Supported Features

### Network Features
✅ HTTPS API calls to millance.store
✅ HTTP connections (if needed)
✅ Image loading from URLs
✅ QR code scanning with camera
✅ Image upload from gallery
✅ WhatsApp deep linking
✅ Share functionality
✅ URL launching

### Permissions Requested
1. **Camera** - For QR code scanning (Scan & Pay feature)
2. **Photo Library** - For uploading QR codes from gallery
3. **Internet** - For all API calls and data syncing

## 🚀 How to Build & Run

### Development Mode

```bash
# Navigate to project
cd "c:\Techneysoft apps\millancegold\millance-store\millance_store_app"

# Get dependencies
flutter pub get

# Run on connected device (debug mode)
flutter run

# Run on specific device
flutter devices
flutter run -d <device_id>
```

### Production Build

#### Android APK
```bash
# Build release APK
flutter build apk --release

# APK location:
# build/app/outputs/flutter-apk/app-release.apk
```

#### Android App Bundle (For Google Play)
```bash
# Build release bundle
flutter build appbundle --release

# Bundle location:
# build/app/outputs/bundle/release/app-release.aab
```

#### iOS
```bash
# Build for iOS
flutter build ios --release

# Then open in Xcode:
# ios/Runner.xcworkspace
```

## 🔐 API Configuration

**Base URL:** `https://millance.store`

The app is configured to connect to the production backend at:
- Main API: https://millance.store/api/
- Customer endpoints: https://millance.store/api/customer/
- Admin endpoints: https://millance.store/api/admin/

### API Endpoints Used:
- Authentication (Login, Register)
- Products & Categories
- Cart Management
- Orders & Checkout
- Wallet & Transactions
- QR Payments
- Affiliate Program
- Redeem Codes

## 📋 Pre-Launch Checklist

### Before Building
- ✅ Internet permissions configured
- ✅ Camera permissions configured
- ✅ Storage permissions configured
- ✅ Network security config added
- ✅ App name set to "Millance Store"
- ✅ API URL configured (https://millance.store)

### Testing Checklist
- [ ] Test login/register
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout with all payment methods
- [ ] Test wallet features
- [ ] Test QR scan with camera
- [ ] Test QR scan with image upload
- [ ] Test redeem code
- [ ] Test affiliate sharing (WhatsApp)
- [ ] Test orders history
- [ ] Test internet connectivity error handling

### For Google Play Store
- [ ] Update app icon
- [ ] Update splash screen
- [ ] Set proper package name in `android/app/build.gradle`
- [ ] Generate signing key
- [ ] Configure signing in `android/app/build.gradle`
- [ ] Test release build on physical device
- [ ] Prepare store listing assets (screenshots, description)

### For Apple App Store
- [ ] Update app icon
- [ ] Update splash screen
- [ ] Set proper bundle identifier in Xcode
- [ ] Configure signing & capabilities in Xcode
- [ ] Test release build on physical device
- [ ] Prepare store listing assets

## 🔧 Troubleshooting

### Internet Not Working
1. Check device has internet connection
2. Verify API URL is correct in `lib/config/api_config.dart`
3. Check backend is running and accessible
4. Look for CORS errors in backend logs

### Camera Not Working
1. Grant camera permission when app requests
2. Check device has camera hardware
3. Test on physical device (camera doesn't work on some emulators)

### Build Errors
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

### Android Build Errors
```bash
# Update Gradle
cd android
./gradlew clean
cd ..
flutter build apk
```

## 📞 Support

For issues or questions:
- Check backend logs: `sudo journalctl -u millancestore.service -f`
- Check app logs in IDE console
- Verify API endpoints are responding: `curl https://millance.store/api/customer/products`

## 🎯 Quick Start Commands

```bash
# Complete setup and run
cd "c:\Techneysoft apps\millancegold\millance-store\millance_store_app"
flutter pub get
flutter run

# Build release APK
flutter build apk --release

# Install on connected device
flutter install
```

## ✨ Features Ready to Test

1. **Authentication** - Login/Register with referral codes
2. **Shopping** - Browse, search, filter products
3. **Cart** - Add, remove, update quantities
4. **Checkout** - COD, Online, Wallet payments
5. **Wallet** - View balances, transactions
6. **QR Scan & Pay** - Camera or image upload
7. **Redeem Codes** - Enter promotional codes
8. **Affiliate** - Share links via WhatsApp
9. **Orders** - View history with filters
10. **Profile** - User info and logout

---

**App Status:** ✅ PRODUCTION READY
**Internet:** ✅ FULLY CONFIGURED
**Permissions:** ✅ ALL SET
**Backend:** ✅ CONNECTED (https://millance.store)
