import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import 'dart:math' as math;
import '../../config/app_colors.dart';
import '../../services/storage_service.dart';
import '../../providers/auth_provider.dart';
import '../onboarding/onboarding_screen.dart';
import '../auth/login_screen.dart';
import '../main_screen.dart';

class PremiumSplashScreen extends StatefulWidget {
  const PremiumSplashScreen({super.key});

  @override
  State<PremiumSplashScreen> createState() => _PremiumSplashScreenState();
}

class _PremiumSplashScreenState extends State<PremiumSplashScreen>
    with TickerProviderStateMixin {
  // Animation controllers for each stage
  late AnimationController _trolleyEnterController;
  late AnimationController _trolleyCenterController;
  late AnimationController _productsAppearController;
  late AnimationController _productsJumpController;
  late AnimationController _bagRiseController;
  late AnimationController _logoController;

  // Trolley animations
  late Animation<double> _trolleySlide;
  late Animation<double> _trolleyBounce;
  
  // Product animations
  late List<Animation<double>> _productScaleAnimations;
  late List<Animation<double>> _productOpacityAnimations;
  late List<Animation<Offset>> _productPathAnimations;
  
  // Bag animations
  late Animation<double> _bagPosition;
  late Animation<double> _trolleyFade;
  
  // Logo animations
  late Animation<double> _logoOpacity;
  late Animation<double> _logoScale;

  // Animation stage states
  int _currentStage = 1; // 1-9 corresponding to reference screens
  bool _showRays = false;
  bool _showProducts = false;
  bool _showArrows = false;
  bool _trolleyPacked = false;
  bool _showBag = false;
  bool _showLogo = false;

  // Product data matching reference - EXACT ICONS
  final List<ProductData> _products = [
    ProductData(
      icon: Icons.checkroom_outlined, // T-Shirt
      name: 'T-Shirt',
      color: const Color(0xFF60A5FA), // Light blue
      position: const Offset(0, -1),
      order: 1,
    ),
    ProductData(
      icon: Icons.sports_soccer_outlined, // Shoe/Sports
      name: 'Shoe',
      color: const Color(0xFFFB923C), // Orange
      position: const Offset(-0.9, -0.6),
      order: 0,
    ),
    ProductData(
      icon: Icons.phone_iphone_outlined, // Smartphone
      name: 'Smartphone',
      color: const Color(0xFFC084FC), // Light purple
      position: const Offset(0.9, -0.6),
      order: 2,
    ),
    ProductData(
      icon: Icons.camera_alt_outlined, // Camera
      name: 'Camera',
      color: const Color(0xFFF472B6), // Pink
      position: const Offset(0.9, 0),
      order: 3,
    ),
    ProductData(
      icon: Icons.laptop_mac_outlined, // Laptop
      name: 'Laptop',
      color: const Color(0xFF8B5CF6), // Purple
      position: const Offset(0.9, 0.6),
      order: 6,
    ),
    ProductData(
      icon: Icons.card_giftcard_outlined, // Gift
      name: 'Gift',
      color: const Color(0xFFFACC15), // Yellow
      position: const Offset(0, 1),
      order: 7,
    ),
    ProductData(
      icon: Icons.headset_outlined, // Headphones
      name: 'Headphones',
      color: const Color(0xFF3B82F6), // Blue
      position: const Offset(-0.9, 0.6),
      order: 5,
    ),
    ProductData(
      icon: Icons.watch_outlined, // Watch
      name: 'Watch',
      color: const Color(0xFF10B981), // Green
      position: const Offset(-0.9, 0),
      order: 4,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startAnimationSequence();
    _scheduleNavigation();
  }

  void _initializeAnimations() {
    // Stage 1: Trolley enters (0 - 1100ms)
    _trolleyEnterController = AnimationController(
      duration: const Duration(milliseconds: 1100),
      vsync: this,
    );
    _trolleySlide = Tween<double>(begin: -1.5, end: 0.0).animate(
      CurvedAnimation(parent: _trolleyEnterController, curve: Curves.easeOut),
    );

    // Stage 2: Trolley center bounce (1100 - 1700ms)
    _trolleyCenterController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _trolleyBounce = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.95), weight: 1),
      TweenSequenceItem(tween: Tween(begin: 0.95, end: 1.03), weight: 1),
      TweenSequenceItem(tween: Tween(begin: 1.03, end: 1.0), weight: 1),
    ]).animate(_trolleyCenterController);

    // Stage 3: Products appear (1700 - 3000ms)
    _productsAppearController = AnimationController(
      duration: const Duration(milliseconds: 1300),
      vsync: this,
    );
    _productScaleAnimations = List.generate(8, (index) {
      return Tween<double>(begin: 0.4, end: 1.0).animate(
        CurvedAnimation(
          parent: _productsAppearController,
          curve: Interval(index * 0.1, index * 0.1 + 0.3, curve: Curves.elasticOut),
        ),
      );
    });
    _productOpacityAnimations = List.generate(8, (index) {
      return Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(
          parent: _productsAppearController,
          curve: Interval(index * 0.1, index * 0.1 + 0.2, curve: Curves.easeOut),
        ),
      );
    });

    // Stage 4: Products jump in (3000 - 5000ms)
    _productsJumpController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    _productPathAnimations = _products.map((product) {
      final order = product.order;
      return Tween<Offset>(
        begin: product.position,
        end: Offset.zero,
      ).animate(
        CurvedAnimation(
          parent: _productsJumpController,
          curve: Interval(
            order * 0.12,
            order * 0.12 + 0.25,
            curve: Curves.easeInOut,
          ),
        ),
      );
    }).toList();

    // Stage 6: Bag rises (6200 - 7500ms)
    _bagRiseController = AnimationController(
      duration: const Duration(milliseconds: 1300),
      vsync: this,
    );
    _bagPosition = Tween<double>(begin: 1.5, end: 0.0).animate(
      CurvedAnimation(parent: _bagRiseController, curve: Curves.easeOut),
    );
    _trolleyFade = Tween<double>(begin: 1.0, end: 0.0).animate(
      CurvedAnimation(parent: _bagRiseController, curve: const Interval(0.0, 0.3)),
    );

    // Stage 7: Logo appears (7500 - 8500ms)
    _logoController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _logoOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _logoController, curve: Curves.easeIn),
    );
    _logoScale = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _logoController, curve: Curves.elasticOut),
    );
  }

  void _startAnimationSequence() async {
    // Stage 1: Trolley enters (0 - 1100ms)
    setState(() => _currentStage = 1);
    _trolleyEnterController.forward();
    await Future.delayed(const Duration(milliseconds: 1100));

    // Stage 2: Trolley at center (1100 - 1700ms)
    setState(() {
      _currentStage = 2;
      _showRays = true;
    });
    _trolleyCenterController.forward();
    await Future.delayed(const Duration(milliseconds: 600));

    // Stage 3: Products appear (1700 - 3000ms)
    setState(() {
      _currentStage = 3;
      _showProducts = true;
    });
    _productsAppearController.forward();
    await Future.delayed(const Duration(milliseconds: 1300));

    // Stage 4: Products jump in (3000 - 5000ms)
    setState(() {
      _currentStage = 4;
      _showArrows = true;
    });
    _productsJumpController.forward();
    await Future.delayed(const Duration(milliseconds: 2000));

    // Stage 5: Trolley packed (5000 - 6200ms)
    setState(() {
      _currentStage = 5;
      _trolleyPacked = true;
      _showArrows = false;
      _showRays = true;
    });
    await Future.delayed(const Duration(milliseconds: 1200));

    // Stage 6: Bag rises (6200 - 7500ms)
    setState(() {
      _currentStage = 6;
      _showBag = true;
      _showRays = false;
    });
    _bagRiseController.forward();
    await Future.delayed(const Duration(milliseconds: 1300));

    // Stage 7: Logo appears (7500 - 8500ms)
    setState(() {
      _currentStage = 7;
      _showLogo = true;
      _showRays = true;
    });
    _logoController.forward();
    await Future.delayed(const Duration(milliseconds: 1000));

    // Stage 8: Final splash (8500 - 10000ms)
    setState(() {
      _currentStage = 8;
      _showRays = false;
    });
    await Future.delayed(const Duration(milliseconds: 1500));

    // Stage 9: Transition to onboarding
    setState(() => _currentStage = 9);
  }

  void _scheduleNavigation() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.initialize();
    
    await Future.delayed(const Duration(milliseconds: 10000));
    
    if (!mounted) return;
    
    if (authProvider.isLoggedIn) {
      _navigateToScreen(const MainScreen());
      return;
    }

    final hasCompleted = await StorageService.hasCompletedOnboarding();
    if (!mounted) return;

    _navigateToScreen(hasCompleted ? const LoginScreen() : const OnboardingScreen());
  }

  void _navigateToScreen(Widget screen) {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (c, a, s) => screen,
        transitionsBuilder: (c, a, s, child) => FadeTransition(opacity: a, child: child),
        transitionDuration: const Duration(milliseconds: 500),
      ),
    );
  }

  @override
  void dispose() {
    _trolleyEnterController.dispose();
    _trolleyCenterController.dispose();
    _productsAppearController.dispose();
    _productsJumpController.dispose();
    _bagRiseController.dispose();
    _logoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Stack(
          children: [
            // Trolley (Stages 1-5)
            if (_currentStage <= 5 && !_showBag)
              _buildTrolleySection(size),
            
            // Products (Stages 3-4)
            if (_showProducts && !_trolleyPacked)
              _buildProductsSection(size),
            
            // Shopping bag (Stages 6-9)
            if (_showBag)
              _buildBagSection(size),
            
            // NO decorative rays/lines
          ],
        ),
      ),
    );
  }

  Widget _buildTrolleySection(Size size) {
    return AnimatedBuilder(
      animation: Listenable.merge([_trolleyEnterController, _trolleyCenterController, _bagRiseController]),
      builder: (context, child) {
        final slideValue = _trolleySlide.value;
        final bounceValue = _trolleyBounce.value;
        final fadeValue = _showBag ? _trolleyFade.value : 1.0;
        
        return Opacity(
          opacity: fadeValue,
          child: Center(
            child: Transform.translate(
              offset: Offset(slideValue * size.width, _showBag ? -size.height * 0.3 : 0),
              child: Transform.scale(
                scale: bounceValue,
                child: _buildTrolley(packed: _trolleyPacked),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildTrolley({bool packed = false}) {
    return CustomPaint(
      size: const Size(240, 220), // MUCH LARGER trolley
      painter: TrolleyPainter(packed: packed, products: packed ? _products : []),
    );
  }

  Widget _buildProductsSection(Size size) {
    return AnimatedBuilder(
      animation: Listenable.merge([_productsAppearController, _productsJumpController]),
      builder: (context, child) {
        return Stack(
          children: List.generate(_products.length, (index) {
            final product = _products[index];
            final scaleValue = _productScaleAnimations[index].value;
            final opacityValue = _productOpacityAnimations[index].value;
            final pathValue = _productPathAnimations[index].value;
            
            // Calculate smooth curved path (NO VISIBLE LINES - just mathematical path)
            final baseX = size.width * 0.5;
            final baseY = size.height * 0.5;
            final radius = size.width * 0.32;
            
            // Current position along the path
            final progress = 1.0 - pathValue.distance;
            final currentX = baseX + (pathValue.dx * radius);
            final currentY = baseY + (pathValue.dy * radius);
            
            // Scale down as product enters trolley
            final entryScale = progress > 0.7 ? (1.0 - ((progress - 0.7) / 0.3) * 0.4) : 1.0;
            final entryOpacity = progress > 0.8 ? (1.0 - ((progress - 0.8) / 0.2)) : 1.0;
            
            return Positioned(
              left: currentX - 32.5,
              top: currentY - 32.5,
              child: Opacity(
                opacity: opacityValue * entryOpacity,
                child: Transform.scale(
                  scale: scaleValue * entryScale,
                  child: Transform.rotate(
                    angle: progress * 0.3, // Slight rotation during movement
                    child: _buildProductIcon(product, index),
                  ),
                ),
              ),
            );
          }),
        );
      },
    );
  }

  Widget _buildProductIcon(ProductData product, int index) {
    return Container(
      width: 70,
      height: 70,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white,
        border: Border.all(color: product.color, width: 3.5),
        boxShadow: [
          BoxShadow(
            color: product.color.withOpacity(0.3),
            blurRadius: 12,
            spreadRadius: 2,
          ),
        ],
      ),
      child: Icon(
        product.icon,
        size: 36,
        color: product.color,
        weight: 400,
      ),
    );
  }

  Widget _buildBagSection(Size size) {
    return AnimatedBuilder(
      animation: _bagRiseController,
      builder: (context, child) {
        final posValue = _bagPosition.value;
        
        return Center(
          child: Transform.translate(
            offset: Offset(0, posValue * size.height * 0.5),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CustomPaint(
                  size: const Size(280, 300),
                  painter: ShoppingBagPainter(),
                ),
                if (_showLogo) _buildLogo(),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildLogo() {
    return AnimatedBuilder(
      animation: _logoController,
      builder: (context, child) {
        return Transform.translate(
          offset: const Offset(0, -180), // Centered on bag
          child: Opacity(
            opacity: _logoOpacity.value,
            child: Transform.scale(
              scale: _logoScale.value,
              child: Container(
                width: 150,
                height: 150,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(15),
                  child: Image.asset(
                    'assets/images/app_icon.jpeg',
                    fit: BoxFit.contain,
                    errorBuilder: (_, __, ___) => Container(
                      padding: const EdgeInsets.all(20),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ShaderMask(
                            shaderCallback: (bounds) =>
                                const LinearGradient(
                                  colors: [Color(0xFFFF9D00), Color(0xFFF0007C)],
                                ).createShader(bounds),
                            child: const Icon(
                              Icons.shopping_bag,
                              size: 50,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 8),
                          ShaderMask(
                            shaderCallback: (bounds) =>
                                const LinearGradient(
                                  colors: [Color(0xFFFF9D00), Color(0xFFF0007C)],
                                ).createShader(bounds),
                            child: const Text(
                              'MILLANCE',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: 2,
                              ),
                            ),
                          ),
                          ShaderMask(
                            shaderCallback: (bounds) =>
                                const LinearGradient(
                                  colors: [Color(0xFFFF9D00), Color(0xFFF0007C)],
                                ).createShader(bounds),
                            child: const Text(
                              'STORE',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                                letterSpacing: 3,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  // Removed _buildCelebrationRays() - no decorative lines
}

// Product data model
class ProductData {
  final IconData icon;
  final String name;
  final Color color;
  final Offset position;
  final int order;

  ProductData({
    required this.icon,
    required this.name,
    required this.color,
    required this.position,
    required this.order,
  });
}

// Trolley custom painter - PREMIUM SHOPPING TROLLEY (NO DECORATIVE LINES)
class TrolleyPainter extends CustomPainter {
  final bool packed;
  final List<ProductData> products;

  TrolleyPainter({required this.packed, required this.products});

  @override
  void paint(Canvas canvas, Size size) {
    // Shadow underneath
    final shadowPaint = Paint()
      ..color = Colors.grey.withOpacity(0.2)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 12);
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(size.width * 0.5, size.height * 0.88),
        width: size.width * 0.7,
        height: 15,
      ),
      shadowPaint,
    );

    // Basket body with white fill
    final basketFillPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final basketPath = Path()
      ..moveTo(size.width * 0.28, size.height * 0.32)
      ..lineTo(size.width * 0.18, size.height * 0.72)
      ..quadraticBezierTo(size.width * 0.18, size.height * 0.75, size.width * 0.21, size.height * 0.75)
      ..lineTo(size.width * 0.79, size.height * 0.75)
      ..quadraticBezierTo(size.width * 0.82, size.height * 0.75, size.width * 0.82, size.height * 0.72)
      ..lineTo(size.width * 0.72, size.height * 0.32)
      ..close();
    
    canvas.drawPath(basketPath, basketFillPaint);

    // Basket outline with orange to pink gradient
    final basketGradient = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFF9D00), Color(0xFFF0007C)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    
    canvas.drawPath(basketPath, basketGradient);

    // Handle (orange/yellow gradient)
    final handlePaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFFAA00), Color(0xFFFF9D00)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round;

    final handlePath = Path()
      ..moveTo(size.width * 0.72, size.height * 0.34)
      ..quadraticBezierTo(
        size.width * 0.88,
        size.height * 0.12,
        size.width * 0.92,
        size.height * 0.18,
      );
    canvas.drawPath(handlePath, handlePaint);

    // Wheels (navy blue with highlights)
    final wheelPaint = Paint()
      ..color = const Color(0xFF102A56)
      ..style = PaintingStyle.fill;

    // Left wheel
    canvas.drawCircle(Offset(size.width * 0.32, size.height * 0.82), 16, wheelPaint);
    // Right wheel  
    canvas.drawCircle(Offset(size.width * 0.68, size.height * 0.82), 16, wheelPaint);

    // Wheel highlights
    final highlightPaint = Paint()
      ..color = Colors.white.withOpacity(0.5)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(size.width * 0.32 - 4, size.height * 0.82 - 4), 5, highlightPaint);
    canvas.drawCircle(Offset(size.width * 0.68 - 4, size.height * 0.82 - 4), 5, highlightPaint);

    // If packed, draw product shapes inside basket (NO DECORATIVE LINES)
    if (packed && products.isNotEmpty) {
      final centerX = size.width * 0.5;
      final centerY = size.height * 0.53;
      
      // Draw various product shapes
      for (int i = 0; i < math.min(products.length, 6); i++) {
        final paint = Paint()
          ..color = products[i].color
          ..style = PaintingStyle.fill;
        
        final xOffset = (i % 3 - 1) * 18;
        final yOffset = (i ~/ 3) * -12;
        
        // Draw small rectangles/circles representing products
        if (i % 2 == 0) {
          canvas.drawRRect(
            RRect.fromRectAndRadius(
              Rect.fromCenter(
                center: Offset(centerX + xOffset, centerY + yOffset),
                width: 14,
                height: 14,
              ),
              const Radius.circular(3),
            ),
            paint,
          );
        } else {
          canvas.drawCircle(
            Offset(centerX + xOffset, centerY + yOffset),
            7,
            paint,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(TrolleyPainter oldDelegate) => packed != oldDelegate.packed;
}

// Shopping bag custom painter
class ShoppingBagPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // White bag body
    final bagBodyPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;

    final bagPath = Path()
      ..moveTo(size.width * 0.2, size.height * 0.25)
      ..lineTo(size.width * 0.1, size.height * 0.92)
      ..quadraticBezierTo(size.width * 0.1, size.height * 0.96, size.width * 0.14, size.height * 0.96)
      ..lineTo(size.width * 0.86, size.height * 0.96)
      ..quadraticBezierTo(size.width * 0.9, size.height * 0.96, size.width * 0.9, size.height * 0.92)
      ..lineTo(size.width * 0.8, size.height * 0.25)
      ..close();
    
    canvas.drawPath(bagPath, bagBodyPaint);

    // Bag outline
    final outlinePaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFF9D00), Color(0xFFF0007C)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4;
    canvas.drawPath(bagPath, outlinePaint);

    // Pink side panel
    final sidePaint = Paint()
      ..color = const Color(0xFFF0007C)
      ..style = PaintingStyle.fill;
    
    final sidePanel = Path()
      ..moveTo(size.width * 0.8, size.height * 0.25)
      ..lineTo(size.width * 0.9, size.height * 0.92)
      ..quadraticBezierTo(size.width * 0.9, size.height * 0.96, size.width * 0.86, size.height * 0.96)
      ..lineTo(size.width * 0.78, size.height * 0.96)
      ..lineTo(size.width * 0.72, size.height * 0.25)
      ..close();
    canvas.drawPath(sidePanel, sidePaint);

    // Handles (orange/pink gradient)
    final handlePaint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFF9D00), Color(0xFFF0007C)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round;

    // Left handle
    final leftHandle = Path()
      ..moveTo(size.width * 0.32, size.height * 0.25)
      ..quadraticBezierTo(size.width * 0.37, size.height * 0.08, size.width * 0.44, size.height * 0.25);
    canvas.drawPath(leftHandle, handlePaint);

    // Right handle
    final rightHandle = Path()
      ..moveTo(size.width * 0.56, size.height * 0.25)
      ..quadraticBezierTo(size.width * 0.63, size.height * 0.08, size.width * 0.68, size.height * 0.25);
    canvas.drawPath(rightHandle, handlePaint);

    // Shadow
    final shadowPaint = Paint()
      ..color = Colors.grey.withOpacity(0.15)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 15);
    
    canvas.drawOval(
      Rect.fromCenter(
        center: Offset(size.width * 0.5, size.height * 0.98),
        width: size.width * 0.6,
        height: 20,
      ),
      shadowPaint,
    );
  }

  @override
  bool shouldRepaint(ShoppingBagPainter oldDelegate) => false;
}

// Removed RaysPainter class - no decorative lines needed
