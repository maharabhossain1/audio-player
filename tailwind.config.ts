import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        source_sans_3: ['var(--font-source_sans_3)', ...fontFamily.sans],
        hidayatullah_demo: ['var(--font-hidayatullah-demo)', ...fontFamily.mono],
        lateef: ['var(--font-lateef)'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        neutral: {
          DEFAULT: '#FFFFFF',
          50: '#FAF6F5',
          100: '#F9F5F1',
          200: '#EDE9E5',
          300: '#E1DCD8',
          400: '#B2A59A',
          500: '#85776A',
          600: '#66574A',
          700: '#50473E',
          800: '#393028',
          900: '#241D18',
          950: '#000000',
        },
        brown: {
          DEFAULT: '',
          100: '#FCF8F3',
          300: '#D1A461',
          500: '#A27B3F',
          600: '#6E4302',
        },
        green: {
          500: '#479E64'
        },
        red: {
          500: "#BD544C"
        }
      },
      dropShadow: {
        DEFAULT: '0px 1px 3px 0px #0000001A',
        "sm": " 0px 3px 10px 0px rgba(0, 0, 0, 0.06)"
      },
      maxWidth: {
        '4xl': '54.5rem',
        '8xl': '82.5rem',
        '9xl': '97.5rem',
      },
      borderRadius: {
        '4xl': '32px',
      }
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config


