import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Linkora-Socials - Social Media on Stellar',
  description: 'Own your content. Own your earnings. Social media powered by Stellar blockchain.',
  keywords: 'stellar, social media, web3, blockchain, crypto, defi, socialfi',
  openGraph: {
    title: 'Linkora-Socials - Social Media on Stellar',
    description: 'Own your content. Own your earnings.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linkora-Socials - Social Media on Stellar',
    description: 'Own your content. Own your earnings.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
