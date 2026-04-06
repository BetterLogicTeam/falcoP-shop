'use client'

import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripeJs } from '@/lib/stripe-client'

interface StripeElementsProviderProps {
  children: React.ReactNode
  /** Required for Payment Element (card + Klarna). Omit only for legacy flows. */
  clientSecret?: string | null
}

export default function StripeElementsProvider({ children, clientSecret }: StripeElementsProviderProps) {
  const [scriptBlocked, setScriptBlocked] = useState(false)

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#eab308',
      colorBackground: 'rgba(255,255,255,0.06)',
      colorText: '#f3f4f6',
      colorDanger: '#f87171',
      borderRadius: '12px',
    },
  }

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim()
    if (!key) return
    let cancelled = false
    getStripeJs().then((stripe) => {
      if (cancelled || stripe) return
      setScriptBlocked(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const blockedNotice = scriptBlocked ? (
    <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
      <p className="font-semibold text-amber-50">Payment scripts could not load</p>
      <p className="mt-1 text-amber-100/90">
        This site needs <span className="font-mono text-xs">https://js.stripe.com</span>. Allow it in your firewall,
        VPN, or browser extensions (ad blockers), then refresh. If you are on a restricted network, try another
        connection or device.
      </p>
    </div>
  ) : null

  if (clientSecret) {
    return (
      <>
        {blockedNotice}
        {/* New PaymentIntent = new clientSecret; remount avoids "clientSecret is not a mutable property" */}
        <Elements key={clientSecret} stripe={getStripeJs()} options={{ clientSecret, appearance }}>
          {children}
        </Elements>
      </>
    )
  }

  return (
    <>
      {blockedNotice}
      <Elements stripe={getStripeJs()}>{children}</Elements>
    </>
  )
}
