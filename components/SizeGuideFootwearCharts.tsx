'use client'

import Image from 'next/image'
import {
  FOOTWEAR_CHART_SECTIONS,
  FOOTWEAR_SIZE_GUIDE_BLOCKS,
  FOOT_MEASURE_STEPS,
  type FootwearSizeGuideBlock,
} from '@/lib/sizeGuideContent'

interface SizeGuideFootwearChartsProps {
  /** Larger typography and spacing on the dedicated page */
  dense?: boolean
}

function FootwearBlockTable({ block, dense }: { block: FootwearSizeGuideBlock; dense?: boolean }) {
  const th =
    'border-b border-gray-700 py-2 pr-4 text-left text-xs font-medium uppercase tracking-wide text-gray-400 first:pl-0 last:pr-0 sm:py-3'
  const td =
    'border-b border-gray-800 py-2 pr-4 text-gray-300 last:border-b-0 sm:py-2.5 [&:nth-child(1)]:font-semibold [&:nth-child(1)]:text-white'

  return (
    <section className="space-y-3">
      <div>
        <h3 className={dense ? 'text-lg font-semibold text-white' : 'text-sm font-semibold text-white'}>
          {block.title}
        </h3>
        {block.description ? (
          <p className="mt-1 text-sm text-gray-500">{block.description}</p>
        ) : null}
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-700 bg-black/30">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr>
              <th className={th}>EU</th>
              <th className={th}>{block.usColumnLabel}</th>
              <th className={th}>UK</th>
              <th className={th + ' pr-0'}>cm</th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={`${block.id}-${row.eu}-${row.us}-${row.uk}`}>
                <td className={td}>{row.eu}</td>
                <td className={td}>{row.us}</td>
                <td className={td}>{row.uk}</td>
                <td className={td + ' pr-0'}>{row.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
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
        Footwear is split into <strong className="text-white">women’s</strong>,{' '}
        <strong className="text-white">men’s</strong>, and <strong className="text-white">kids’</strong>{' '}
        tables, then <strong className="text-white">unisex</strong>. Each table lists{' '}
        <strong className="text-white">EU</strong>, <strong className="text-white">US</strong>,{' '}
        <strong className="text-white">UK</strong>, and <strong className="text-white">foot length (cm)</strong>.
      </p>

      <div className={dense ? 'space-y-10' : 'space-y-8'}>
        {FOOTWEAR_SIZE_GUIDE_BLOCKS.map((block) => (
          <FootwearBlockTable key={block.id} block={block} dense={dense} />
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

      <section className={dense ? 'space-y-8 pt-4' : 'space-y-6 border-t border-gray-800 pt-6'}>
        <div>
          <h2
            className={
              dense ? 'text-lg font-semibold text-white' : 'text-sm font-semibold text-white'
            }
          >
            Chart images
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Scroll horizontally if needed. Use together with the EU / US / UK / cm tables above.
          </p>
        </div>
        <div className="space-y-8">
          {FOOTWEAR_CHART_SECTIONS.map((section) => (
            <div key={section.src} className="space-y-3">
              <div>
                <h3
                  className={
                    dense ? 'text-base font-semibold text-white' : 'text-sm font-semibold text-white'
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
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
