import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { APPAREL_ROWS } from '@/lib/sizeGuideContent'

export const metadata: Metadata = {
  title: 'Apparel size guide | Falco P',
  description: 'Chest, waist, and hips measurements for Falco P sportswear sizes XS–XL.',
}

export default function ApparelSizeGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white">
      <Navigation />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:pt-32">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/size-guide" className="hover:text-white">
            Size guide
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">Apparel</span>
        </nav>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Apparel — size chart</h1>
        <p className="mt-2 text-gray-400">
          Measurements are body measurements in centimetres. Between sizes? Size up for a looser fit.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
          <table className="w-full min-w-[420px] text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-3 pr-4 font-medium">Size</th>
                <th className="py-3 pr-4 font-medium">Chest</th>
                <th className="py-3 pr-4 font-medium">Waist</th>
                <th className="py-3 font-medium">Hips</th>
              </tr>
            </thead>
            <tbody>
              {APPAREL_ROWS.map((row) => (
                <tr key={row.size} className="border-b border-gray-800 last:border-0">
                  <td className="py-3 pr-4 font-semibold text-white">{row.size}</td>
                  <td className="py-3 pr-4">{row.chest}</td>
                  <td className="py-3 pr-4">{row.waist}</td>
                  <td className="py-3">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/size-guide" className="text-sm font-semibold text-falco-accent hover:text-falco-gold">
            ← Unisex footwear chart
          </Link>
          <Link href="/shop" className="text-sm font-semibold text-gray-400 hover:text-white">
            Back to shop
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
