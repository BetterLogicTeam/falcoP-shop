'use client'

import {
  FOOTWEAR_FITTING_ADVICE,
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
              <th className={th + ' pr-0'}>cm</th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={`${block.id}-${row.eu}-${row.us}`}>
                <td className={td}>{row.eu}</td>
                <td className={td}>{row.us}</td>
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
        Official <strong className="text-white">unisex</strong> chart:{' '}
        <strong className="text-white">EU</strong>, <strong className="text-white">US</strong> (men’s on the
        label), and <strong className="text-white">foot length (cm)</strong>.
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

      <section
        className={
          dense
            ? 'rounded-2xl border border-falco-accent/40 bg-gradient-to-br from-falco-accent/15 to-black/40 p-5 sm:p-6'
            : 'rounded-xl border border-falco-accent/35 bg-gradient-to-br from-falco-accent/12 to-black/50 p-4 sm:p-5'
        }
        aria-labelledby="footwear-fitting-advice-heading"
      >
        <h2
          id="footwear-fitting-advice-heading"
          className={
            dense
              ? 'text-lg font-bold tracking-tight text-falco-accent'
              : 'text-sm font-bold uppercase tracking-wide text-falco-accent'
          }
        >
          Fitting advice
        </h2>
        <p
          className={
            dense
              ? 'mt-3 text-base leading-relaxed text-gray-100'
              : 'mt-2 text-sm leading-relaxed text-gray-200'
          }
        >
          {FOOTWEAR_FITTING_ADVICE}
        </p>
      </section>
    </div>
  )
}
