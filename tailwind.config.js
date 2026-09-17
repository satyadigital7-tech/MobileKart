/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1E3D',      // MobileKart Dark Navy
          blue: '#0084FF',      // MobileKart Vibrant Electric Blue
          sky: '#38BDF8',       // MobileKart Sky Blue Highlight
          primary: '#0084FF',   // Primary Vibrant Blue
          accent: '#0284C7',    // Accent Deep Blue
          dark: '#0B1E3D',      // Deep Dark Navy
          card: '#1E293B',
          gold: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(0, 132, 255, 0.4)',
        'glow-navy': '0 0 20px -5px rgba(11, 30, 61, 0.4)',
      }
    },
  },
  plugins: [],
}
