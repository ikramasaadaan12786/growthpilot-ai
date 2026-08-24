import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          DEFAULT: '#6366f1',
          foreground: '#ffffff'
        },
        instagram: {
          DEFAULT: '#E1306C',
          gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          light: '#fdf2f8',
          dark: '#833ab4'
        },
        facebook: {
          DEFAULT: '#1877F2',
          light: '#eff6ff',
          dark: '#0c52b0'
        },
        linkedin: {
          DEFAULT: '#0A66C2',
          light: '#f0f7ff',
          dark: '#004182'
        },
        tiktok: {
          DEFAULT: '#000000',
          accent: '#FE2C55',
          cyan: '#25F4EE',
          light: '#fdf4f5'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-ig': '0 0 25px -5px rgba(225, 48, 108, 0.4)',
        'glow-fb': '0 0 25px -5px rgba(24, 119, 242, 0.4)',
        'glow-li': '0 0 25px -5px rgba(10, 102, 194, 0.4)',
        'glow-tt': '0 0 25px -5px rgba(254, 44, 85, 0.4)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-dark': '0 4px 25px -2px rgba(0, 0, 0, 0.3), 0 2px 10px -1px rgba(0, 0, 0, 0.2)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite'
      }
    },
  },
  plugins: [],
};
export default config;
