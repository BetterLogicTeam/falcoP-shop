/** Shared copy & data for size guide (PDP + dedicated pages). */

/**
 * Unisex chart — cm column is exactly what the stakeholder sent (nothing added):
 *   36=24.1 cm … 45=30.1 cm
 * US / UK are usual men’s conversions for the same EU row (for the box label).
 */
export type FootwearSizeRow = { eu: string; us: string; uk: string; cm: string }

export type FootwearSizeGuideBlock = {
  id: 'women' | 'men' | 'kids' | 'unisex'
  title: string
  description?: string
  usColumnLabel: string
  rows: FootwearSizeRow[]
}

const FOOTWEAR_ROWS_UNISEX: FootwearSizeRow[] = [
  { eu: '36', us: '3', uk: '2', cm: '24.1' },
  { eu: '37', us: '4', uk: '3', cm: '24.7' },
  { eu: '38', us: '5', uk: '4', cm: '25.4' },
  { eu: '39', us: '6', uk: '5', cm: '26.1' },
  { eu: '40', us: '7', uk: '6', cm: '26.7' },
  { eu: '41', us: '8', uk: '7', cm: '27.4' },
  { eu: '42', us: '9', uk: '8', cm: '28.1' },
  { eu: '43', us: '10', uk: '9', cm: '28.7' },
  { eu: '44', us: '11', uk: '10', cm: '29.4' },
  { eu: '45', us: '12', uk: '11', cm: '30.1' },
]

/** Footwear size guide: unisex chart only (EU, US, cm shown in UI). */
export const FOOTWEAR_SIZE_GUIDE_BLOCKS: FootwearSizeGuideBlock[] = [
  {
    id: 'unisex',
    title: 'Unisex footwear',
    description:
      'EU 36–45 only. Foot length (cm) is exactly as provided by Falco P; US is men’s US on the box.',
    usColumnLabel: 'US',
    rows: FOOTWEAR_ROWS_UNISEX,
  },
]

export const FOOTWEAR_CHART_IMAGES = {
  primary: '/images/size1.jpeg',
  alternate: '/images/size2.jpeg',
} as const

/** Extra reference images below the chart */
export const FOOTWEAR_CHART_SECTIONS = [
  {
    title: 'Chart image 1',
    caption: 'Visual reference — compare with the EU / US / UK / cm chart above.',
    src: FOOTWEAR_CHART_IMAGES.primary,
    alt: 'Falco P footwear size chart image — US, UK, EU reference',
  },
  {
    title: 'Chart image 2',
    caption: 'Foot length and sizing reference — use together with the chart above.',
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
