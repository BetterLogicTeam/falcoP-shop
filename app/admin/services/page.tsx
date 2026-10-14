'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import {
  CheckCircle, Shield, Lock, Calendar,
  Globe, Database, Cloud, Mail, Server, CreditCard,
} from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const INVOICE_NUMBER = 'FP-2026-0014'
const INVOICE_DATE   = 'October 14, 2026'
const DUE_DATE       = 'October 21, 2026'
const PERIOD         = 'Nov 1, 2026 – Oct 31, 2027'

const SERVICES = [
  {
    icon: Database,
    name: 'Supabase Pro',
    description: 'PostgreSQL database, row-level security, auth & real-time backend infrastructure',
    period: '1-Year Annual Subscription',
    amount: 145,
  },
  {
    icon: Cloud,
    name: 'Cloudinary Plus',
    description: 'Product image CDN, on-the-fly transformations, media storage & optimisation',
    period: '1-Year Annual Subscription',
    amount: 140,
  },
  {
    icon: Mail,
    name: 'Resend Pro',
    description: 'Primary transactional email for order receipts, confirmations and notifications',
    period: '1-Year Annual Subscription',
    amount: 80,
  },
  {
    icon: Server,
    name: 'EmailJS Pro',
    description: 'Backup email delivery service that kicks in when the primary provider is unavailable',
    period: '1-Year Annual Subscription',
    amount: 35,
  },
  {
    icon: Globe,
    name: 'Fraktjakt Shipping API',
    description: 'Swedish shipping carrier integration with live tracking webhooks and order fulfilment',
    period: '1-Year Annual Subscription',
    amount: 25,
  },
]

const SUBTOTAL = SERVICES.reduce((s, r) => s + r.amount, 0)

// ── Payment form ──────────────────────────────────────────────────────────────
function PayForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    if (isLocalhost) {
      setError('Payment origin and server origin mismatch.')
      return
    }

    setLoading(true)
    setError('')

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/admin/services?paid=1' },
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-3">
          <span className="mt-0.5 shrink-0">⚠</span>
          <span className="break-words">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-md"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span>Processing payment…</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 shrink-0" />
            <span>Pay ${SUBTOTAL}.00 USD and Activate</span>
          </>
        )}
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400 pt-1">
        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Encrypted</span>
        <span className="hidden sm:inline">·</span>
        <span className="flex items-center gap-1">🔒 Secured by Stripe</span>
        <span className="hidden sm:inline">·</span>
        <span>PCI DSS Compliant</span>
      </div>
    </form>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminServicesPage() {
  const [clientSecret,  setClientSecret]  = useState('')
  const [paid,          setPaid]          = useState(false)
  const [loadingIntent, setLoadingIntent] = useState(false)
  const [intentError,   setIntentError]   = useState('')
  const [name,          setName]          = useState('')
  const [email,         setEmail]         = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('paid=1')) {
      setPaid(true)
    }
  }, [])

  async function initPayment() {
    if (!name.trim() || !email.trim()) return
    setLoadingIntent(true)
    setIntentError('')
    try {
      const res  = await fetch('/api/pay', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setClientSecret(data.clientSecret)
    } catch (e: any) {
      setIntentError(e.message)
    } finally {
      setLoadingIntent(false)
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (paid) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment Received</h1>
          <p className="text-gray-500 mb-1 text-sm">Invoice <span className="font-semibold text-gray-700">{INVOICE_NUMBER}</span></p>
          <p className="text-gray-500 mb-5 text-sm">
            Payment of <strong className="text-gray-800">${SUBTOTAL}.00 USD</strong> confirmed.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 text-left space-y-1 mb-5">
            <p>✅ All API services activated for</p>
            <p className="font-semibold text-gray-800 pl-5">{PERIOD}</p>
          </div>
          <p className="text-xs text-gray-400">Receipt emailed · Support: <span className="underline">Falcoswoop@gmail.com</span></p>
        </div>
      </div>
    )
  }

  // ── Invoice ────────────────────────────────────────────────────────────────
  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">

      {/* Page title */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Due Payment</h1>
          <p className="text-xs sm:text-sm text-gray-400">Annual API &amp; service subscription renewal</p>
        </div>
      </div>

      {/* Invoice card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-md overflow-hidden">

        {/* Header */}
        <div className="bg-gray-900 px-4 sm:px-8 py-5 sm:py-7 text-white">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-400 mb-0.5">Service Invoice</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Falco P</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">falcop.com · Falcoswoop@gmail.com</p>
            </div>
            <div className="xs:text-right">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Invoice</p>
              <p className="text-white font-bold text-base sm:text-lg">{INVOICE_NUMBER}</p>
            </div>
          </div>
        </div>

        {/* Meta row — 2 cols on mobile, 4 on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-100">
          {[
            { label: 'Issue Date',     value: INVOICE_DATE },
            { label: 'Due Date',       value: DUE_DATE     },
            { label: 'Period',         value: '12 months'  },
            { label: 'Currency',       value: 'USD'        },
          ].map(({ label, value }) => (
            <div key={label} className="px-3 sm:px-6 py-3 sm:py-4 border-r border-gray-100 last:border-r-0 border-b sm:border-b-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r [&:nth-child(3)]:border-b-0 [&:nth-child(4)]:border-b-0">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        {/* Annual period banner */}
        <div className="mx-3 sm:mx-6 mt-4 sm:mt-5 bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 flex items-start sm:items-center gap-2 sm:gap-3">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="text-xs sm:text-sm font-semibold text-blue-800">Annual Subscription Period</p>
            <p className="text-xs text-blue-600">{PERIOD} · Renews automatically each year</p>
          </div>
        </div>

        {/* Services table */}
        <div className="px-3 sm:px-6 mt-4 sm:mt-5">
          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">
            <span className="col-span-7">Service</span>
            <span className="col-span-3 text-center">Billing</span>
            <span className="col-span-2 text-right">Amount</span>
          </div>

          <div className="divide-y divide-gray-50">
            {SERVICES.map(({ icon: Icon, name: svcName, description, period: svcPeriod, amount }) => (
              <div key={svcName} className="py-3 sm:py-4">
                {/* Mobile layout */}
                <div className="flex items-start gap-3 sm:hidden">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{svcName}</p>
                      <p className="font-bold text-gray-900 text-sm shrink-0">${amount}<span className="text-xs font-normal text-gray-400">/yr</span></p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 mt-1.5">
                      <Calendar className="w-2.5 h-2.5" /> {svcPeriod}
                    </span>
                  </div>
                </div>
                {/* Desktop layout */}
                <div className="hidden sm:grid grid-cols-12 items-center gap-2">
                  <div className="col-span-7 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{svcName}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                      <Calendar className="w-3 h-3" /> {svcPeriod}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-bold text-gray-900">${amount}<span className="text-xs font-normal text-gray-400">/yr</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="mx-3 sm:mx-6 mb-4 sm:mb-6 mt-2 border-t border-gray-200 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
          <div className="flex justify-between text-xs sm:text-sm text-gray-500">
            <span>Subtotal ({SERVICES.length} services)</span>
            <span>${SUBTOTAL}.00</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-500">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between items-center pt-2 sm:pt-3 border-t border-gray-200">
            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900">Total Due</p>
              <p className="text-xs text-gray-400">One-time annual payment</p>
            </div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                ${SUBTOTAL}<span className="text-sm sm:text-base font-semibold text-gray-500">.00</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">USD · Billed Annually</p>
            </div>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="border-t border-dashed border-gray-200 mx-3 sm:mx-6" />

        {/* Payment section */}
        <div className="px-3 sm:px-6 py-5 sm:py-7">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1">Complete Payment</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">Enter your details below to securely pay by card.</p>

          {!clientSecret && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Smith"
                    className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email for Receipt</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  />
                </div>
              </div>

              {intentError && (
                <p className="text-xs sm:text-sm text-red-500 bg-red-50 rounded-xl px-3 sm:px-4 py-3 border border-red-100 break-words">{intentError}</p>
              )}

              <button
                onClick={initPayment}
                disabled={loadingIntent || !name.trim() || !email.trim()}
                className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base shadow-md"
              >
                {loadingIntent ? (
                  <>
                    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Loading secure payment form…</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Continue to Secure Payment · ${SUBTOTAL}.00 USD</span>
                  </>
                )}
              </button>
            </div>
          )}

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary:    '#111827',
                    colorBackground: '#ffffff',
                    colorText:       '#1f2937',
                    colorDanger:     '#ef4444',
                    fontFamily:      'Inter, system-ui, sans-serif',
                    borderRadius:    '12px',
                    spacingUnit:     '4px',
                  },
                },
              }}
            >
              <PayForm onSuccess={() => setPaid(true)} />
            </Elements>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 sm:mt-6">
        Falco P · {INVOICE_NUMBER} · <span className="underline">Falcoswoop@gmail.com</span>
      </p>
    </div>
  )
}
