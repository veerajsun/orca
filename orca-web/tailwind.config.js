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
        orca: {
          bg: '#121212',
          surface: '#181818',
          card: '#1c1b1b',
          cardHover: '#242323',
          border: '#2b2a2a',
          accent: '#ffffff',
          textMuted: '#9ca3af',
          glass: 'rgba(255, 255, 255, 0.05)',
          glassBorder: 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'Inter', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neo-raised': '-6px -6px 16px rgba(255, 255, 255, 0.02), 6px 6px 16px rgba(0, 0, 0, 0.6)',
        'neo-raised-sm': '-3px -3px 10px rgba(255, 255, 255, 0.02), 3px 3px 10px rgba(0, 0, 0, 0.5)',
        'neo-inset': 'inset 4px 4px 10px rgba(0, 0, 0, 0.7), inset -4px -4px 10px rgba(255, 255, 255, 0.02)',
        'liquid-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glow-subtle': '0 0 25px rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
