'use client'

import Link from 'next/link'
import { Ruler, ExternalLink } from 'lucide-react'
import { APPAREL_ROWS } from '@/lib/sizeGuideContent'

export type SizeGuideVariant = 'unisex-footwear' | 'apparel'

interface SizeGuideProps {
  /** Shoes: teaser + link to full chart page. Sportswear: table + link to apparel page. */
  variant?: SizeGuideVariant
}

export default function SizeGuide({ variant = 'unisex-footwear' }: SizeGuideProps) {
  if (variant === 'apparel') {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Ruler className="h-4 w-4 text-falco-accent" />
          <h4 className="text-sm font-semibold text-white">Apparel size guide</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-xs text-gray-300">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-2 pr-4 font-medium">Size</th>
                <th className="py-2 pr-4 font-medium">Chest</th>
                <th className="py-2 pr-4 font-medium">Waist</th>
                <th className="py-2 font-medium">Hips</th>
              </tr>
            </thead>
            <tbody>
              {APPAREL_ROWS.map((row) => (
                <tr key={row.size} className="border-b border-gray-800 last:border-b-0">
                  <td className="py-2 pr-4 font-semibold text-white">{row.size}</td>
                  <td className="py-2 pr-4">{row.chest}</td>
                  <td className="py-2 pr-4">{row.waist}</td>
                  <td className="py-2">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Tip: If you are between sizes, choose one size up for a relaxed fit.
        </p>
        <Link
          href="/size-guide/apparel"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-falco-accent hover:text-falco-gold"
        >
          Full apparel size page
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-900/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Ruler className="h-4 w-4 text-falco-accent" />
        <h4 className="text-sm font-semibold text-white">Footwear sizes</h4>
      </div>
      <p className="text-xs leading-relaxed text-gray-400">
        Full guide: <strong className="text-gray-300">women’s, men’s, kids’, and unisex</strong> tables with{' '}
        <strong className="text-gray-300">EU, US, UK, and cm</strong>, plus chart images and how to measure — on a dedicated page.
      </p>
      <Link
        href="/size-guide"
        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-falco-accent px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-falco-gold"
      >
        View full size chart
        <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  )
}
