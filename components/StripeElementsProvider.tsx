'use client'

import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// Use the public key directly for now
const stripePromise = loadStripe('pk_test_51SH271EzB0EyBbAOYWN7TSFl62BX5rb07DiHngh4HcGBd4ot5i4K5w8boayFXRw10BkD965MJ537aL5XgshN7EMg00DCYmNYyI')

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
