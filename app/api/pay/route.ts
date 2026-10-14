import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-09-30.clover' })

// $425 USD in cents
const INVOICE_AMOUNT_CENTS = 42500

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, email } = body as { name?: string; email?: string }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: INVOICE_AMOUNT_CENTS,
      currency: 'usd',
      description: 'Falco P Website — API & Hosting Services Package',
      receipt_email: email || undefined,
      metadata: {
        invoice: 'FALCOP-API-2026',
        payer_name: name || '',
        payer_email: email || '',
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
