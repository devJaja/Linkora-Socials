import type { Metadata, Viewport } from 'next'
import './globals.css'

const description =
  'Own your content. Own your earnings. Linkora is social media on Stellar where every post becomes an asset you own — tips, token trading and zero platform fees.'

export const metadata: Metadata = {
  metadataBase: new URL('https://linkora.social'),
  title: {
    default: 'Linkora — Social Media on Stellar',
    template: '%s · Linkora',
  },
  description,
  applicationName: 'Linkora',
  keywords: [
    'stellar',
    'social media',
    'web3',
    'blockchain',
    'crypto',
    'defi',
    'socialfi',
    'creator tokens',
  ],
  authors: [{ name: 'Linkora' }],
  openGraph: {
    type: 'website',
    title: 'Linkora — Social Media on Stellar',
    description,
    siteName: 'Linkora',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linkora — Social Media on Stellar',
    description,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#001A33',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-navy-deep font-sans text-white antialiased">
        {children}
      </body>
    </html>
  )
}
