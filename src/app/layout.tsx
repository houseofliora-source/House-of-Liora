import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'House of Liora — Luxury Handcrafted Candles | Gift for Your Loved Ones',
  description:
    'Discover House of Liora\'s handcrafted luxury candles — including our signature Red Rose Candle. Perfect gifts for loved ones. Shop premium candles online in Bangladesh. Cash on Delivery, bKash & Nagad accepted.',
  keywords: [
    'luxury candles Bangladesh',
    'handmade rose candle',
    'House of Liora',
    'scented candles Dhaka',
    'gift candles Bangladesh',
    'red rose candle',
    'premium candles online',
  ],
  openGraph: {
    title: 'House of Liora — Luxury Handcrafted Candles',
    description: 'Gift for your loved ones. Handcrafted luxury candles in Bangladesh.',
    type: 'website',
    locale: 'en_BD',
    siteName: 'House of Liora',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
