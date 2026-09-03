import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],       // default body font
        display: ['Cal Sans', 'sans-serif'], // headings ke liye
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        brand: {
          primary: '#5b5bd6',   // main purple
          secondary: '#6049CD',   // logo purple
          hover: '#4a4ac4',
        }, neutral: {
          900: '#111127',   // heading text
          600: '#6b6b8a',   // body/muted text
          400: '#9898b3',   // placeholder/hint
          200: '#e4e4ee',   // borders
          100: '#ebebff',   // icon bg
          50: '#f5f5f5',   // hover bg
        },
        bg: {
          from: '#F0F2FD',  // gradient start
          to: '#E6E4FD',  // gradient end
        },
      },
      borderRadius: {
        'card': '10px',
        'input': '8px',
        'pill': '30px',
        'icon': '8px',
      },
      fontSize: {
        'display-lg': ['2.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-xl': ['40px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-lg': ['30px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md': ['1.625rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'body-lg': ['18px', { lineHeight: '1.65' }],
        'body-md': ['16px', { lineHeight: '1.65' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'label': ['13px', { lineHeight: '1.4' }],
      },
      spacing:{
        'page': '70px',
      }
    },
  },

  plugins: [
    require("tailwindcss-animate"),
  ],
};