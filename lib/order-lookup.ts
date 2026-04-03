/** Session key: checkout sets this before redirect so order confirmation can load the order securely. */
export const ORDER_LOOKUP_EMAIL_STORAGE_KEY = 'falco_order_lookup_email'

export function rememberOrderLookupEmail(email: string): void {
  try {
    const e = email.trim().toLowerCase()
    if (e) sessionStorage.setItem(ORDER_LOOKUP_EMAIL_STORAGE_KEY, e)
  } catch {
    /* private mode / quota */
  }
}
