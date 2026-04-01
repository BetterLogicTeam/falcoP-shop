/** Shared copy & data for size guide (PDP + dedicated pages). */

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

/** Approximate conversions — use foot length (cm) when between sizes. Order: women, men, kids, then unisex (same numbers as men’s US / EU / UK / cm). */
export const FOOTWEAR_SIZE_GUIDE_BLOCKS: FootwearSizeGuideBlock[] = [
  {
    id: 'women',
    title: "Women's footwear",
    description: "US sizes are women's US. Match EU, UK, or cm to your usual brand if unsure.",
    usColumnLabel: 'US',
    rows: [
      { eu: '35', us: '5', uk: '2.5', cm: '22' },
      { eu: '35.5', us: '5.5', uk: '3', cm: '22.5' },
      { eu: '36', us: '6', uk: '3.5', cm: '23' },
      { eu: '37', us: '6.5', uk: '4', cm: '23.5' },
      { eu: '37.5', us: '7', uk: '4.5', cm: '24' },
      { eu: '38', us: '7.5', uk: '5', cm: '24.5' },
      { eu: '38.5', us: '8', uk: '5.5', cm: '25' },
      { eu: '39', us: '8.5', uk: '6', cm: '25.5' },
      { eu: '40', us: '9', uk: '6.5', cm: '26' },
      { eu: '40.5', us: '9.5', uk: '7', cm: '26.5' },
      { eu: '41', us: '10', uk: '7.5', cm: '27' },
      { eu: '42', us: '10.5', uk: '8', cm: '27.5' },
      { eu: '42.5', us: '11', uk: '8.5', cm: '28' },
      { eu: '43', us: '11.5', uk: '9', cm: '28.5' },
      { eu: '44', us: '12', uk: '9.5', cm: '29' },
    ],
  },
  {
    id: 'men',
    title: "Men's footwear",
    description: "US sizes are men's US.",
    usColumnLabel: 'US',
    rows: FOOTWEAR_ROWS_MEN,
  },
  {
    id: 'kids',
    title: "Kids' footwear",
    description: 'US column uses kids sizing (C = child, Y = youth). Ages vary by child — foot length (cm) is the best check.',
    usColumnLabel: 'US (kids)',
    rows: [
      { eu: '27', us: '10C', uk: '9', cm: '16.5' },
      { eu: '28', us: '11C', uk: '10', cm: '17' },
      { eu: '28.5', us: '11.5C', uk: '10.5', cm: '17.5' },
      { eu: '29', us: '12C', uk: '11', cm: '18' },
      { eu: '30', us: '12.5C', uk: '11.5', cm: '18.5' },
      { eu: '31', us: '13C', uk: '12', cm: '19' },
      { eu: '31.5', us: '13.5C', uk: '12.5', cm: '19.5' },
      { eu: '32', us: '1Y', uk: '13', cm: '20' },
      { eu: '33', us: '1.5Y', uk: '1', cm: '20.5' },
      { eu: '33.5', us: '2Y', uk: '1.5', cm: '21' },
      { eu: '34', us: '2.5Y', uk: '2', cm: '21.5' },
      { eu: '35', us: '3Y', uk: '2.5', cm: '22' },
      { eu: '35.5', us: '3.5Y', uk: '3', cm: '22.5' },
      { eu: '36', us: '4Y', uk: '3.5', cm: '23' },
      { eu: '36.5', us: '4.5Y', uk: '4', cm: '23.5' },
      { eu: '37', us: '5Y', uk: '4.5', cm: '24' },
      { eu: '37.5', us: '5.5Y', uk: '5', cm: '24.5' },
      { eu: '38', us: '6Y', uk: '5.5', cm: '25' },
      { eu: '38.5', us: '6.5Y', uk: '6', cm: '25.5' },
      { eu: '39', us: '7Y', uk: '6', cm: '26' },
    ],
  },
  {
    id: 'unisex',
    title: 'Unisex footwear',
    description:
      'Unisex styles usually use men’s US on the label. The EU, UK, and cm columns match the men’s table — use the women’s table if you normally shop women’s US sizes.',
    usColumnLabel: 'US',
    rows: [...FOOTWEAR_ROWS_MEN],
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
    caption: 'Visual reference — compare with the EU / US / UK / cm tables above.',
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
  'Match your foot length (cm) to the tables above with EU, US, UK. If you are between sizes, we recommend sizing up.',
] as const

export const APPAREL_ROWS = [
  { size: 'XS', chest: '82-87 cm', waist: '66-71 cm', hips: '84-89 cm' },
  { size: 'S', chest: '88-93 cm', waist: '72-77 cm', hips: '90-95 cm' },
  { size: 'M', chest: '94-101 cm', waist: '78-85 cm', hips: '96-103 cm' },
  { size: 'L', chest: '102-109 cm', waist: '86-93 cm', hips: '104-111 cm' },
  { size: 'XL', chest: '110-117 cm', waist: '94-101 cm', hips: '112-119 cm' },
] as const
