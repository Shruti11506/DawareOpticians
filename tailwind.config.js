/** @type {import('tailwindcss').Config} */

const graphite = {
  50: '#F5F6F8',
  100: '#EAECEF',
  200: '#D5D9E0',
  300: '#B0B8C5',
  400: '#7E899B',
  500: '#5A6372',
  600: '#404753',
  700: '#2F343E',
  800: '#23272F', // Rich deep graphite
  850: '#1C2026', // Deep graphite container
  900: '#16191E', // Primary deep graphite
  950: '#101216', // Deepest graphite
};

const sunshine = {
  50: '#FEFCE8',
  100: '#FEF9C3',
  200: '#FEF08A',
  300: '#FDE047',
  400: '#FACC15', // Vibrant Sunshine Yellow
  500: '#EAB308', // Warm Sunshine
  600: '#CA8A04',
  700: '#A16207',
  800: '#854D0E',
  900: '#713F12',
};

const softwhite = {
  50: '#FCFCFD',
  100: '#F8F9FA', // Main soft white background
  200: '#EEF0F3',
  300: '#E2E5E9',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite,
        sunshine,
        softwhite,
        slate: graphite,
        navy: graphite,
        gold: sunshine,
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(22, 25, 30, 0.04), 0 1px 2px -1px rgba(22, 25, 30, 0.04)',
        'card-hover': '0 8px 20px -3px rgba(22, 25, 30, 0.08), 0 3px 8px -2px rgba(22, 25, 30, 0.04)',
        'card-lg': '0 14px 32px -4px rgba(22, 25, 30, 0.12), 0 6px 12px -3px rgba(22, 25, 30, 0.06)',
        'sunshine': '0 4px 14px 0 rgba(250, 204, 21, 0.35)',
        'sunshine-lg': '0 8px 24px -2px rgba(250, 204, 21, 0.45)',
      }
    },
  },
  plugins: [],
}
