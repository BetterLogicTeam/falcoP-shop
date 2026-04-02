import { loadStripe } from '@stripe/stripe-js'

type StripeInstance = NonNullable<Awaited<ReturnType<typeof loadStripe>>>

let stripePromise: Promise<StripeInstance | null> | null = null

/**
 * Shared Stripe.js loader. Never rejects — a rejecting `loadStripe` promise would become an
 * unhandled rejection inside `@stripe/react-stripe-js` and crash Next.js dev overlay.
 */
export function getStripeJs(): Promise<StripeInstance | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
    if (!key) {
      stripePromise = Promise.resolve(null)
    } else {
      stripePromise = loadStripe(key).catch((cause: unknown) => {
        console.error(
          '[Stripe] Could not load Stripe.js from https://js.stripe.com — check network, VPN, firewall, corporate proxy, or extensions (ad blockers).',
          cause
        )
        return null
      })
    }
  }
  return stripePromise
}

/** For tests or retry after fixing network — next `getStripeJs()` starts fresh. */
export function resetStripeJsLoader(): void {
  stripePromise = null
}
