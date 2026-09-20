/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 34px rgba(250, 204, 21, .38)',
        panel: '0 24px 80px rgba(0, 0, 0, .28)',
      },
      animation: {
        'soft-pulse': 'softPulse 2.4s ease-in-out infinite',
        'confetti-fall': 'confettiFall 1.4s ease-out forwards',
      },
      keyframes: {
        softPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.035)', opacity: '.86' },
        },
        confettiFall: {
          '0%': { transform: 'translate3d(0, -20px, 0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate3d(var(--x), 220px, 0) rotate(540deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
