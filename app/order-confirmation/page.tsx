'use client'

import React, { useEffect, useState, useRef, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { CheckCircle, Package, Truck, Home, ShoppingBag, Clock, Mail, Phone, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/currency'
import { ORDER_LOOKUP_EMAIL_STORAGE_KEY, rememberOrderLookupEmail } from '@/lib/order-lookup'

interface OrderItem {
  id: string
  productName: string
  productImage: string
  size: string | null
  color: string | null
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  email: string
  status: string
  paymentStatus?: string
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  shippingAddress: any
  items: OrderItem[]
  createdAt: string
  trackingNumber: string | null
  trackingUrl?: string | null
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { clearCart } = useCart()
  const klarnaReturnHandled = useRef(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsEmailForLookup, setNeedsEmailForLookup] = useState(false)
  const [guestEmailInput, setGuestEmailInput] = useState('')
  const [lookupSubmitting, setLookupSubmitting] = useState(false)

  const paymentIsConfirmed = order?.paymentStatus === 'paid'
  const hasOrder = Boolean(order?.orderNumber)

  // After Klarna (or other redirect) Stripe sends user here with ?payment_intent=&redirect_status=succeeded
  useEffect(() => {
    const pi = searchParams?.get('payment_intent')
    const rs = searchParams?.get('redirect_status')
    if (!pi || rs !== 'succeeded' || klarnaReturnHandled.current) return

    const raw = typeof window !== 'undefined' ? sessionStorage.getItem('falco_pending_checkout') : null
    if (!raw) return

    klarnaReturnHandled.current = true
    let pending: {
      customerInfo: Record<string, string>
      items: Array<{
        productId: string
        name: string
        image: string
        price: number
        quantity: number
        size: string | null
        color: string | null
      }>
      totalAmount: number
      couponCode: string | null
    }
    try {
      pending = JSON.parse(raw)
    } catch {
      klarnaReturnHandled.current = false
      return
    }

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerInfo: pending.customerInfo,
        items: pending.items,
        totalAmount: pending.totalAmount,
        paymentIntentId: pi,
        couponCode: pending.couponCode,
      }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}))
        if (!r.ok) {
          console.error('Order create after redirect:', data)
          klarnaReturnHandled.current = false
          return
        }
        try {
          sessionStorage.removeItem('falco_pending_checkout')
        } catch {
          /* ignore */
        }
        rememberOrderLookupEmail(pending.customerInfo.email || '')
        clearCart()
        const num = data.order?.orderNumber
        router.replace(
          `/order-confirmation?order=${encodeURIComponent(num || '')}&payment_intent=${encodeURIComponent(pi)}`
        )
      })
      .catch(() => {
        klarnaReturnHandled.current = false
      })
  }, [searchParams, router, clearCart])

  const fetchOrderByLookup = useCallback(
    async (orderNumber: string, email: string) => {
      const q = new URLSearchParams({ orderNumber, email: email.trim().toLowerCase() })
      const response = await fetch(`/api/orders/lookup?${q.toString()}`)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Order not found')
      }
      if (!data.order) {
        throw new Error('Order not found')
      }
      setOrder(data.order as Order)
      setError(null)
      rememberOrderLookupEmail(email)
    },
    []
  )

  useEffect(() => {
    const run = async () => {
      const orderNumber = searchParams?.get('order')?.trim()
      if (!orderNumber) {
        setIsLoading(false)
        setNeedsEmailForLookup(false)
        return
      }

      let email =
        (typeof window !== 'undefined' ? sessionStorage.getItem(ORDER_LOOKUP_EMAIL_STORAGE_KEY) : null) ||
        session?.user?.email ||
        ''
      email = email.trim().toLowerCase()

      if (!email) {
        setNeedsEmailForLookup(true)
        setIsLoading(false)
        return
      }

      try {
        await fetchOrderByLookup(orderNumber, email)
        setNeedsEmailForLookup(false)
      } catch (err: unknown) {
        console.error('Order lookup:', err)
        setError(err instanceof Error ? err.message : 'Failed to load order')
        setNeedsEmailForLookup(true)
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [searchParams, session?.user?.email, fetchOrderByLookup])

  async function handleGuestEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    const orderNumber = searchParams?.get('order')?.trim()
    if (!orderNumber || !guestEmailInput.trim()) return
    setLookupSubmitting(true)
    setError(null)
    try {
      await fetchOrderByLookup(orderNumber, guestEmailInput)
      setNeedsEmailForLookup(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not find order')
    } finally {
      setLookupSubmitting(false)
    }
  }

  // Calculate estimated delivery (3 business days)
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-falco-accent mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  const orderNumberParam = searchParams?.get('order')?.trim()
  if (orderNumberParam && needsEmailForLookup && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View your order</h1>
          <p className="text-gray-600 text-sm mb-6">
            For your security, enter the <strong>same email</strong> you used at checkout. Order{' '}
            <span className="font-mono font-semibold">{orderNumberParam}</span>
          </p>
          <form onSubmit={handleGuestEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="guest-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="guest-email"
                type="email"
                autoComplete="email"
                required
                value={guestEmailInput}
                onChange={(e) => setGuestEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={lookupSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-falco-accent to-falco-gold text-black font-semibold disabled:opacity-60"
            >
              {lookupSubmitting ? 'Loading…' : 'View order'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/track-order" className="text-falco-accent hover:underline">
              Track a different order
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Success Animation */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-10"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-lg">🎉</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {paymentIsConfirmed
                ? 'Order Confirmed!'
                : hasOrder
                ? 'Order Received'
                : 'Payment Not Completed'}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              {paymentIsConfirmed
                ? 'Thank you for your purchase'
                : hasOrder
                ? 'Payment pending or canceled'
                : 'Your payment was canceled or failed'}
            </p>
            <p className="text-lg text-gray-500">
              {paymentIsConfirmed
                ? `Your order #${order?.orderNumber || 'N/A'} has been successfully placed`
                : hasOrder
                ? `We saved order #${order?.orderNumber || 'N/A'}, but payment is not confirmed yet.`
                : 'No order was created because payment was not completed.'}
            </p>
            {paymentIsConfirmed && order?.email ? (
              <p className="mt-3 text-base text-gray-600">
                A purchase confirmation and receipt summary are being sent to{' '}
                <span className="font-semibold text-gray-800">{order.email}</span>. Check your spam
                folder if they do not arrive within a few minutes.
              </p>
            ) : null}
          </div>

          {/* Order Details Card */}
          {hasOrder ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Package className="w-6 h-6 mr-3 text-blue-600" />
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {order?.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                        <p className="text-sm text-gray-600">
                          {item.size && `Size: ${item.size}`}
                          {item.size && ' • '}
                          Qty: {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{order?.subtotal != null ? formatPrice(order.subtotal) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {order?.shippingCost != null && order.shippingCost > 0
                        ? formatPrice(order.shippingCost)
                        : 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>{order?.tax != null ? formatPrice(order.tax) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-2xl text-green-600">{order?.total != null ? formatPrice(order.total) : '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Tracking */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Truck className="w-6 h-6 mr-3 text-green-600" />
                  Shipping Details
                </h2>

                <div className="space-y-6">
                  {/* Delivery Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {paymentIsConfirmed ? 'Order Confirmed' : 'Payment Pending'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {paymentIsConfirmed
                            ? 'Payment processed successfully'
                            : 'Payment was not completed. Please retry checkout if needed.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${order?.status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Preparing for Shipment</p>
                        <p className="text-sm text-gray-600">Your order is being prepared</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${order?.status === 'shipped' ? 'bg-green-500' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
                        <Truck className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Shipped</p>
                        <p className="text-sm text-gray-600">Estimated delivery: {estimatedDelivery.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Info */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Order Information</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Order Number: <span className="font-mono font-bold">{order?.orderNumber || 'N/A'}</span>
                    </p>
                    {order?.trackingNumber && (
                      <div className="text-sm text-blue-800 mt-1">
                        <p>
                          Tracking: <span className="font-mono font-bold">{order.trackingNumber}</span>
                        </p>
                        {order.trackingUrl ? (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex mt-1 text-falco-accent hover:underline"
                          >
                            Track shipment
                          </a>
                        ) : null}
                      </div>
                    )}
                    <p className="text-sm text-blue-700 mt-1">
                      Confirmation sent to: {order?.email}
                    </p>
                  </div>

                  {/* Shipping Address */}
                  {order?.shippingAddress && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Shipping To:</h3>
                      <p className="text-sm text-gray-700">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">falcoswoop@gmail.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">0046762467194</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment was not completed</h2>
            <p className="text-gray-700 mb-6">
              We did not create an order because the payment was canceled or failed. Please return to checkout and try again.
            </p>
            <Link
              href="/checkout"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-falco-accent to-falco-gold px-6 py-3 font-semibold text-black border border-gray-900/20 hover:opacity-95 transition-opacity"
            >
              Return to Checkout
            </Link>
          </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              <span>Return to Home</span>
            </Link>

            <Link
              href="/shop"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">No extra charge for delivery</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">14-Day Returns</h3>
              <p className="text-sm text-gray-600">Hassle-free returns</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Top-tier sportswear</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-falco-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}
