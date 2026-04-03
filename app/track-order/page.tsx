'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ArrowLeft } from 'lucide-react'
import { rememberOrderLookupEmail } from '@/lib/order-lookup'

export default function TrackOrderPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const num = orderNumber.trim()
    const em = email.trim().toLowerCase()
    if (!num || !em) return
    setLoading(true)
    setError(null)
    try {
      const q = new URLSearchParams({ orderNumber: num, email: em })
      const res = await fetch(`/api/orders/lookup?${q.toString()}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Order not found')
      }
      rememberOrderLookupEmail(em)
      router.push(`/order-confirmation?order=${encodeURIComponent(num)}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-falco-primary relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black" />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-16">
        <Link
          href="/shop"
          className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to shop
        </Link>

        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
          <div className="w-14 h-14 bg-gradient-to-br from-falco-accent to-falco-gold rounded-xl flex items-center justify-center mb-6">
            <Package className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Track your order</h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Enter the order number from your confirmation (e.g. FP-…) and the email you used at checkout. This is how
            most stores let guests look up orders without an account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="track-order-number" className="block text-sm font-semibold text-gray-200 mb-2">
                Order number
              </label>
              <input
                id="track-order-number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-falco-accent"
                placeholder="FP-1234567890-ABC123"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="track-email" className="block text-sm font-semibold text-gray-200 mb-2">
                Email
              </label>
              <input
                id="track-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-falco-accent"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-falco-accent to-falco-gold text-black font-bold disabled:opacity-60"
            >
              {loading ? 'Looking up…' : 'View order'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Have an account?{' '}
            <Link href="/auth/login?callbackUrl=/account/orders" className="text-falco-accent hover:underline">
              Sign in
            </Link>{' '}
            to see all orders.
          </p>
        </div>
      </div>
    </div>
  )
}
