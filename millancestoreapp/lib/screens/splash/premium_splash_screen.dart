import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../onboarding/onboarding_screen.dart';
import '../../theme/app_colors.dart';

class PremiumSplashScreen extends StatefulWidget {
  const PremiumSplashScreen({super.key});

  @override
  State<PremiumSplashScreen> createState() => _PremiumSplashScreenState();
}

class _PremiumSplashScreenState extends State<PremiumSplashScreen>
    with TickerProviderStateMixin {
  // Animation Controllers
  late AnimationController _backgroundController;
  late AnimationController _bagController;
  late AnimationController _logoController;
  late AnimationController _textController;
  late AnimationController _loadingController;
  late AnimationController _particlesController;
  late AnimationController _floatController;
  late AnimationController _glowController;
  late AnimationController _productsController;

  // Animations
  late Animation<double> _backgroundFade;
  late Animation<double> _bagScale;
  late Animation<double> _bagFloat;
  late Animation<double> _logoFade;
  late Animation<double> _textFade;
  late Animation<double> _loadingProgress;
  late Animation<double> _glowPulse;

  // Individual product animations
  final List<AnimationController> _productControllers = [];
  final List<Animation<double>> _productProgress = [];
  final List<Animation<double>> _productScale = [];
  final List<Animation<double>> _productRotation = [];
  final List<Animation<double>> _productOpacity = [];

  // Product data
  final List<Map<String, dynamic>> _products = [
    {'icon': Icons.shopping_cart, 'startAngle': -math.pi / 2},
    {'icon': Icons.phone_android, 'startAngle': -math.pi / 3},
    {'icon': Icons.checkroom, 'startAngle': -math.pi / 6},
    {'icon': Icons.shopping_basket, 'startAngle': 0.0},
    {'icon': Icons.laptop_mac, 'startAngle': math.pi / 6},
    {'icon': Icons.face_retouching_natural, 'startAngle': math.pi / 3},
  ];

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _startAnimationSequence();
  }

  void _initializeAnimations() {
    // Background fade in
    _backgroundController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _backgroundFade = CurvedAnimation(
      parent: _backgroundController,
      curve: Curves.easeInOut,
    );

    // Shopping bag entrance
    _bagController = AnimationController(
      duration: const Duration(milliseconds: 900),
      vsync: this,
    );
    _bagScale = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _bagController, curve: Curves.elasticOut),
    );

    // Floating animation for bag (continuous)
    _floatController = AnimationController(
      duration: const Duration(milliseconds: 2400),
      vsync: this,
    )..repeat(reverse: true);
    _bagFloat = Tween<double>(begin: -6.0, end: 6.0).animate(
      CurvedAnimation(parent: _floatController, curve: Curves.easeInOut),
    );

    // Glow pulse (continuous)
    _glowController = AnimationController(
      duration: const Duration(milliseconds: 1800),
      vsync: this,
    )..repeat(reverse: true);
    _glowPulse = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _glowController, curve: Curves.easeInOut),
    );

    // Individual product fly-in controllers
    for (int i = 0; i < _products.length; i++) {
      final ctrl = AnimationController(
        duration: const Duration(milliseconds: 700),
        vsync: this,
      );
      _productControllers.add(ctrl);

      // progress 0→1 drives movement toward bag center
      _productProgress.add(
        CurvedAnimation(parent: ctrl, curve: Curves.easeInCubic),
      );

      // Scale 1.0 → 0.0 as it enters bag
      _productScale.add(
        Tween<double>(begin: 1.0, end: 0.0).animate(
          CurvedAnimation(
            parent: ctrl,
            curve: const Interval(0.6, 1.0, curve: Curves.easeIn),
          ),
        ),
      );

      // Slight rotation while flying
      final dir = (i % 2 == 0) ? 1.0 : -1.0;
      _productRotation.add(
        Tween<double>(begin: 0.0, end: dir * 0.18).animate(
          CurvedAnimation(
            parent: ctrl,
            curve: const Interval(0.0, 0.8, curve: Curves.easeInOut),
          ),
        ),
      );

      // Opacity 1 → 0 at the very end (disappear inside bag)
      _productOpacity.add(
        Tween<double>(begin: 1.0, end: 0.0).animate(
          CurvedAnimation(
            parent: ctrl,
            curve: const Interval(0.75, 1.0, curve: Curves.easeIn),
          ),
        ),
      );
    }

    // Logo fade in
    _logoController = AnimationController(
      duration: const Duration(milliseconds: 700),
      vsync: this,
    );
    _logoFade = CurvedAnimation(parent: _logoController, curve: Curves.easeIn);

    // Text fade in
    _textController = AnimationController(
      duration: const Duration(milliseconds: 700),
      vsync: this,
    );
    _textFade = CurvedAnimation(parent: _textController, curve: Curves.easeIn);

    // Loading bar
    _loadingController = AnimationController(
      duration: const Duration(milliseconds: 1400),
      vsync: this,
    );
    _loadingProgress = CurvedAnimation(
      parent: _loadingController,
      curve: Curves.easeInOut,
    );

    // Particles (continuous)
    _particlesController = AnimationController(
      duration: const Duration(seconds: 5),
      vsync: this,
    )..repeat();
  }

  Future<void> _startAnimationSequence() async {
    // 1. Background
    _backgroundController.forward();
    await Future.delayed(const Duration(milliseconds: 300));

    // 2. Bag + logo appear together
    _bagController.forward();
    _logoController.forward();
    await Future.delayed(const Duration(milliseconds: 700));

    // 3. Products fly in one by one with stagger
    _runProductLoop();

    // 4. Text comes in after first loop starts
    await Future.delayed(const Duration(milliseconds: 600));
    _textController.forward();
    await Future.delayed(const Duration(milliseconds: 400));

    // 5. Loading bar
    _loadingController.forward();
    await Future.delayed(const Duration(milliseconds: 1600));

    // 6. Navigate
    if (mounted) {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (_, animation, __) => const OnboardingScreen(),
          transitionsBuilder: (_, animation, __, child) {
            return FadeTransition(
              opacity: animation,
              child: ScaleTransition(
                scale: Tween<double>(begin: 0.96, end: 1.0).animate(
                  CurvedAnimation(parent: animation, curve: Curves.easeOut),
                ),
                child: child,
              ),
            );
          },
          transitionDuration: const Duration(milliseconds: 600),
        ),
      );
    }
  }

  void _runProductLoop() async {
    while (mounted) {
      // Reset all
      for (final ctrl in _productControllers) {
        ctrl.reset();
      }
      await Future.delayed(const Duration(milliseconds: 100));

      // Stagger each product into bag
      for (int i = 0; i < _productControllers.length; i++) {
        if (!mounted) return;
        _productControllers[i].forward();
        await Future.delayed(const Duration(milliseconds: 420));
      }

      // Brief pause after all enter bag (bag glows)
      await Future.delayed(const Duration(milliseconds: 900));
    }
  }

  @override
  void dispose() {
    _backgroundController.dispose();
    _bagController.dispose();
    _logoController.dispose();
    _textController.dispose();
    _loadingController.dispose();
    _particlesController.dispose();
    _floatController.dispose();
    _glowController.dispose();
    for (final ctrl in _productControllers) {
      ctrl.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AnimatedBuilder(
        animation: Listenable.merge([
          _backgroundController,
          _bagController,
          _logoController,
          _textController,
          _loadingController,
          _particlesController,
          _floatController,
          _glowController,
          ..._productControllers,
        ]),
        builder: (context, child) {
          return Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color.lerp(
                    Colors.white,
                    const Color(0xFFFDE8E0), // soft peachy top
                    _backgroundFade.value,
                  )!,
                  Color.lerp(
                    const Color(0xFFFDE8E0),
                    const Color(0xFFFAD4C0), // slightly deeper peach bottom
                    _backgroundFade.value,
                  )!,
                ],
              ),
            ),
            child: Stack(
              children: [
                // Soft background waves
                ..._buildBackgroundWaves(),

                // Floating particles
                ..._buildFloatingParticles(),

                // Main content
                Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Spacer(flex: 2),

                      // Shopping bag with logo and orbiting icons
                      SizedBox(
                        width: 400,
                        height: 400,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            // Radial glow behind bag
                            if (_bagScale.value > 0) _buildRadialGlow(),

                            // Products flying into bag
                            if (_bagScale.value > 0.5)
                              ..._buildProductsFlyingIn(),

                            // Shopping bag with float animation
                            if (_bagScale.value > 0)
                              Transform.translate(
                                offset: Offset(0, _bagFloat.value),
                                child: Transform.scale(
                                  scale: _bagScale.value,
                                  child: _buildShoppingBag(),
                                ),
                              ),

                            // Logo in center of bag
                            if (_logoFade.value > 0)
                              Transform.translate(
                                offset: Offset(0, _bagFloat.value),
                                child: _buildCenterLogo(),
                              ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 48),

                      // Brand name
                      if (_textFade.value > 0) _buildBrandText(),

                      const SizedBox(height: 16),

                      // Subtitle
                      if (_textFade.value > 0.3) _buildSubtitle(),

                      const Spacer(flex: 2),

                      // Loading bar
                      if (_loadingProgress.value > 0) _buildLoadingBar(),

                      const SizedBox(height: 64),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  List<Widget> _buildBackgroundWaves() {
    return [
      // Bottom salmon/pink wave blob - like reference image
      Positioned(
        bottom: -80,
        left: -60,
        right: -60,
        child: Opacity(
          opacity: _backgroundFade.value,
          child: Container(
            height: 320,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppColors.primaryPink.withOpacity(0.25),
                  AppColors.primaryOrange.withOpacity(0.45),
                ],
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(220),
                topRight: Radius.circular(220),
              ),
            ),
          ),
        ),
      ),
      // Subtle wave pattern
      Positioned.fill(
        child: Opacity(
          opacity: 0.15 * _backgroundFade.value,
          child: CustomPaint(
            painter: WavesPainter(animation: _particlesController.value),
          ),
        ),
      ),
    ];
  }

  List<Widget> _buildFloatingParticles() {
    return List.generate(18, (index) {
      final random = math.Random(index * 7);
      final size = 5.0 + random.nextDouble() * 10.0;
      final startX = random.nextDouble();
      final startY = random.nextDouble();
      final speed = 0.4 + random.nextDouble() * 0.6;
      // Alternating pink and orange bubbles like reference
      final color = index % 3 == 0
          ? AppColors.primaryPink.withOpacity(0.35)
          : index % 3 == 1
              ? AppColors.primaryOrange.withOpacity(0.30)
              : const Color(0xFFFFB347).withOpacity(0.25);

      return Positioned(
        left: MediaQuery.of(context).size.width * startX,
        top: MediaQuery.of(context).size.height * startY,
        child: Opacity(
          opacity: _backgroundFade.value,
          child: Transform.translate(
            offset: Offset(
              8 * math.sin(_particlesController.value * 2 * math.pi * speed + index),
              -12 * math.sin(_particlesController.value * 2 * math.pi * speed + index * 0.7),
            ),
            child: Container(
              width: size,
              height: size,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: color,
                boxShadow: [
                  BoxShadow(
                    color: color,
                    blurRadius: 6,
                    spreadRadius: 1,
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    });
  }

  Widget _buildRadialGlow() {
    return Container(
      width: 280,
      height: 280,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            AppColors.primaryOrange.withOpacity(0.35 * _glowPulse.value),
            AppColors.primaryPink.withOpacity(0.18 * _glowPulse.value),
            Colors.transparent,
          ],
          stops: const [0.0, 0.5, 1.0],
        ),
      ),
    );
  }

  List<Widget> _buildProductsFlyingIn() {
    // Start positions spread above the bag opening
    final List<Offset> startPositions = [
      const Offset(-140, -130), // cart - far left
      const Offset(-70, -160),  // phone - left
      const Offset(0, -175),    // shirt - top center
      const Offset(70, -160),   // basket - right
      const Offset(140, -130),  // laptop - far right
      const Offset(-110, -90),  // beauty - lower left
    ];

    return List.generate(_products.length, (i) {
      if (i >= _productControllers.length) return const SizedBox.shrink();

      return AnimatedBuilder(
        animation: _productControllers[i],
        builder: (context, _) {
          final t = _productProgress[i].value;
          if (t == 0.0) return const SizedBox.shrink();

          // Interpolate from start position toward bag center (0,0)
          final start = startPositions[i];
          // Curved path: arc slightly toward center
          final currentX = start.dx * (1 - t);
          final currentY = start.dy * (1 - t) + (30 * math.sin(t * math.pi));

          final scale = 1.0 - (t * 0.15); // shrink slightly as it enters
          final rotation = _productRotation[i].value;
          final opacity = _productOpacity[i].value;

          return Transform.translate(
            offset: Offset(currentX, currentY),
            child: Transform.scale(
              scale: scale,
              child: Transform.rotate(
                angle: rotation,
                child: Opacity(
                  opacity: opacity,
                  child: _buildProductCard(_products[i]['icon'] as IconData),
                ),
              ),
            ),
          );
        },
      );
    });
  }

  Widget _buildProductCard(IconData icon) {
    return Container(
      width: 62,
      height: 62,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryPink.withOpacity(0.25),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Icon(
        icon,
        color: AppColors.primaryOrange,
        size: 34,
      ),
    );
  }

  Widget _buildShoppingBag() {
    // Bag bounces slightly when a product enters
    final bagBounce = _productControllers.any((c) {
      final v = c.value;
      return v > 0.7 && v < 1.0;
    })
        ? 1.04
        : 1.0;

    return Transform.scale(
      scale: bagBounce,
      child: CustomPaint(
        size: const Size(190, 210),
        painter: PremiumBagPainter(
          glowIntensity: _glowPulse.value,
          showInnerGlow: _productControllers.any((c) => c.value > 0.7),
        ),
      ),
    );
  }

  Widget _buildCenterLogo() {
    return Opacity(
      opacity: _logoFade.value,
      child: Transform.translate(
        offset: const Offset(0, 30),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.asset(
            'assets/images/logo.jpeg',
            width: 130,
            height: 130,
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }

  Widget _buildBrandText() {
    return Opacity(
      opacity: _textFade.value,
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'MILLANCE',
                style: TextStyle(
                  fontSize: 36,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 3,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(width: 8),
              ShaderMask(
                shaderCallback: (bounds) => AppColors.orangePinkGradient.createShader(bounds),
                child: const Text(
                  'STORE',
                  style: TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 3,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSubtitle() {
    return Opacity(
      opacity: (_textFade.value - 0.3).clamp(0.0, 1.0),
      child: const Column(
        children: [
          Text(
            'Everything You Need,',
            style: TextStyle(
              fontSize: 16,
              color: AppColors.textGray,
              fontWeight: FontWeight.w400,
              letterSpacing: 0.5,
            ),
          ),
          SizedBox(height: 4),
          Text(
            'Delivered Smarter.',
            style: TextStyle(
              fontSize: 16,
              color: AppColors.textGray,
              fontWeight: FontWeight.w400,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingBar() {
    return Container(
      width: 220,
      height: 4,
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.08),
        borderRadius: BorderRadius.circular(2),
      ),
      child: Stack(
        children: [
          // Progress bar
          FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: _loadingProgress.value,
            child: Container(
              decoration: BoxDecoration(
                gradient: AppColors.orangePinkGradient,
                borderRadius: BorderRadius.circular(2),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryOrange.withOpacity(0.5),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
            ),
          ),
          // Animated glow
          if (_loadingProgress.value > 0)
            Positioned(
              left: (_loadingProgress.value * 220) - 20,
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.white.withOpacity(0.0),
                      Colors.white.withOpacity(0.8),
                      Colors.white.withOpacity(0.0),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class WavesPainter extends CustomPainter {
  final double animation;

  WavesPainter({required this.animation});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primaryPink.withOpacity(0.12)
      ..style = PaintingStyle.fill;

    final path = Path();

    for (int i = 0; i < 3; i++) {
      path.reset();
      final yOffset = size.height * (0.3 + i * 0.2);
      final waveHeight = 20.0 + i * 8;

      path.moveTo(0, yOffset);
      for (double x = 0; x <= size.width; x += 8) {
        final y = yOffset +
            math.sin((x / size.width * 2 * math.pi) +
                    (animation * 2 * math.pi) +
                    (i * math.pi / 3)) *
                waveHeight;
        path.lineTo(x, y);
      }
      path.lineTo(size.width, size.height);
      path.lineTo(0, size.height);
      path.close();
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(WavesPainter oldDelegate) => true;
}

class PremiumBagPainter extends CustomPainter {
  final double glowIntensity;
  final bool showInnerGlow;

  PremiumBagPainter({
    required this.glowIntensity,
    required this.showInnerGlow,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // ── Shadow beneath bag ──────────────────────────────────────
    final shadowPaint = Paint()
      ..color = AppColors.primaryPink.withOpacity(0.18)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 28);
    canvas.drawRRect(
      RRect.fromRectAndRadius(
        Rect.fromLTWH(w * 0.08, h * 0.72, w * 0.84, h * 0.2),
        const Radius.circular(24),
      ),
      shadowPaint,
    );

    // ── Bag body ────────────────────────────────────────────────
    final bodyRect = RRect.fromLTRBR(
      w * 0.05,
      h * 0.22,
      w * 0.95,
      h * 0.97,
      const Radius.circular(22),
    );

    final bodyPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          const Color(0xFFFFFAF7),
          const Color(0xFFFFF0E8),
        ],
      ).createShader(bodyRect.outerRect);
    canvas.drawRRect(bodyRect, bodyPaint);

    // Body border
    final borderPaint = Paint()
      ..color = AppColors.primaryPink.withOpacity(0.12)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;
    canvas.drawRRect(bodyRect, borderPaint);

    // ── Inner golden glow (bag opening) ─────────────────────────
    final glowCenter = Offset(w / 2, h * 0.3);
    final glowRadius = w * 0.5 * glowIntensity;
    final innerGlowPaint = Paint()
      ..shader = RadialGradient(
        colors: [
          AppColors.primaryOrange.withOpacity(
              showInnerGlow ? 0.6 * glowIntensity : 0.3 * glowIntensity),
          AppColors.primaryPink.withOpacity(0.2 * glowIntensity),
          Colors.transparent,
        ],
        stops: const [0.0, 0.5, 1.0],
      ).createShader(Rect.fromCircle(center: glowCenter, radius: glowRadius));
    canvas.drawCircle(glowCenter, glowRadius, innerGlowPaint);

    // ── Light rays from bag opening ─────────────────────────────
    if (glowIntensity > 0.4) {
      final rayPaint = Paint()
        ..color = AppColors.primaryOrange.withOpacity(0.12 * glowIntensity)
        ..strokeWidth = 12
        ..strokeCap = StrokeCap.round;

      for (int i = 0; i < 6; i++) {
        final angle = -math.pi / 2 + (i - 2.5) * 0.28;
        final startR = w * 0.12;
        final endR = w * 0.55 * glowIntensity;
        canvas.drawLine(
          Offset(w / 2 + math.cos(angle) * startR,
              h * 0.22 + math.sin(angle) * startR),
          Offset(w / 2 + math.cos(angle) * endR,
              h * 0.22 + math.sin(angle) * endR),
          rayPaint,
        );
      }
    }

    // ── Handles ──────────────────────────────────────────────────
    final handlePaint = Paint()
      ..shader = LinearGradient(
        colors: [AppColors.primaryOrange, AppColors.primaryPink],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(0, 0, w, h * 0.25))
      ..style = PaintingStyle.stroke
      ..strokeWidth = 7
      ..strokeCap = StrokeCap.round;

    // Left handle
    final lPath = Path()
      ..moveTo(w * 0.28, h * 0.22)
      ..cubicTo(
        w * 0.28, h * 0.04,
        w * 0.46, h * 0.01,
        w * 0.46, h * 0.10,
      );
    canvas.drawPath(lPath, handlePaint);

    // Right handle
    final rPath = Path()
      ..moveTo(w * 0.72, h * 0.22)
      ..cubicTo(
        w * 0.72, h * 0.04,
        w * 0.54, h * 0.01,
        w * 0.54, h * 0.10,
      );
    canvas.drawPath(rPath, handlePaint);

    // Handle end dots
    final dotPaint = Paint()
      ..shader = handlePaint.shader
      ..style = PaintingStyle.fill;
    canvas.drawCircle(Offset(w * 0.46, h * 0.10), 4, dotPaint);
    canvas.drawCircle(Offset(w * 0.54, h * 0.10), 4, dotPaint);
  }

  @override
  bool shouldRepaint(PremiumBagPainter old) =>
      old.glowIntensity != glowIntensity || old.showInnerGlow != showInnerGlow;
}
