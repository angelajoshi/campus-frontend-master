/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:     '#040a18',
        surface:'#070f22',
        card:   '#0b1530',
        border: 'rgba(255,255,255,0.08)',
        gold:   '#e8b84b',
        gold2:  '#ffd87a',
        cyan:   '#00d8ff',
        green:  '#00ff88',
        red:    '#ff4466',
        muted:  '#607085',
      },
      backgroundImage: {
        'grad-gold':  'linear-gradient(135deg,#e8b84b,#ffd87a)',
        'grad-cyan':  'linear-gradient(135deg,#00d8ff,#0094b3)',
        'grad-green': 'linear-gradient(135deg,#00ff88,#00c86a)',
        'grad-dark':  'linear-gradient(180deg,#070f22,#040a18)',
      },
      boxShadow: {
        glow:       '0 0 30px rgba(232,184,75,0.25)',
        'glow-cyan':'0 0 30px rgba(0,216,255,0.25)',
        'glow-green':'0 0 30px rgba(0,255,136,0.25)',
        card:       '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(232,184,75,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(232,184,75,0)' } },
      },
    },
  },
  plugins: [],
};
