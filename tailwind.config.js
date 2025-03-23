/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mystical: {
          dark: '#0F0F1A',
          primary: '#1F1F3D',
          accent: '#9C27B0',
          light: '#E1BEE7',
          gold: '#FFD700',
        },
      },
      fontFamily: {
        mystical: ['Cinzel', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      backgroundImage: {
        'stars-pattern': "url('/images/stars-bg.png')",
        'mystical-gradient': 'linear-gradient(to right, #9C27B0, #1F1F3D)',
        'gold-gradient': 'linear-gradient(to right, #FFD700, #FFC107)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
        'spin-slow-reverse': 'spin 25s linear infinite reverse',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 1s ease-in forwards',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'drawing': 'drawing 2s ease-in-out forwards',
        'rotate-y-180': 'rotateY 0.7s ease-in-out forwards',
        'rotate-y-0': 'rotateYBack 0.7s ease-in-out forwards',
        'scroll': 'scroll 60s linear infinite',
        'scroll-reverse': 'scroll 60s linear infinite reverse',
        'scroll-slow': 'scroll 120s linear infinite',
        'scroll-reverse-slow': 'scroll 120s linear infinite reverse',
        'scroll-fast': 'scroll 30s linear infinite',
        'scroll-reverse-fast': 'scroll 30s linear infinite reverse',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(156, 39, 176, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(156, 39, 176, 0.6), 0 0 40px rgba(156, 39, 176, 0.3)' },
          '100%': { boxShadow: '0 0 5px rgba(156, 39, 176, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 200%' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' }
        },
        drawing: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' }
        },
        rotateY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' }
        },
        rotateYBack: {
          '0%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(0deg)' }
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' }
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(156, 39, 176, 0.4)',
        'glow-md': '0 0 15px rgba(156, 39, 176, 0.5), 0 0 30px rgba(156, 39, 176, 0.2)',
        'glow-lg': '0 0 25px rgba(156, 39, 176, 0.6), 0 0 50px rgba(156, 39, 176, 0.3)',
        'gold-glow': '0 0 15px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.2)',
        'glow-purple': '0 0 20px rgba(156, 39, 176, 0.5), 0 0 40px rgba(156, 39, 176, 0.2)',
        'glow-gold': '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      transformOrigin: {
        'center-left': '0% 50%',
        'center-right': '100% 50%',
      },
    },
  },
  plugins: [],
}; 