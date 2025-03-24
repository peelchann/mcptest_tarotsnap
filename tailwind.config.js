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
        agatha: {
          dark: '#190029',
          deeper: '#32004A',
          purple: '#4A0072',
          accent: '#8E24AA',
          vibrant: '#6A0DAD',
          mist: 'rgba(110, 33, 172, 0.4)',
          glow: 'rgba(147, 51, 234, 0.8)',
          rune: '#B026FF',
          black: '#0A0A0A',
        },
      },
      fontFamily: {
        mystical: ['Cinzel', 'serif'],
        body: ['Lato', 'sans-serif'],
        witchcraft: ['Cinzel', 'serif'],
      },
      backgroundImage: {
        'stars-pattern': "url('/images/stars-bg.png')",
        'agatha-gradient': 'linear-gradient(135deg, #32004A 0%, #4A0072 50%, #190029 100%)',
        'magic-circle': 'radial-gradient(circle, rgba(110, 33, 172, 0.3) 0%, rgba(25, 0, 41, 0) 70%)',
        'spell-glow': 'radial-gradient(circle, rgba(176, 38, 255, 0.5) 0%, rgba(25, 0, 41, 0) 70%)',
        'dark-mist': 'linear-gradient(to bottom, rgba(25, 0, 41, 0.8), rgba(25, 0, 41, 0))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spell-cast': 'spellCast 2s ease-out forwards',
        'magic-pulse': 'magicPulse 3s ease-in-out infinite',
        'rune-appear': 'runeAppear 2.5s ease-in-out forwards',
        'dark-mist': 'darkMist 8s ease-in-out infinite',
        'witchcraft': 'witchcraft 3s ease-in-out infinite',
        'magic-text': 'magicText 3s ease-in-out infinite',
        'witch-finger': 'witchFinger 1.5s ease-in-out infinite',
        'power-drain': 'powerDrain 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(156, 39, 176, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(156, 39, 176, 0.8)' },
        },
        spellCast: {
          '0%': { 
            transform: 'scale(0.2)', 
            opacity: '0.1',
            background: 'rgba(110, 33, 172, 0.8)'
          },
          '50%': { 
            transform: 'scale(1.3)', 
            opacity: '0.8',
            background: 'rgba(176, 38, 255, 0.5)'
          },
          '100%': { 
            transform: 'scale(1.5)', 
            opacity: '0',
            background: 'rgba(176, 38, 255, 0)'
          }
        },
        magicPulse: {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 10px rgba(176, 38, 255, 0.7), 0 0 20px rgba(110, 33, 172, 0.5), inset 0 0 10px rgba(110, 33, 172, 0.7)' 
          },
          '50%': { 
            transform: 'scale(1.05)', 
            boxShadow: '0 0 20px rgba(176, 38, 255, 0.9), 0 0 30px rgba(110, 33, 172, 0.7), inset 0 0 15px rgba(110, 33, 172, 0.9)' 
          },
        },
        runeAppear: {
          '0%': { 
            transform: 'scale(0.7) rotate(-15deg)', 
            opacity: '0',
            filter: 'blur(5px)' 
          },
          '70%': { 
            transform: 'scale(1.1) rotate(5deg)', 
            opacity: '0.9',
            filter: 'blur(0px)' 
          },
          '85%, 100%': { 
            transform: 'scale(1) rotate(0deg)', 
            opacity: '1',
            filter: 'blur(0px)' 
          }
        },
        darkMist: {
          '0%, 100%': { 
            transform: 'translateX(0) translateY(0)',
            opacity: '0.7'
          },
          '50%': { 
            transform: 'translateX(40px) translateY(-20px)',
            opacity: '0.5'
          }
        },
        witchcraft: {
          '0%': { 
            transform: 'rotate(0deg) scale(1)',
            borderColor: 'rgba(110, 33, 172, 0.7)'
          },
          '50%': { 
            transform: 'rotate(180deg) scale(1.1)',
            borderColor: 'rgba(176, 38, 255, 0.9)'
          },
          '100%': { 
            transform: 'rotate(360deg) scale(1)',
            borderColor: 'rgba(110, 33, 172, 0.7)'
          }
        },
        magicText: {
          '0%, 100%': { 
            textShadow: '0 0 8px rgba(176, 38, 255, 0.7), 0 0 12px rgba(110, 33, 172, 0.5)'
          },
          '50%': { 
            textShadow: '0 0 12px rgba(176, 38, 255, 0.9), 0 0 18px rgba(110, 33, 172, 0.7)'
          }
        },
        witchFinger: {
          '0%, 100%': { 
            boxShadow: '0 0 8px rgba(176, 38, 255, 0.7), 0 0 12px rgba(110, 33, 172, 0.5)',
            background: 'rgba(74, 0, 114, 0.9)'
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(176, 38, 255, 0.9), 0 0 20px rgba(110, 33, 172, 0.7)',
            background: 'rgba(110, 33, 172, 0.9)'
          }
        },
        powerDrain: {
          '0%': { 
            filter: 'hue-rotate(0deg) brightness(1)'
          },
          '50%': { 
            filter: 'hue-rotate(30deg) brightness(1.2)'
          },
          '100%': { 
            filter: 'hue-rotate(0deg) brightness(1)'
          }
        }
      },
      boxShadow: {
        'agatha-glow': '0 0 15px rgba(176, 38, 255, 0.7), 0 0 30px rgba(110, 33, 172, 0.4)',
        'witch-rune': '0 0 8px rgba(176, 38, 255, 0.6), inset 0 0 6px rgba(110, 33, 172, 0.8)',
        'dark-magic': '0 10px 25px -5px rgba(25, 0, 41, 0.8), 0 8px 10px -6px rgba(25, 0, 41, 0.6)',
        'spell-aura': '0 0 15px rgba(176, 38, 255, 0.5), 0 0 30px rgba(110, 33, 172, 0.3), 0 0 45px rgba(74, 0, 114, 0.2)',
      },
      dropShadow: {
        'agatha': '0 0 8px rgba(176, 38, 255, 0.6)',
        'dark-text': '0 2px 4px rgba(10, 10, 10, 0.8)',
      },
      textShadow: {
        'witch': '0 0 8px rgba(176, 38, 255, 0.6), 0 0 12px rgba(110, 33, 172, 0.4)',
        'magical': '0 0 5px rgba(176, 38, 255, 0.7), 0 0 10px rgba(110, 33, 172, 0.5), 0 0 15px rgba(74, 0, 114, 0.3)',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        'spell': '38% 62% 63% 37% / 41% 44% 56% 59%',
      },
      backdropBlur: {
        'mist': '8px',
      },
    },
  },
  plugins: [],
}; 