/**
 * Verifies Stripe credentials from .env (no secrets printed).
 * Usage: npm run stripe:verify
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const secret = process.env.STRIPE_SECRET_KEY
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!secret || !secret.startsWith('sk_')) {
  console.error('Missing or invalid STRIPE_SECRET_KEY in .env (expected sk_test_... or sk_live_...)')
  process.exit(1)
}
if (!publishable || !publishable.startsWith('pk_')) {
  console.error(
    'Missing or invalid NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env (expected pk_test_... or pk_live_...)'
  )
  process.exit(1)
}

const Stripe = require('stripe')
const stripe = new Stripe(secret, { apiVersion: '2025-09-30.clover' })

;(async () => {
  try {
    const balance = await stripe.balance.retrieve()
    console.log('Stripe OK — API key is valid.')
    console.log('  Mode:', secret.startsWith('sk_live_') ? 'live' : 'test')
    console.log(
      '  Available balances:',
      (balance.available || []).map((b) => `${b.amount / 100} ${b.currency}`).join(', ') || '(none)'
    )
    process.exit(0)
  } catch (e) {
    console.error('Stripe API error:', e.message || e)
    process.exit(1)
  }
})()
