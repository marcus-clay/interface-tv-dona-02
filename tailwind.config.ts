import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

/**
 * Design Tokens Implementation from 02_DESIGN_TOKENS.md
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 03_RESPONSIVE_STRATEGY.md
      screens: {
        'mobile': '320px',  // Mobile start
        'tablet': '640px',  // Tablet start
        'desktop': '1024px',// Desktop start
        'tv': '1440px',     // TV start (optimisé 1920px)
      },
      // 02_DESIGN_TOKENS.md - Colors
      colors: {
        black: {
          pure: '#000000',
          elevated: '#0A0A0A',
        },
        surface: {
          card: '#141414',
          hover: '#1A1A1A',
        },
        border: {
          subtle: '#222222',
          visible: '#333333',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#999999',
          tertiary: '#666666',
          muted: '#444444',
        },
        accent: {
          primary: '#E50914', // Rouge cinéma
          gold: '#D4AF37',    // Premium/Awards
          glow: 'rgba(229, 9, 20, 0.4)',
        },
      },
      // 02_DESIGN_TOKENS.md - Typography
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        // [fontSize, { lineHeight, letterSpacing, fontWeight }]
        'display-tv': ['96px', { lineHeight: '1.1', letterSpacing: '0.05em', fontWeight: '300' }],
        'display-desktop': ['64px', { lineHeight: '1.1', letterSpacing: '0.05em', fontWeight: '300' }],
        'display-mobile': ['32px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '300' }],
        
        'h1-tv': ['56px', { fontWeight: '400' }],
        'h1-desktop': ['40px', { fontWeight: '400' }],
        'h1-mobile': ['24px', { fontWeight: '400' }],
        
        'h2-tv': ['40px', { fontWeight: '500' }],
        'h2-mobile': ['20px', { fontWeight: '500' }],
        
        'body-tv': ['24px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-base': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-mobile': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        
        'caption': ['13px', { fontWeight: '400' }],
        'overline': ['10px', { letterSpacing: '0.1em', fontWeight: '600' }],
      },
      // 02_DESIGN_TOKENS.md - Spacing Scale (4px base)
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
        '30': '7.5rem', // 120px
      },
      // 02_DESIGN_TOKENS.md - Animations
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      transitionDuration: {
        'micro': '150ms',
        'ui': '300ms',
        'page': '500ms',
        'cinematic': '800ms',
      },
      boxShadow: {
        'glow': '0 0 40px var(--accent-glow)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.00) 100%)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.05' },
          '50%': { opacity: '0.1' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}