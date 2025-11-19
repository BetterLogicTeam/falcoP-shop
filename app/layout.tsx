import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import SessionProvider from '../components/SessionProvider'
import I18nProvider from '../components/I18nProvider'
import { CartProvider } from '../contexts/CartContext'
import { ProductProvider } from '../contexts/ProductContext'
import CartDrawer from '../components/CartDrawer'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Falco P - Premium Sportswear | Unleash Your Inner Maverick',
  description: 'Falco P is a forward-thinking sports shoes and clothing brand that empowers athletes to unleash their full potential with innovative, high-quality sportswear inspired by the majestic falcon.',
  keywords: 'sportswear, athletic shoes, sports clothing, falcon, premium, performance, style, innovation',
  authors: [{ name: 'Falco P' }],
  creator: 'Falco P',
  publisher: 'Falco P',
  icons: {
    icon: '/images/falcop.jpg',
    shortcut: '/images/falcop.jpg',
    apple: '/images/falcop.jpg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://falco-p.vercel.app'),
  openGraph: {
    title: 'Falco P - Premium Sportswear | Unleash Your Inner Maverick',
    description: 'Empower athletes with innovative, high-quality sportswear inspired by the majestic falcon.',
    url: 'https://falco-p.vercel.app',
    siteName: 'Falco P',
    images: [
      {
        url: '/images/banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Falco P - Premium Sportswear',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Falco P - Premium Sportswear',
    description: 'Empower athletes with innovative, high-quality sportswear inspired by the majestic falcon.',
    images: ['/images/banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ProductProvider>
            <I18nProvider>
              <CartProvider>
                {children}
                <CartDrawer />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </CartProvider>
            </I18nProvider>
          </ProductProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
