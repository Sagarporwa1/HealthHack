// Premium Theme and Design System (2026 Edition)
export const theme = {
  colors: {
    // Primary - Trustworthy Deep Blue
    primary: '#0F62FE',
    primaryDark: '#002D9C',
    primaryLight: '#D0E1FF',
    primaryGradient: ['#0F62FE', '#3F7DFF'],

    // Secondary - Modern Teal/Green
    secondary: '#00BFA5',
    secondaryDark: '#00897B',
    secondaryLight: '#E0F2F1',
    secondaryGradient: ['#00BFA5', '#26E4CC'],

    // Status - High Contrast
    success: '#24A148',
    warning: '#FF832B',
    danger: '#DA1E28',
    info: '#0043CE',

    // Risk levels
    riskLow: '#24A148',
    riskMedium: '#F1C21B',
    riskHigh: '#DA1E28',

    // Neutrals
    background: '#F4F7FB',
    surface: '#FFFFFF',
    surfaceSubtle: '#F2F4F8',
    card: '#FFFFFF',

    // Text
    textPrimary: '#161616',
    textSecondary: '#525252',
    textLight: '#8D8D8D',
    textWhite: '#FFFFFF',
    textOnPrimary: '#FFFFFF',

    // Borders
    border: '#E0E0E0',
    borderLight: '#F4F4F4',
    borderFocused: '#0F62FE',

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.6)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    glassBackground: 'rgba(255, 255, 255, 0.8)',
  },

  // High-performance Typography
  fonts: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 48,
  },

  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
  },

  // Fluid Spacing
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Modern Border Radius
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    round: 9999,
  },

  // Subtle & Complex Shadows
  shadows: {
    none: {
      shadowColor: 'transparent',
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 10,
    },
    inner: {
      // Logic for inner shadows in RN covers this with specific styles
    }
  },

  // Animations & Transitions
  animations: {
    speed: {
      fast: 150,
      normal: 300,
      slow: 500,
    }
  }
};
