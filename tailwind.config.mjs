const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
  ],
  theme: {
    backgroundColor: {
      background: 'var(--background)',
      secondary: 'var(--secondary)',
    },
    borderColor: {
      secondary: 'var(--secondary)',
    },
    textColor: {
      'secondary-foreground': 'var(--secondary-foreground)',
      secondary: 'var(--secondary)',
      destructive: 'var(--destructive)',
    },
    extend: {
      keyframes: {
        'scroll-x': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'sprite-x': {
          '0%': { backgroundPosition: '0 0' },
          '100%': {
            backgroundPosition: 'calc(-1 * var(--frame-w) * var(--frames)) 0',
          },
        },
        'sprite-y': {
          '0%': { transform: 'translateY(0)' },
          '50%': {
            transform: 'translateY(var(--frame-max-y))',
          },
          '100%': { transform: 'translateY(0)' },
        },
        'move-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': {
            transform: 'translateX(calc(-1 * (100vw + var(--obs-w, 56px))))',
          },
        },
        'bonus-text': {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '100%': {
            transform: 'translateY(-100px)',
            opacity: 1,
          },
        },
      },
      animation: {
        obstacle: 'move-left 2s linear 2s forwards',
        'sprite-run':
          'sprite-x var(--sprite-duration,2s) steps(var(--frames)) infinite',
        'sprite-jump':
          'sprite-x var(--sprite-duration,0.6s) steps(var(--frames)) forwards',
        'sprite-jump-up': 'sprite-y var(--sprite-duration,0.6s) forwards',
        bonus: 'bonus-text 1s linear forwards',
      },
    },
  },
  plugins: [],
};
