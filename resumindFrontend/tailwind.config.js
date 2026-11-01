/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          'smart-blue': '#0466c8',
          'steel-azure': '#0353a4',
          'regal-navy': '#023e7d',
          'prussian-1': '#002855',
          'prussian-2': '#001845',
          'prussian-3': '#001233',
          'twilight-indigo': '#33415c',
          'blue-slate': '#5c677d',
          'slate-grey': '#7d8597',
          'cool-steel': '#979dac',
        },
        space: {
          950: '#001233', // Prussian Blue Deepest
          900: '#001845', // Prussian Blue Deep
          850: '#002855', // Prussian Blue
          800: '#023e7d', // Regal Navy
          700: '#33415c', // Twilight Indigo
          600: '#5c677d', // Blue Slate
          500: '#7d8597', // Slate Grey
          400: '#979dac', // Cool Steel
        },
        electric: {
          950: '#001845', // Prussian Blue
          900: '#002855', // Prussian Blue
          800: '#023e7d', // Regal Navy
          700: '#0353a4', // Steel Azure
          600: '#0466c8', // Smart Blue
          500: '#0466c8', // Smart Blue
          400: '#3b9eff', // Luminous Smart Blue for text legibility
          300: '#979dac', // Cool Steel
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 18, 51, 0.65), inset 0 1px 0 0 rgba(151, 157, 172, 0.22)',
        'glass-glow': '0 0 28px -4px rgba(4, 102, 200, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'blue-glow': '0 0 42px -8px rgba(4, 102, 200, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
