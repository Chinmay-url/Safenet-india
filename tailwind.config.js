/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0F',
        surface: '#111118',
        panel: '#1A1A24',
        border: '#2A2A3A',
        accent: '#FF3B3B',
        safe: '#00D68F',
        warn: '#FFB800',
        muted: '#6B6B80',
        bright: '#F0F0FF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
