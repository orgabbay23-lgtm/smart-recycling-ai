/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16, 24, 40, 0.06), 0 8px 24px -8px rgba(16, 24, 40, 0.10)',
        card: '0 1px 3px rgba(16, 24, 40, 0.04), 0 12px 32px -12px rgba(16, 24, 40, 0.16)',
        'glow-emerald': '0 8px 24px -8px rgba(16, 185, 129, 0.55)',
        'glow-amber': '0 8px 24px -8px rgba(245, 158, 11, 0.55)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-up': 'fade-in-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
