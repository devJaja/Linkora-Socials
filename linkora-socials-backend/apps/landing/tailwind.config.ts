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
        primary: '#FDDB24',
        secondary: '#B7ACE8',
        'stellar-teal': '#00A8B5',
        'stellar-navy': '#002E5F',
        'stellar-cream': '#D6D3C4',
      },
    },
  },
  plugins: [],
}
export default config
