'use client'

import Image from 'next/image'
import { FOOTWEAR_CHART_SECTIONS, FOOT_MEASURE_STEPS } from '@/lib/sizeGuideContent'

interface SizeGuideFootwearChartsProps {
  /** Larger typography and spacing on the dedicated page */
  dense?: boolean
}

export default function SizeGuideFootwearCharts({ dense }: SizeGuideFootwearChartsProps) {
  return (
    <div className={dense ? 'space-y-10' : 'space-y-6'}>
      <p
        className={
          dense
            ? 'text-base leading-relaxed text-gray-300'
            : 'text-xs leading-relaxed text-gray-400'
        }
      >
        We publish <strong className="text-white">two separate charts</strong> — they are not duplicates. Use chart 1 for US/UK/EU labels, then cross-check with chart 2 for foot length (cm) and any extra rows your product needs.
      </p>

      <p className="text-sm font-medium text-falco-accent">Scroll horizontally on each chart if columns do not fit your screen.</p>

      <div className="space-y-8">
        {FOOTWEAR_CHART_SECTIONS.map((section) => (
          <section key={section.src} className="space-y-3">
            <div>
              <h3
                className={
                  dense ? 'text-lg font-semibold text-white' : 'text-sm font-semibold text-white'
                }
              >
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{section.caption}</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-700 bg-black/30 shadow-inner">
              <Image
                src={section.src}
                alt={section.alt}
                width={1400}
                height={900}
                className="h-auto min-w-[min(100%,720px)] w-full max-w-full object-contain object-left-top"
                sizes="(max-width: 768px) 100vw, 900px"
                unoptimized
              />
            </div>
          </section>
        ))}
      </div>

      <section>
        <h2
          className={
            dense
              ? 'mb-4 text-lg font-semibold text-white'
              : 'mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400'
          }
        >
          How to measure foot length
        </h2>
        <ol
          className={
            dense
              ? 'list-decimal space-y-3 pl-5 text-gray-300'
              : 'list-decimal space-y-1.5 pl-4 text-xs text-gray-300'
          }
        >
          {FOOT_MEASURE_STEPS.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
