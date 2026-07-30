/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F9F6F0',
          200: '#F5F0EB',
          300: '#EFE8DE',
          400: '#E2D7C7',
        },
        forest: {
          50: '#F2F7F4',
          100: '#DEEBE3',
          500: '#274A37',
          700: '#1E3A2B',
          800: '#172E22',
          900: '#102118',
        },
        terracotta: {
          400: '#E07A55',
          500: '#D96B43',
          600: '#C25630',
        },
        warmgold: {
          400: '#EEB156',
          500: '#E6A140',
          600: '#D4902F',
        },
        earthteal: {
          400: '#34948A',
          500: '#2A7B72',
          600: '#1F5E57',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
