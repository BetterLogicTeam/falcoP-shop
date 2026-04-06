import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    return null
  }
  return new Stripe(key, {
    apiVersion: '2025-09-30.clover',
  })
}

type KlarnaPreferredLocale = Stripe.PaymentIntentCreateParams.PaymentMethodOptions.Klarna.PreferredLocale

/** Klarna `preferred_locale` — improves eligibility vs a fixed sv-SE for all EU customers */
function klarnaPreferredLocale(countryAlpha2: string): KlarnaPreferredLocale {
  const c = countryAlpha2.trim().toUpperCase()
  const map: Partial<Record<string, KlarnaPreferredLocale>> = {
    SE: 'sv-SE',
    NO: 'nb-NO',
    DK: 'da-DK',
    FI: 'fi-FI',
    DE: 'de-DE',
    AT: 'de-AT',
    CH: 'de-CH',
    NL: 'nl-NL',
    BE: 'nl-BE',
    FR: 'fr-FR',
    GB: 'en-GB',
    IE: 'en-IE',
    US: 'en-US',
    AU: 'en-AU',
    NZ: 'en-NZ',
    PL: 'pl-PL',
    ES: 'es-ES',
    IT: 'it-IT',
    PT: 'pt-PT',
  }
  return map[c] ?? 'en-GB'
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured (missing STRIPE_SECRET_KEY).' },
        { status: 500 }
      )
    }

    const { amount, currency = 'sek', customerInfo } = await request.json()

    if (typeof amount !== 'number' || amount < 1) {
      return NextResponse.json({ error: 'Invalid payment amount.' }, { status: 400 })
    }

    const fullName = `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || 'Customer'
    const metadata = {
      customerEmail: customerInfo.email,
      customerName: fullName,
      customerAddress: customerInfo.address,
      customerCity: customerInfo.city,
      customerState: customerInfo.state,
      customerZipCode: customerInfo.zipCode,
      customerCountry: customerInfo.country,
    }

    /** Klarna / confirm: if we attach shipping, Stripe requires line1, city, postal_code, country (+ state for US). */
    const country = typeof customerInfo.country === 'string' ? customerInfo.country.trim().toUpperCase() : ''
    const line1 = typeof customerInfo.address === 'string' ? customerInfo.address.trim() : ''
    const city = typeof customerInfo.city === 'string' ? customerInfo.city.trim() : ''
    const postal = typeof customerInfo.zipCode === 'string' ? customerInfo.zipCode.trim() : ''
    const stateStr = typeof customerInfo.state === 'string' ? customerInfo.state.trim() : ''
    const hasCoreAddress = Boolean(line1 && city && postal && country.length === 2)
    const usOk = country !== 'US' || Boolean(stateStr)
    const shipping =
      hasCoreAddress && usOk
        ? {
            name: fullName,
            address: {
              line1,
              city,
              postal_code: postal,
              country,
              ...(country === 'US' || stateStr ? { state: stateStr || undefined } : {}),
            },
          }
        : undefined

    let paymentIntent: Stripe.PaymentIntent
    const localeFromCountry = country.length === 2 ? country : 'SE'
    const klarnaLocale = klarnaPreferredLocale(localeFromCountry)

    const baseBody = {
      amount,
      currency,
      metadata,
      ...(shipping ? { shipping } : {}),
    }

    /**
     * Klarna uses the same Stripe account/mode as STRIPE_SECRET_KEY (test vs live). Enable Klarna in
     * Dashboard → Payment methods for that mode; there is no separate Klarna env var in this app.
     *
     * Prefer explicit `card` + `klarna` so the intent actually lists `klarna` when Stripe accepts it.
     * Try without Klarna options first (some accounts reject optional fields); then with `preferred_locale`.
     * If both fail, automatic PMs may succeed but often omit Klarna from the session — do not advertise Klarna in UI unless `payment_method_types` includes it.
     */
    const createCardKlarna = (withLocale: boolean) =>
      stripe.paymentIntents.create({
        ...baseBody,
        payment_method_types: ['card', 'klarna'],
        ...(withLocale
          ? {
              payment_method_options: {
                klarna: { preferred_locale: klarnaLocale },
              },
            }
          : {}),
      })

    try {
      paymentIntent = await createCardKlarna(false)
    } catch (explicitNoOpts: any) {
      console.warn('PaymentIntent card+klarna (default) failed:', explicitNoOpts?.message)
      try {
        paymentIntent = await createCardKlarna(true)
      } catch (explicitLocale: any) {
        console.warn('PaymentIntent card+klarna (preferred_locale) failed:', explicitLocale?.message)
        try {
          paymentIntent = await stripe.paymentIntents.create({
            ...baseBody,
            automatic_payment_methods: {
              enabled: true,
              allow_redirects: 'always',
            },
          })
        } catch (autoErr: any) {
          console.warn('PaymentIntent with automatic_payment_methods failed:', autoErr?.message)
          paymentIntent = await stripe.paymentIntents.create({
            ...baseBody,
            payment_method_types: ['card'],
          })
        }
      }
    }

    const types = paymentIntent.payment_method_types || []
    const includesKlarna = types.includes('klarna')

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      includesKlarna,
    })
  } catch (error: unknown) {
    console.error('Error creating payment intent:', error)
    const message =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Failed to create payment intent'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
