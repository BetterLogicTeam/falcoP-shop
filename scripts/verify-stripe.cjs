/**
 * Verifies Stripe credentials from .env then .env.local (same order as Next.js; local overrides).
 * Usage:
 *   npm run stripe:verify       — validate keys (test or live) and call Stripe API
 *   npm run stripe:verify:live — same, but requires sk_live_ + pk_live_ (production / "mainnet")
 *
 * Optional: append --debug (e.g. npm run stripe:verify:live -- --debug) to print key length
 * and detect hidden non-ASCII characters — nothing secret is printed.
 */
const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const root = path.join(__dirname, '..')

/** Decode .env file: UTF-8 (with optional BOM) or UTF-16 LE (with BOM). */
function readEnvText(filePath) {
  const buf = fs.readFileSync(filePath)
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return buf.slice(2).toString('utf16le').replace(/^\uFEFF/, '')
  }
  return buf.toString('utf8').replace(/^\uFEFF/, '')
}

require('dotenv').config({ path: path.join(root, '.env') })

const localPath = path.join(root, '.env.local')
let localKeyCount = 0
if (fs.existsSync(localPath)) {
  const text = readEnvText(localPath)
  const parsed = dotenv.parse(text)
  localKeyCount = Object.keys(parsed).length
  for (const [k, v] of Object.entries(parsed)) {
    if (typeof v === 'string') process.env[k] = v
  }
}

const requireLive = process.argv.includes('--live')
const debug = process.argv.includes('--debug')

const secret = process.env.STRIPE_SECRET_KEY?.trim()
const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()

if (!secret || !secret.startsWith('sk_')) {
  console.error(
    'Missing or invalid STRIPE_SECRET_KEY in .env or .env.local (expected sk_test_... or sk_live_...)'
  )
  process.exit(1)
}
if (!publishable || !publishable.startsWith('pk_')) {
  console.error(
    'Missing or invalid NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env or .env.local (expected pk_test_... or pk_live_...)'
  )
  process.exit(1)
}

const secretLive = secret.startsWith('sk_live_')
const publishableLive = publishable.startsWith('pk_live_')
if (secretLive !== publishableLive) {
  console.error(
    'Stripe mode mismatch: STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must both be live (sk_live_ / pk_live_) or both test (sk_test_ / pk_test_).'
  )
  process.exit(1)
}
if (requireLive && (!secretLive || !publishableLive)) {
  console.error(
    'stripe:verify:live requires live keys: sk_live_... and pk_live_... in .env or .env.local'
  )
  process.exit(1)
}

if (debug) {
  console.log('[debug] Variables parsed from .env.local:', localKeyCount)
  console.log('[debug] STRIPE_SECRET_KEY length (after trim):', secret.length)
  console.log('[debug] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY length:', publishable.length)
  const secretBody = secret.replace(/^sk_(live|test)_/, '')
  const onlySafeChars = /^[A-Za-z0-9]+$/.test(secretBody)
  console.log('[debug] Secret key body is only [A-Za-z0-9]:', onlySafeChars)
  if (!onlySafeChars) {
    const bad = [...secretBody].find((ch) => !/[A-Za-z0-9]/.test(ch))
    if (bad !== undefined) {
      console.log('[debug] First bad character in secret:', JSON.stringify(bad), 'U+' + bad.codePointAt(0).toString(16))
    }
  }
}

const Stripe = require('stripe')
const stripe = new Stripe(secret, { apiVersion: '2025-09-30.clover' })

;(async () => {
  try {
    const balance = await stripe.balance.retrieve()
    console.log('Stripe OK — API key is valid.')
    console.log('  Mode:', secretLive ? 'live (production)' : 'test')
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
