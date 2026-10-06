import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — kept identical to the mobile app tokens.
        gold: {
          DEFAULT: '#FDDA24',
          soft: '#FFE066',
          deep: '#D4A800',
        },
        lilac: {
          DEFAULT: '#B7ACE8',
          soft: '#D5CDF3',
          deep: '#9A8CE0',
        },
        teal: {
          DEFAULT: '#00A8B5',
          soft: '#CCF0F3',
          deep: '#007A85',
        },
        navy: {
          DEFAULT: '#002E5D',
          deep: '#001A33',
          soft: '#0B4778',
        },
        cream: '#D6D3C4',
        ink: '#0F0F0F',

        // Aliases kept for backwards compatibility with existing markup.
        primary: '#FDDA24',
        secondary: '#B7ACE8',
        'stellar-teal': '#00A8B5',
        'stellar-navy': '#002E5D',
        'stellar-cream': '#D6D3C4',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        container: '76rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 46, 93, 0.04), 0 8px 24px -12px rgba(0, 46, 93, 0.18)',
        lift: '0 2px 4px rgba(0, 46, 93, 0.06), 0 24px 48px -16px rgba(0, 46, 93, 0.28)',
        gold: '0 8px 32px -8px rgba(253, 219, 36, 0.45)',
      },
      backgroundImage: {
        'gold-sheen': 'linear-gradient(135deg, #FDDA24 0%, #FFD24A 45%, #D4A800 100%)',
        'brand-mesh':
          'radial-gradient(60% 60% at 50% 0%, rgba(253,219,36,0.16) 0%, transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.75' },
        },
        shimmer: {
          from: { backgroundPosition: '0% 50%' },
          to: { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-soft': 'pulse-soft 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 8s linear infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
