'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { CheckCircle, Shield, Lock } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const SERVICES = [
  { name: 'Supabase',   description: 'Database & backend infrastructure',  amount: 100 },
  { name: 'Vercel',     description: 'Website hosting & deployments',       amount: 96  },
  { name: 'Cloudinary', description: 'Image CDN & media storage',           amount: 120 },
  { name: 'Resend',     description: 'Transactional email service',         amount: 59  },
  { name: 'Domain & SSL', description: 'falcop.com domain renewal',         amount: 50  },
]

const TOTAL = SERVICES.reduce((s, r) => s + r.amount, 0)

// ── Payment form (inside Elements) ──────────────────────────────────────────
function PayForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href + '?paid=1' },
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Payment failed. Please try again.')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-base"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processing…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay ${TOTAL} USD
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" /> Secured by Stripe · 256-bit encryption
      </p>
    </form>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function PayPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [paid, setPaid] = useState(false)
  const [loadingIntent, setLoadingIntent] = useState(false)
  const [intentError, setIntentError] = useState('')

  // Check if returning from redirect (Klarna / redirect-based methods)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('paid=1')) {
      setPaid(true)
    }
  }, [])

  async function initPayment() {
    setLoadingIntent(true)
    setIntentError('')
    try {
      const res = await fetch('/api/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setClientSecret(data.clientSecret)
    } catch (e: any) {
      setIntentError(e.message)
    } finally {
      setLoadingIntent(false)
    }
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
          <p className="text-gray-500 mb-6">Thank you! Your payment of <strong>${TOTAL} USD</strong> has been received. The API services will be renewed shortly.</p>
          <p className="text-sm text-gray-400">A receipt has been sent to your email.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-1">Invoice</p>
          <h1 className="text-3xl font-bold text-gray-900">Falco P Website</h1>
          <p className="text-gray-500 mt-1">API &amp; Hosting Services Package</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Invoice breakdown */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Services</h2>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Amount (USD)</span>
            </div>

            <div className="divide-y divide-gray-100">
              {SERVICES.map((s) => (
                <div key={s.name} className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-gray-900">{s.name}</p>
                    <p className="text-sm text-gray-400">{s.description}</p>
                  </div>
                  <span className="font-medium text-gray-900 ml-4">${s.amount}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-5 mt-2 border-t-2 border-gray-900">
              <span className="text-lg font-bold text-gray-900">Total Due</span>
              <span className="text-2xl font-bold text-gray-900">${TOTAL} <span className="text-base font-semibold text-gray-500">USD</span></span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Payment section */}
          <div className="p-6 sm:p-8">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Pay by Card</h2>

            {!clientSecret && !loadingIntent && !intentError && (
              <button
                onClick={initPayment}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-base"
              >
                <Lock className="w-4 h-4" />
                Proceed to Payment — ${TOTAL} USD
              </button>
            )}

            {loadingIntent && (
              <div className="flex items-center justify-center py-8 gap-3 text-gray-500">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading payment form…
              </div>
            )}

            {intentError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{intentError}</p>
            )}

            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: { colorPrimary: '#111827', borderRadius: '10px' },
                  },
                }}
              >
                <PayForm onSuccess={() => setPaid(true)} />
              </Elements>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          falcop.com · Invoice #FALCOP-API-2026
        </p>
      </div>
    </div>
  )
}
