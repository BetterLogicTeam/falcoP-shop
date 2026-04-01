/**
 * Currency: SEK (Swedish Krona)
 * All prices are stored and displayed in SEK.
 */

export const CURRENCY = 'SEK' as const
export const CURRENCY_SYMBOL = 'kr'

/** Flat shipping fee in SEK */
export const SHIPPING_COST_SEK = 59
export const FREE_SHIPPING_SUBTOTAL_SEK = 1998

/**
 * Shipping is free when subtotal reaches FREE_SHIPPING_SUBTOTAL_SEK.
 */
export function getShippingCostBySubtotal(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_SUBTOTAL_SEK ? 0 : SHIPPING_COST_SEK
}

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
