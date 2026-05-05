/**
 * Currency: SEK (Swedish Krona)
 * All prices are stored and displayed in SEK.
 */

export const CURRENCY = 'SEK' as const
export const CURRENCY_SYMBOL = 'kr'

/** Legacy constant; shipping is not charged (always 0). */
export const SHIPPING_COST_SEK = 0
/** @deprecated No threshold; shipping is always free. */
export const FREE_SHIPPING_SUBTOTAL_SEK = 0

/**
 * Shipping is included at no extra charge.
 */
export function getShippingCostBySubtotal(_subtotal: number): number {
  return 0
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
