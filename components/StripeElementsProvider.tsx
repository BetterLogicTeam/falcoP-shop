'use client'

import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// Load Stripe with the publishable key from environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeElementsProviderProps {
  children: React.ReactNode
}

export default function StripeElementsProvider({ children }: StripeElementsProviderProps) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
}
