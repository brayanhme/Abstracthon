/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dominant: '#FFFBF7',
        surface: {
          soft: '#FFE1C6',
          white: '#FFFFFF',
        },
        brand: {
          orange: '#FF7A00',
          orangeHover: '#E06800',
          navy: '#1E3A8A',
          muted: '#526384',
        },
        eco: {
          green: '#6B8F5E',
          sky: '#9EC5E8',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 4px 20px -2px rgba(30, 58, 138, 0.06)',
        'clean-hover': '0 12px 30px -4px rgba(30, 58, 138, 0.12)',
        'orange-glow': '0 8px 24px -4px rgba(255, 122, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
