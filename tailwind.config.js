/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Comeet 브랜드 컬러
        primary: {
          DEFAULT: '#667eea',
          50: '#f5f7ff',
          100: '#ebefff',
          200: '#d6dfff',
          300: '#b3c2ff',
          400: '#8da0ff',
          500: '#667eea',  // Main
          600: '#5568d3',
          700: '#4552ba',
          800: '#3a4599',
          900: '#2f3777',
        },
        error: {
          DEFAULT: '#ff9800',
          light: '#ffb74d',
          dark: '#f57c00',
        },
        background: '#f6f8fb',
        surface: '#ffffff',
        'text-primary': '#1a1a1a',
        'text-secondary': '#8b95a1',
        border: '#e0e0e0',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'DEFAULT': '8px',
        'lg': '16px',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'DEFAULT': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'button-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        'DEFAULT': '200ms',
      },
    },
  },
  plugins: [],
}
