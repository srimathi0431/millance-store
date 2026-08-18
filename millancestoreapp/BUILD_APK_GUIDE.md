# 📱 Build APK Release Guide - Millancestoreapp

## Prerequisites

- Flutter SDK installed and in PATH
- Android SDK installed (via Android Studio)
- Java JDK installed

---

## 🚀 Quick Build Steps

### **Step 1: Initialize Flutter Project Structure**

```powershell
cd "C:\Users\Srimathi\OneDrive\Desktop\Millance\millancestoreapp"

# Create Flutter project structure (keeps existing lib/ folder)
flutter create . --project-name millancestoreapp
```

This will create:
- `android/` folder (Android configuration)
- `ios/` folder (iOS configuration)
- `windows/`, `linux/`, `macos/` folders (Desktop platforms)
- `test/` folder (Testing)
- Keep your existing `lib/` folder intact

---

### **Step 2: Configure App Details**

After running `flutter create .`, update these files:

#### **1. Update pubspec.yaml**

Verify your `pubspec.yaml` has the correct name and version:

```yaml
name: millancestoreapp
description: Millance Store - E-Commerce Shopping App
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
```

#### **2. Update Android App Name**

Edit: `android/app/src/main/AndroidManifest.xml`

Change the `android:label`:
```xml
<application
    android:label="Millance Store"
    android:name="${applicationName}"
    android:icon="@mipmap/ic_launcher">
```

#### **3. Update Application ID (Optional)**

Edit: `android/app/build.gradle`

Find and update:
```gradle
defaultConfig {
    applicationId "com.millancestore.app"  // Change this
    minSdkVersion 21
    targetSdkVersion flutter.targetSdkVersion
    versionCode 1
    versionName "1.0.0"
}
```

---

### **Step 3: Build the APK**

#### **Option A: Build Release APK (Recommended)**

```powershell
flutter build apk --release
```

**Output Location:**
```
build/app/outputs/flutter-apk/app-release.apk
```

**APK Size:** ~20-30 MB (approximately)

---

#### **Option B: Build Split APKs (Smaller Size)**

```powershell
flutter build apk --split-per-abi --release
```

This creates 3 separate APKs for different CPU architectures:
- `app-armeabi-v7a-release.apk` (32-bit ARM)
- `app-arm64-v8a-release.apk` (64-bit ARM) ← Most devices
- `app-x86_64-release.apk` (64-bit x86) ← Emulators

**Output Location:**
```
build/app/outputs/flutter-apk/
```

**APK Sizes:** ~15-20 MB each

---

#### **Option C: Build App Bundle (For Play Store)**

```powershell
flutter build appbundle --release
```

**Output Location:**
```
build/app/outputs/bundle/release/app-release.aab
```

---

### **Step 4: Test the APK**

#### **Install on Connected Device:**

```powershell
# Install the APK
flutter install

# Or manually install
adb install build/app/outputs/flutter-apk/app-release.apk
```

#### **Test on Emulator:**

```powershell
# Start emulator first, then
adb install build/app/outputs/flutter-apk/app-release.apk
```

---

## 🔧 Common Build Issues & Solutions

### **Issue 1: Flutter Command Not Found**

**Solution:**
```powershell
# Check if Flutter is in PATH
flutter --version

# If not, add Flutter to PATH:
# 1. Open System Properties → Environment Variables
# 2. Add Flutter SDK bin folder to Path
# Example: C:\src\flutter\bin
```

---

### **Issue 2: Android SDK Not Found**

**Solution:**
```powershell
# Set ANDROID_HOME environment variable
# 1. Open System Properties → Environment Variables
# 2. Create ANDROID_HOME variable
# Example: C:\Users\YourName\AppData\Local\Android\Sdk
```

---

### **Issue 3: Gradle Build Failed**

**Solution:**
```powershell
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter build apk --release
```

---

### **Issue 4: Java Version Issues**

**Solution:**
```powershell
# Check Java version
java -version

# Should be Java 11 or higher
# If not, download and install Java JDK 11+
```

---

### **Issue 5: Build Takes Too Long**

**Solution:**
```powershell
# Enable parallel builds
# In android/gradle.properties, add:
org.gradle.jvmargs=-Xmx4g
org.gradle.parallel=true
org.gradle.caching=true
```

---

## 📦 Build Output Details

### **APK File Types:**

1. **app-release.apk** (Fat APK)
   - Contains all CPU architectures
   - Size: ~25-30 MB
   - Works on all devices
   - Easiest to distribute

2. **app-arm64-v8a-release.apk** (64-bit ARM)
   - Most modern Android phones
   - Size: ~15-20 MB
   - Recommended for distribution

3. **app-armeabi-v7a-release.apk** (32-bit ARM)
   - Older Android phones
   - Size: ~15-18 MB
   - Legacy device support

4. **app-x86_64-release.apk** (x86 64-bit)
   - Android emulators
   - Size: ~18-22 MB
   - Chromebooks (some)

---

## 🚀 Quick Commands Reference

```powershell
# Clean build
flutter clean && flutter pub get

# Build release APK (single file)
flutter build apk --release

# Build split APKs (smaller files)
flutter build apk --split-per-abi --release

# Build App Bundle (for Play Store)
flutter build appbundle --release

# Check build output
dir build\app\outputs\flutter-apk\

# Install on device
flutter install
```

---

## 📱 Distribution Options

### **Option 1: Direct Installation (APK)**
- Share the APK file directly
- Users enable "Install from Unknown Sources"
- Install the APK on device

### **Option 2: Google Play Store (AAB)**
- Build App Bundle: `flutter build appbundle --release`
- Upload to Google Play Console
- Google Play handles distribution

### **Option 3: Internal Testing**
- Use Firebase App Distribution
- TestFlight (for iOS)
- Google Play Internal Testing

---

## ✅ Pre-Release Checklist

- [ ] Test app on physical device
- [ ] Test all 21 screens work correctly
- [ ] Verify all navigation flows
- [ ] Check app permissions in AndroidManifest.xml
- [ ] Test on different screen sizes
- [ ] Verify internet connectivity works
- [ ] Test image loading
- [ ] Check app icon displays correctly
- [ ] Verify app name shows correctly
- [ ] Test form validations
- [ ] Check animations are smooth
- [ ] Test on Android 9, 10, 11, 12, 13+

---

## 🎨 Customize App Icon (Optional)

### **Using flutter_launcher_icons package:**

1. Add to `pubspec.yaml`:
```yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_launcher_icons:
  android: true
  ios: true
  image_path: "assets/icon/app_icon.png"
  adaptive_icon_background: "#FF7A00"
  adaptive_icon_foreground: "assets/icon/app_icon_foreground.png"
```

2. Place your icon:
   - Create `assets/icon/app_icon.png` (1024x1024)
   - Create foreground image if using adaptive icon

3. Generate icons:
```powershell
flutter pub get
flutter pub run flutter_launcher_icons
```

---

## 📝 Build Configuration Files

### **android/app/build.gradle** (Key Settings)

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.millancestore.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled true
            shrinkResources true
        }
    }
}
```

### **android/app/src/main/AndroidManifest.xml** (Permissions)

```xml
<manifest>
    <!-- Internet permission -->
    <uses-permission android:name="android.permission.INTERNET"/>
    
    <!-- Camera permission (for image picker) -->
    <uses-permission android:name="android.permission.CAMERA"/>
    
    <!-- Photo library access -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
</manifest>
```

---

## 🔐 App Signing (For Production)

### **Create Keystore:**

```powershell
keytool -genkey -v -keystore millance-store-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias millance-store
```

### **Configure Signing:**

Create `android/key.properties`:
```properties
storePassword=YourStorePassword
keyPassword=YourKeyPassword
keyAlias=millance-store
storeFile=../millance-store-keystore.jks
```

Update `android/app/build.gradle`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 📊 Expected Build Times

- **First Build**: 5-10 minutes
- **Clean Build**: 3-5 minutes
- **Incremental Build**: 30-90 seconds

---

## 🎉 Success!

After building, your APK will be at:

```
C:\Users\Srimathi\OneDrive\Desktop\Millance\millancestoreapp\build\app\outputs\flutter-apk\app-release.apk
```

**You can now:**
- ✅ Install on Android device
- ✅ Share with testers
- ✅ Upload to Play Store
- ✅ Distribute to users

---

## 📞 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Run `flutter doctor` to check setup
3. Clean and rebuild: `flutter clean && flutter pub get`
4. Check Flutter logs: `flutter logs`

---

**Happy Building! 🚀**

*Last Updated: January 5, 2026*
