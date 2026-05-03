import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Forest-dark scale — replaces old navy blue.
        // All navy-* classes automatically pick up the new palette.
        navy: {
          DEFAULT: '#060E09',
          50:  '#E4F0EA',
          100: '#C0D9CB',
          200: '#8FB8A0',
          300: '#619478',
          400: '#3D7358',
          500: '#265440',
          600: '#1A3D2E',
          700: '#112A1E',
          800: '#0C1C14',
          900: '#060E09',
        },
        // Electric green — kept for CTAs, glows, highlights
        green: {
          DEFAULT: '#00C853',
          50:  '#E0F9EC',
          100: '#B3F1CF',
          200: '#7DE8AF',
          300: '#3EDE8E',
          400: '#00D673',
          500: '#00C853',
          600: '#00B047',
          700: '#009439',
          800: '#007A2C',
          900: '#005F1F',
        },
        // Brand forest green — gs-emobility.com primary
        forest: {
          DEFAULT: '#0D4F3D',
          50:  '#E8F5EF',
          100: '#C3E5D5',
          200: '#8CC9AD',
          300: '#55AD85',
          400: '#2E9468',
          500: '#0D7A52',
          600: '#0D4F3D',
          700: '#0A3D2F',
          800: '#072B21',
          900: '#041912',
        },
      },
      fontFamily: {
        // Montserrat for everything — matches gs-emobility.com brand
        sans:    ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-montserrat)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.025em',
        tight:    '-0.015em',
        normal:   '0em',
        wide:     '0.05em',
        wider:    '0.1em',
        widest:   '0.15em',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.8s ease-out forwards',
        'slide-right':'slideRight 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'count-up':   'countUp 2s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // Deep forest dark — shifts from blue-navy to green-forest
        'gradient-hero': 'linear-gradient(135deg, #060E09 0%, #0F2218 50%, #060E09 100%)',
      },
    },
  },
  plugins: [],
}

export default config
