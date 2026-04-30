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
          purple: '#5C0096',
          accent: '#A035C0',
          vibrant: '#8829D0',
          mist: 'rgba(149, 65, 211, 0.7)',
          glow: 'rgba(147, 51, 234, 0.9)',
          rune: '#CB6BFF',
          black: '#0A0A0A',
          light: '#E9D1FD',
        },
        // ── Coven Luxe palette ──────────────────────────────────────
        coven: {
          midnight: '#0B0810',
          deep: '#050308',
          ink: '#1A1023',
          plum: '#24122F',
          violet: '#4D2A67',
          spell: '#7A45A5',
          aura: '#9D62D3',
          fog: '#BFAEDC',
          bone: '#EAE2D2',
          paper: '#D8C8A8',
          gold: '#B08A49',
          'soft-gold': '#D8B66A',
          silver: '#BFC4D6',
          wine: '#6B2237',
          danger: '#8E2A43',
        },
        'agatha-navy': '#1E1E3F',
        'agatha-mid': '#2E2E5F',
        'gold-400': '#C8AD7F',
        'gold-500': '#B8986A',
      },
      fontFamily: {
        mystical: ['Cinzel', 'serif'],
        body: ['Lato', 'sans-serif'],
        witchcraft: ['Cinzel', 'serif'],
        // ── Coven Luxe families (CSS vars from next/font) ─────────
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'stars-pattern': "url('/images/stars-bg.png')",
        'agatha-gradient': 'linear-gradient(135deg, #32004A 0%, #4A0072 50%, #190029 100%)',
        'magic-circle': 'radial-gradient(circle, rgba(110, 33, 172, 0.3) 0%, rgba(25, 0, 41, 0) 70%)',
        'spell-glow': 'radial-gradient(circle, rgba(176, 38, 255, 0.5) 0%, rgba(25, 0, 41, 0) 70%)',
        'dark-mist': 'linear-gradient(to bottom, rgba(25, 0, 41, 0.8), rgba(25, 0, 41, 0))',
        // Coven radial backdrops
        'coven-radial':
          'radial-gradient(ellipse at 20% 10%, rgba(122, 69, 165, 0.35) 0%, transparent 55%), radial-gradient(ellipse at 85% 30%, rgba(107, 34, 55, 0.28) 0%, transparent 60%), radial-gradient(ellipse at 50% 90%, rgba(36, 18, 47, 0.7) 0%, transparent 70%)',
        'coven-velvet':
          'linear-gradient(180deg, #0B0810 0%, #1A1023 60%, #0B0810 100%)',
        'coven-foil':
          'linear-gradient(135deg, rgba(216, 182, 106, 0.12) 0%, rgba(176, 138, 73, 0.32) 45%, rgba(216, 182, 106, 0.12) 100%)',
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
        // Coven motions
        'coven-drift': 'covenDrift 60s ease-in-out infinite',
        'coven-drift-alt': 'covenDriftAlt 75s ease-in-out infinite',
        'coven-spin': 'covenSpin 8s linear infinite',
        'coven-pulse': 'covenPulse 4s ease-in-out infinite',
        'coven-shimmer': 'covenShimmer 2.4s ease-in-out infinite',
        'coven-fade-up': 'covenFadeUp 0.7s ease-out forwards',
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
          '0%': { filter: 'hue-rotate(0deg) brightness(1)' },
          '50%': { filter: 'hue-rotate(30deg) brightness(1.2)' },
          '100%': { filter: 'hue-rotate(0deg) brightness(1)' }
        },
        // Coven keyframes
        covenDrift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(60px, -40px, 0) scale(1.05)' },
          '66%': { transform: 'translate3d(-40px, 30px, 0) scale(0.97)' },
        },
        covenDriftAlt: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-80px, 50px, 0) scale(1.08)' },
        },
        covenSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        covenPulse: {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        covenShimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(220%) skewX(-20deg)' },
        },
        covenFadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'agatha-glow': '0 0 15px rgba(176, 38, 255, 0.7), 0 0 30px rgba(110, 33, 172, 0.4)',
        'witch-rune': '0 0 8px rgba(176, 38, 255, 0.6), inset 0 0 6px rgba(110, 33, 172, 0.8)',
        'dark-magic': '0 10px 25px -5px rgba(25, 0, 41, 0.8), 0 8px 10px -6px rgba(25, 0, 41, 0.6)',
        'spell-aura': '0 0 15px rgba(176, 38, 255, 0.5), 0 0 30px rgba(110, 33, 172, 0.3), 0 0 45px rgba(74, 0, 114, 0.2)',
        'cta': '0 0 0 2px rgba(176, 38, 255, 1), 0 0 15px rgba(110, 33, 172, 0.6)',
        // Coven shadows — restrained gold + purple
        'coven-gold':
          '0 0 0 1px rgba(176, 138, 73, 0.45), 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 28px rgba(216, 182, 106, 0.18)',
        'coven-aura':
          '0 0 0 1px rgba(176, 138, 73, 0.4), 0 18px 40px -20px rgba(0, 0, 0, 0.85), 0 0 38px rgba(122, 69, 165, 0.32)',
        'coven-deep':
          '0 18px 50px -22px rgba(0, 0, 0, 0.9), 0 8px 18px -10px rgba(0, 0, 0, 0.65)',
        'coven-ring':
          '0 0 0 1px rgba(216, 182, 106, 0.5), 0 0 0 4px rgba(122, 69, 165, 0.18)',
      },
      dropShadow: {
        'agatha': '0 0 8px rgba(176, 38, 255, 0.6)',
        'dark-text': '0 2px 4px rgba(10, 10, 10, 0.8)',
        'light-text': '0 1px 2px rgba(233, 209, 253, 0.4)',
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
      fontSize: {
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      lineHeight: {
        'tight': '1.1',
        'normal': '1.5',
        'relaxed': '1.75',
      },
      letterSpacing: {
        'kicker': '0.3em',
      },
    },
  },
  plugins: [],
};
