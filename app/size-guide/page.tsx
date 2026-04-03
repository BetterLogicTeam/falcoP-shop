import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SizeGuideFootwearCharts from '@/components/SizeGuideFootwearCharts'

export const metadata: Metadata = {
  title: 'Unisex footwear size guide | Falco P',
  description:
    'Falco P unisex shoe sizes: EU, US, UK, and foot length in cm. How to measure your feet.',
}

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navigation />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:pt-32">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-white">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Size guide</span>
        </nav>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Unisex footwear — size guide</h1>
        <p className="mt-2 text-sm text-gray-500">
          One chart for all Falco P footwear: EU, US (men’s on the label), UK, and cm. Measuring steps and reference images are below.
        </p>

        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 sm:p-8">
          <SizeGuideFootwearCharts dense />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/size-guide/apparel"
            className="text-sm font-semibold text-falco-accent hover:text-falco-gold"
          >
            Apparel size guide →
          </Link>
          <Link href="/shop" className="text-sm font-semibold text-gray-400 hover:text-white">
            ← Back to shop
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
