/**
 * Currency: SEK (Swedish Krona)
 * All prices are stored and displayed in SEK.
 */

export const CURRENCY = 'SEK' as const
export const CURRENCY_SYMBOL = 'kr'

/** Free shipping threshold in SEK (orders 1800 kr and over) */
export const FREE_SHIPPING_THRESHOLD_SEK = 1800

/**
 * Format a price for display (e.g. 900 -> "900 kr")
 */
export function formatPrice(amount: number, options?: { showDecimals?: boolean }): string {
  const showDecimals = options?.showDecimals ?? false
  const value = showDecimals ? Number(amount).toFixed(2) : Math.round(amount).toString()
  return `${value} ${CURRENCY_SYMBOL}`
}

/**
 * Convert SEK to öre (smallest unit) for Stripe/payment APIs
 */
export function sekToOre(sek: number): number {
  return Math.round(sek * 100)
}
