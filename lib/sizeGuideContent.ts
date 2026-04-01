/** Shared copy & data for size guide (PDP + dedicated pages). */

export const FOOTWEAR_CHART_IMAGES = {
  /** Chart 1 — typically US / UK / EU row grid */
  primary: '/images/size1.jpeg',
  /** Chart 2 — different view (e.g. foot length cm, extra columns) — both are shown on the size guide page */
  alternate: '/images/size2.jpeg',
} as const

/** Both images are different; we render them one after another on /size-guide */
export const FOOTWEAR_CHART_SECTIONS = [
  {
    title: 'Chart 1 — US men’s / women’s, UK & EU',
    caption: 'Use this grid to match your usual US / UK / EU shoe size.',
    src: FOOTWEAR_CHART_IMAGES.primary,
    alt: 'Falco P unisex footwear size chart — US men, US women, UK, EU sizing',
  },
  {
    title: 'Chart 2 — Foot length & reference',
    caption: 'Compare with measured foot length (cm / in). Details may differ from chart 1 — check both when unsure.',
    src: FOOTWEAR_CHART_IMAGES.alternate,
    alt: 'Falco P unisex footwear size chart — foot length and sizing reference',
  },
] as const

export const FOOT_MEASURE_STEPS = [
  'Tape a piece of paper to a hard, flat surface, ensuring the paper does not slip.',
  'Stand on the paper, feet shoulder width apart and weight evenly balanced (only one foot will be on the paper).',
  'With a pen or pencil pointed straight down, have someone help you mark the tip of the big toe and the outermost part of the heel.',
  'Step off the paper and measure the distance between the two marks. That is your foot length.',
  'Repeat with the other foot. Many people have one foot slightly longer — use the longer measurement.',
  'Match your foot length to our size chart for US / UK / EU. If you are between sizes, we recommend sizing up.',
] as const

export const APPAREL_ROWS = [
  { size: 'XS', chest: '82-87 cm', waist: '66-71 cm', hips: '84-89 cm' },
  { size: 'S', chest: '88-93 cm', waist: '72-77 cm', hips: '90-95 cm' },
  { size: 'M', chest: '94-101 cm', waist: '78-85 cm', hips: '96-103 cm' },
  { size: 'L', chest: '102-109 cm', waist: '86-93 cm', hips: '104-111 cm' },
  { size: 'XL', chest: '110-117 cm', waist: '94-101 cm', hips: '112-119 cm' },
] as const
