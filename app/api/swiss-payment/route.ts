import { NextResponse } from 'next/server'

/**
 * Swish / “Swiss payment” mock — disabled. Checkout Swish UI is commented out in PaymentForm.
 * Restore previous implementation from git history when wiring real Swish.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Swish is temporarily unavailable',
      message: 'Please use card, Apple Pay, or Google Pay (Stripe).',
    },
    { status: 503 }
  )
}
