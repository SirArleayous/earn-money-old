/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sinex: {
          primary: '#00d7c0',
          hover: '#00b8a4',
          secondary: '#0F172A',
          accent: '#2563EB',
          light: '#F8FAFC',
          dark: '#020710',
          card: '#0d131f'
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'sinex-glow': '0 0 20px rgba(0, 215, 192, 0.35)',
        'sinex-card': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}