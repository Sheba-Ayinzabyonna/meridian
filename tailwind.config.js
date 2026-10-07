/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Meridian brand colors
        'meridian-teal': '#0D4F5C',
        'meridian-gold': '#C9A84C',
        'meridian-cream': '#F8F4EC',
        'meridian-coral': '#E8A9A1',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'DM Sans', 'sans-serif'],
      },
      animation: {
        'compass-spin': 'spin 8s linear infinite',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};
