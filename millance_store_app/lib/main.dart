import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'config/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/cart_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/register_screen.dart';
import 'services/deep_link_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );
  
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
  String? _initialReferralCode;

  @override
  void initState() {
    super.initState();
    _initDeepLinks();
  }

  @override
  void dispose() {
    DeepLinkService.dispose();
    super.dispose();
  }

  Future<void> _initDeepLinks() async {
    // Get initial referral code (app opened from link)
    final referralCode = await DeepLinkService.getInitialReferralCode();
    if (referralCode != null) {
      setState(() {
        _initialReferralCode = referralCode;
      });
    }
    
    // Listen for incoming links (app already running)
    DeepLinkService.listenForLinks((referralCode) {
      _navigateToRegister(referralCode);
    });
  }

  void _navigateToRegister(String referralCode) {
    navigatorKey.currentState?.push(
      MaterialPageRoute(
        builder: (_) => RegisterScreen(referralCode: referralCode),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
      ],
      child: MaterialApp(
        title: 'Millance Store',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        navigatorKey: navigatorKey,
        home: SplashScreen(initialReferralCode: _initialReferralCode),
      ),
    );
  }
}

