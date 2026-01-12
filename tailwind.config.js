/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfaf3',
          100: '#faf3e0',
          200: '#f5e6c0',
          300: '#efd495',
          400: '#e5bc64',
          500: '#c9a962',
          600: '#b8943d',
          700: '#9a7633',
          800: '#7d5f2d',
          900: '#674e28',
        },
        cream: {
          50: '#fefdfb',
          100: '#faf8f3',
          200: '#f5f0e6',
          300: '#ede5d5',
          400: '#e2d5bf',
        },
        // Neutral palette for admin
        slate: {
          25: '#fcfcfd',
          50: '#f8fafc',
          75: '#f3f6f9',
        },
      },
      fontFamily: {
        sans: ['Heebo', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.05)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 2px 8px -1px rgb(0 0 0 / 0.04)',
        'elevated': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 10px 20px -2px rgb(0 0 0 / 0.04)',
        'dropdown': '0 4px 16px -2px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-down': 'slideDown 0.15s ease-out',
        'slide-up': 'slideUp 0.15s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
