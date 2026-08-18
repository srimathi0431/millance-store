// ═══════════════════════════════════════════════════════════════════
// MILLANCE STORE - PREMIUM LUXURY THEME SYSTEM
// ═══════════════════════════════════════════════════════════════════
// Tagline: "Premium Shopping. Trusted Quality."
// Brand Personality: Luxury • Modern • Minimal • Premium • Fast • Elegant • Professional
// ═══════════════════════════════════════════════════════════════════

export const COLORS = {
  // ─── Primary Forest Green (Luxury Core) ───────────────────────────
  primary: '#234437',          // Main forest green
  primaryLight: '#2E5A4A',     // Lighter variant
  primaryDark: '#1A3020',      // Darker variant for depth
  primaryHover: '#2A4E40',     // Hover state
  
  // ─── Secondary Emerald (Vibrant Accent) ───────────────────────────
  secondary: '#0F6B5C',        // Rich emerald
  emerald: '#10B981',          // Bright emerald
  emeraldLight: '#34D399',     // Light emerald
  emeraldDark: '#047857',      // Deep emerald
  
  // ─── Luxury Gold (Premium Accents) ────────────────────────────────
  gold: '#C8A23A',             // Primary gold
  goldLight: '#E5C86B',        // Light gold
  goldDark: '#A88531',         // Dark gold
  goldShimmer: '#F4E4B1',      // Shimmer effect
  goldPale: '#F8F4E8',         // Very light gold
  
  // ─── Premium Backgrounds ──────────────────────────────────────────
  background: '#F6F5F1',       // Warm luxury beige
  backgroundLight: '#FAFAF8',  // Lighter variant
  backgroundDark: '#F0EFE8',   // Darker beige
  surface: '#FFFFFF',          // Pure white cards
  surfaceElevated: '#FEFEFE',  // Elevated surfaces
  surfaceHover: '#FDFCFA',     // Hover state
  overlay: 'rgba(34, 68, 55, 0.95)', // Forest green overlay
  overlayLight: 'rgba(34, 68, 55, 0.75)', // Light overlay
  
  // ─── Sophisticated Text ───────────────────────────────────────────
  textPrimary: '#222222',      // Deep black
  textSecondary: '#666666',    // Medium gray
  textMuted: '#999999',        // Light gray
  textLight: '#CCCCCC',        // Very light
  textInverse: '#FFFFFF',      // White on dark
  textGold: '#C8A23A',         // Gold text
  textSuccess: '#2E8B57',      // Success green
  textError: '#D9534F',        // Error red
  
  // ─── Elegant Borders & Dividers ───────────────────────────────────
  border: '#E5E5E5',           // Standard border
  borderLight: '#F0F0F0',      // Light border
  borderMedium: '#D0D0D0',     // Medium border
  borderHeavy: '#B8B8B8',      // Heavy border
  divider: '#E8E8E8',          // Section dividers
  dividerGold: 'rgba(200, 162, 58, 0.20)', // Gold divider
  
  // ─── Status States (Premium Colors) ───────────────────────────────
  success: '#2E8B57',          // Forest green success
  successLight: '#D4EDDA',     // Light success bg
  successDark: '#1E5F3D',      // Dark success
  
  error: '#D9534F',            // Elegant red
  errorLight: '#F8D7DA',       // Light error bg
  errorDark: '#A94442',        // Dark error
  
  warning: '#F0AD4E',          // Soft amber
  warningLight: '#FCF8E3',     // Light warning bg
  warningDark: '#D9831F',      // Dark warning
  
  info: '#5BC0DE',             // Soft blue
  infoLight: '#D9EDF7',        // Light info bg
  infoDark: '#31B0D5',         // Dark info
  
  // ─── Luxury Shadows ───────────────────────────────────────────────
  shadowLight: 'rgba(0, 0, 0, 0.04)',
  shadowMedium: 'rgba(0, 0, 0, 0.08)',
  shadowHeavy: 'rgba(0, 0, 0, 0.12)',
  shadowXL: 'rgba(0, 0, 0, 0.16)',
  shadowGold: 'rgba(200, 162, 58, 0.15)',
  shadowGreen: 'rgba(34, 68, 55, 0.10)',
  
  // ─── Premium Gradients ────────────────────────────────────────────
  gradientPrimary: 'linear-gradient(135deg, #234437 0%, #2E5A4A 100%)',
  gradientGold: 'linear-gradient(135deg, #C8A23A 0%, #E5C86B 100%)',
  gradientEmerald: 'linear-gradient(135deg, #0F6B5C 0%, #10B981 100%)',
  gradientOverlay: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
  gradientShimmer: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
  
  // ─── Glass Effects (Luxury Blur) ──────────────────────────────────
  glass: 'rgba(255, 255, 255, 0.90)',
  glassDark: 'rgba(34, 68, 55, 0.80)',
  glassLight: 'rgba(255, 255, 255, 0.70)',
} as const;

export const SPACING = {
  xs: '0.25rem',     // 4px
  sm: '0.5rem',      // 8px
  md: '1rem',        // 16px
  lg: '1.5rem',      // 24px (Premium standard)
  xl: '2rem',        // 32px
  '2xl': '3rem',     // 48px
  '3xl': '4rem',     // 64px
  '4xl': '6rem',     // 96px
  '5xl': '8rem',     // 128px
} as const;

export const RADIUS = {
  none: '0',
  sm: '0.5rem',      // 8px
  md: '1rem',        // 16px
  lg: '1.5rem',      // 24px (Premium standard)
  xl: '2rem',        // 32px
  '2xl': '2.5rem',   // 40px
  full: '9999px',    // Circle
} as const;

export const SHADOWS = {
  none: 'none',
  xs: '0 1px 3px rgba(0, 0, 0, 0.04)',
  sm: '0 2px 8px rgba(0, 0, 0, 0.06)',
  md: '0 4px 16px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.10)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.12)',
  '2xl': '0 16px 48px rgba(0, 0, 0, 0.14)',
  '3xl': '0 24px 64px rgba(0, 0, 0, 0.16)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  
  // Luxury Colored Shadows
  gold: '0 4px 16px rgba(200, 162, 58, 0.20)',
  goldLg: '0 8px 24px rgba(200, 162, 58, 0.25)',
  green: '0 4px 16px rgba(34, 68, 55, 0.15)',
  greenLg: '0 8px 24px rgba(34, 68, 55, 0.20)',
  
  // Hover States
  hoverSm: '0 4px 12px rgba(0, 0, 0, 0.10)',
  hoverMd: '0 8px 20px rgba(0, 0, 0, 0.12)',
  hoverLg: '0 12px 32px rgba(0, 0, 0, 0.14)',
} as const;

export const TYPOGRAPHY = {
  // ─── Font Families ────────────────────────────────────────────────
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    secondary: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  
  // ─── Font Sizes (Luxury Scale) ────────────────────────────────────
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  // ─── Font Weights ─────────────────────────────────────────────────
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // ─── Line Heights ─────────────────────────────────────────────────
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // ─── Letter Spacing ───────────────────────────────────────────────
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const BREAKPOINTS = {
  mobile: '320px',    // Small phones
  sm: '640px',        // Large phones
  md: '768px',        // Tablets
  lg: '1024px',       // Laptops
  xl: '1280px',       // Desktops
  '2xl': '1536px',    // Large desktops
  '3xl': '1920px',    // Wide screens
} as const;

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  verySlow: '700ms cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Luxury Easing
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const ANIMATIONS = {
  fadeIn: 'fadeIn 0.3s ease-in-out',
  fadeOut: 'fadeOut 0.3s ease-in-out',
  slideUp: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  slideDown: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  slideLeft: 'slideLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  slideRight: 'slideRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  scaleUp: 'scaleUp 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  scaleDown: 'scaleDown 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  shimmer: 'shimmer 2s infinite',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  bounce: 'bounce 1s infinite',
  float: 'float 3s ease-in-out infinite',
  glow: 'glow 2s ease-in-out infinite',
} as const;

export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  max: 9999,
} as const;

export const BLUR = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const;

// ═══════════════════════════════════════════════════════════════════
// LUXURY COMPONENT VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const BUTTON_VARIANTS = {
  primary: {
    bg: COLORS.primary,
    hover: COLORS.primaryHover,
    text: COLORS.textInverse,
    shadow: SHADOWS.md,
  },
  gold: {
    bg: COLORS.gold,
    hover: COLORS.goldDark,
    text: COLORS.textInverse,
    shadow: SHADOWS.gold,
  },
  outline: {
    bg: 'transparent',
    hover: COLORS.surfaceHover,
    text: COLORS.primary,
    border: COLORS.border,
  },
  ghost: {
    bg: 'transparent',
    hover: COLORS.surfaceHover,
    text: COLORS.textPrimary,
  },
} as const;

export const CARD_VARIANTS = {
  default: {
    bg: COLORS.surface,
    shadow: SHADOWS.sm,
    hoverShadow: SHADOWS.md,
    border: COLORS.border,
  },
  elevated: {
    bg: COLORS.surfaceElevated,
    shadow: SHADOWS.md,
    hoverShadow: SHADOWS.lg,
    border: 'none',
  },
  luxury: {
    bg: COLORS.surface,
    shadow: SHADOWS.lg,
    hoverShadow: SHADOWS.xl,
    border: COLORS.dividerGold,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getResponsiveValue = (breakpoint: keyof typeof BREAKPOINTS): string => {
  return `@media (min-width: ${BREAKPOINTS[breakpoint]})`;
};
