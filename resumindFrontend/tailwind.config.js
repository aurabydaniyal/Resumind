/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020617',
          900: '#030712',
          850: '#070E1E',
          800: '#0B132B',
          700: '#0F172A',
          600: '#1E293B',
          500: '#334155',
        },
        electric: {
          900: '#1E3A8A',
          800: '#1D4ED8',
          700: '#2563EB',
          600: '#3B82F6',
          500: '#60A5FA',
          400: '#93C5FD',
          300: '#BFDBFE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(3, 7, 18, 0.45)',
        'glass-glow': '0 0 25px -5px rgba(59, 130, 246, 0.25)',
        'blue-glow': '0 0 40px -10px rgba(37, 99, 235, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
