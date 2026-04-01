/**
 * Shipping / billing country lists for checkout (ISO 3166-1 alpha-2) and account addresses (display names).
 */

export type ShippingCountry = { code: string; name: string }

const NORDIC: ShippingCountry[] = [
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IS', name: 'Iceland' },
]

/** EU, EEA (non-Nordic), UK, CH, and common European destinations — alphabetical by name */
const EUROPE_NON_NORDIC: ShippingCountry[] = [
  { code: 'AL', name: 'Albania' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SM', name: 'San Marino' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'VA', name: 'Vatican City' },
].sort((a, b) => a.name.localeCompare(b.name, 'en'))

const AMERICAS_AND_OCEANIA: ShippingCountry[] = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
].sort((a, b) => a.name.localeCompare(b.name, 'en'))

/** Optgroups for checkout & address forms */
export const SHIPPING_COUNTRY_GROUPS: { label: string; countries: ShippingCountry[] }[] = [
  { label: 'Nordic countries', countries: NORDIC },
  { label: 'Europe', countries: EUROPE_NON_NORDIC },
  { label: 'Americas & Oceania', countries: AMERICAS_AND_OCEANIA },
]

/** All ISO codes for Stripe `shipping_address_collection.allowed_countries` (unique, sorted) */
export function getStripeShippingCountryCodes(): string[] {
  const codes = new Set<string>()
  for (const g of SHIPPING_COUNTRY_GROUPS) {
    for (const c of g.countries) codes.add(c.code)
  }
  return Array.from(codes).sort()
}

/** Flat list for address book (name = stored value to match existing rows like “United States”) */
export function getAllShippingCountriesByName(): ShippingCountry[] {
  return SHIPPING_COUNTRY_GROUPS.flatMap((g) => g.countries).sort((a, b) =>
    a.name.localeCompare(b.name, 'en')
  )
}
