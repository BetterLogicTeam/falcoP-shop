/** Shared copy & data for size guide (PDP + dedicated pages). */

/**
 * Official Falco P unisex foot length (cm) by EU size (stakeholder spec — unisex only).
 * Half EU sizes use linear interpolation between whole sizes.
 */
const BRAND_EU_FOOT_CM: Record<number, number> = {
  36: 24.1,
  37: 24.7,
  38: 25.4,
  39: 26.1,
  40: 26.7,
  41: 27.4,
  42: 28.1,
  43: 28.7,
  44: 29.4,
  45: 30.1,
}

function brandFootLengthCmForEu(euLabel: string, fallback: string): string {
  const n = parseFloat(String(euLabel).replace(',', '.'))
  if (Number.isNaN(n)) return fallback
  const whole = Math.floor(n + 1e-9)
  const frac = n - whole
  const lo = BRAND_EU_FOOT_CM[whole]
  const hi = BRAND_EU_FOOT_CM[whole + 1]
  if (frac < 0.001) {
    return lo !== undefined ? lo.toFixed(1) : fallback
  }
  if (lo !== undefined && hi !== undefined) {
    return (lo + frac * (hi - lo)).toFixed(1)
  }
  // e.g. EU 45.5 — assume ~same step as 44→45 (0.7 cm)
  if (lo !== undefined && frac > 0 && whole === 45) {
    return (lo + frac * 0.7).toFixed(1)
  }
  return fallback
}

function applyBrandCm(rows: FootwearSizeRow[]): FootwearSizeRow[] {
  return rows.map((r) => ({ ...r, cm: brandFootLengthCmForEu(r.eu, r.cm) }))
}

export type FootwearSizeRow = { eu: string; us: string; uk: string; cm: string }

export type FootwearSizeGuideBlock = {
  id: 'women' | 'men' | 'kids' | 'unisex'
  title: string
  description?: string
  usColumnLabel: string
  rows: FootwearSizeRow[]
}

const FOOTWEAR_ROWS_MEN: FootwearSizeRow[] = [
  { eu: '38', us: '5.5', uk: '5', cm: '23.5' },
  { eu: '38.5', us: '6', uk: '5.5', cm: '24' },
  { eu: '39', us: '6.5', uk: '6', cm: '24.5' },
  { eu: '40', us: '7', uk: '6', cm: '25' },
  { eu: '40.5', us: '7.5', uk: '6.5', cm: '25.5' },
  { eu: '41', us: '8', uk: '7', cm: '26' },
  { eu: '42', us: '8.5', uk: '7.5', cm: '26.5' },
  { eu: '42.5', us: '9', uk: '8', cm: '27' },
  { eu: '43', us: '9.5', uk: '8.5', cm: '27.5' },
  { eu: '44', us: '10', uk: '9', cm: '28' },
  { eu: '44.5', us: '10.5', uk: '9.5', cm: '28.5' },
  { eu: '45', us: '11', uk: '10', cm: '29' },
  { eu: '45.5', us: '11.5', uk: '10.5', cm: '29.5' },
  { eu: '46', us: '12', uk: '11', cm: '30' },
  { eu: '47', us: '13', uk: '12', cm: '31' },
]

/**
 * Single public footwear chart: unisex only (stakeholder request).
 * EU 36–37.5 prepended so brand cm 36–45 is fully covered; 38+ aligns with men’s US/UK scale.
 */
const FOOTWEAR_ROWS_UNISEX: FootwearSizeRow[] = applyBrandCm([
  { eu: '36', us: '4', uk: '3.5', cm: '23' },
  { eu: '36.5', us: '4.5', uk: '4', cm: '23.5' },
  { eu: '37', us: '5', uk: '4.5', cm: '24' },
  { eu: '37.5', us: '5.5', uk: '5', cm: '24.5' },
  ...FOOTWEAR_ROWS_MEN.map((r) => ({ ...r })),
])

/** Footwear size guide: unisex chart only (EU, US, UK, cm). */
export const FOOTWEAR_SIZE_GUIDE_BLOCKS: FootwearSizeGuideBlock[] = [
  {
    id: 'unisex',
    title: 'Unisex footwear',
    description:
      'Falco P footwear uses one unisex chart. US is men’s US on the box; match your foot length (cm) to EU — official cm values for EU 36–45.',
    usColumnLabel: 'US',
    rows: FOOTWEAR_ROWS_UNISEX,
  },
]

export const FOOTWEAR_CHART_IMAGES = {
  primary: '/images/size1.jpeg',
  alternate: '/images/size2.jpeg',
} as const

/** Extra reference images below the numeric tables */
export const FOOTWEAR_CHART_SECTIONS = [
  {
    title: 'Chart image 1',
    caption: 'Visual reference — compare with the EU / US / UK / cm chart above.',
    src: FOOTWEAR_CHART_IMAGES.primary,
    alt: 'Falco P footwear size chart image — US, UK, EU reference',
  },
  {
    title: 'Chart image 2',
    caption: 'Foot length and sizing reference — use together with the tables.',
    src: FOOTWEAR_CHART_IMAGES.alternate,
    alt: 'Falco P footwear size chart image — foot length reference',
  },
] as const

export const FOOT_MEASURE_STEPS = [
  'Tape a piece of paper to a hard, flat surface, ensuring the paper does not slip.',
  'Stand on the paper, feet shoulder width apart and weight evenly balanced (only one foot will be on the paper).',
  'With a pen or pencil pointed straight down, have someone help you mark the tip of the big toe and the outermost part of the heel.',
  'Step off the paper and measure the distance between the two marks. That is your foot length.',
  'Repeat with the other foot. Many people have one foot slightly longer — use the longer measurement.',
  'Match your foot length (cm) to the chart above with EU, US, and UK. If you are between sizes, we recommend sizing up.',
] as const

export const APPAREL_ROWS = [
  { size: 'XS', chest: '82-87 cm', waist: '66-71 cm', hips: '84-89 cm' },
  { size: 'S', chest: '88-93 cm', waist: '72-77 cm', hips: '90-95 cm' },
  { size: 'M', chest: '94-101 cm', waist: '78-85 cm', hips: '96-103 cm' },
  { size: 'L', chest: '102-109 cm', waist: '86-93 cm', hips: '104-111 cm' },
  { size: 'XL', chest: '110-117 cm', waist: '94-101 cm', hips: '112-119 cm' },
] as const
