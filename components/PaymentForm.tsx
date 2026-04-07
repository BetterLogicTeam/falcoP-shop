'use client'

import React, { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { AlertTriangle, CreditCard, Lock, Smartphone, Shield, CheckCircle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice, sekToOre } from '../lib/currency'

/**
 * Billing for confirmPayment / confirmCardPayment.
 * Do not send `shipping` on the client if the PaymentIntent already has `shipping`
 * from create-payment-intent (secret key) — Stripe rejects changing it with the publishable key.
 */
function buildConfirmBilling(customerInfo: Record<string, unknown>) {
  const email = String(customerInfo?.email ?? '').trim()
  const first = String(customerInfo?.firstName ?? '').trim()
  const last = String(customerInfo?.lastName ?? '').trim()
  const fullName = `${first} ${last}`.trim() || 'Customer'
  const country = String(customerInfo?.country ?? '')
    .trim()
    .toUpperCase()
  const line1 = String(customerInfo?.address ?? '').trim()
  const city = String(customerInfo?.city ?? '').trim()
  const postal = String(customerInfo?.zipCode ?? '').trim()
  const stateStr = String(customerInfo?.state ?? '').trim()
  const phone = String(customerInfo?.phone ?? '').trim()

  const hasFullAddressForIntent =
    Boolean(email && line1 && city && postal && country.length === 2) && (country !== 'US' || Boolean(stateStr))

  const billing_details = {
    name: fullName,
    email: email || undefined,
    phone: phone || undefined,
    address: {
      line1: line1 || undefined,
      city: city || undefined,
      state: stateStr || undefined,
      postal_code: postal || undefined,
      country: country || undefined,
    },
  }

  return { email, fullName, billing_details, hasFullAddressForIntent }
}

function validateAddressCountryConsistency(customerInfo: Record<string, unknown>): string | null {
  const country = String(customerInfo?.country ?? '')
    .trim()
    .toUpperCase()
  const city = String(customerInfo?.city ?? '').trim()
  const postal = String(customerInfo?.zipCode ?? '').trim()
  const state = String(customerInfo?.state ?? '').trim()

  const usZipLike = /^\d{5}(-\d{4})?$/.test(postal)
  const ukPostcodeLike = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postal)
  const londonCity = /london/i.test(city)

  // Guard against the exact broken case seen in production logs: US + London + UK postcode.
  if (country === 'US') {
    if (!usZipLike) return 'For United States, use a valid US ZIP code (e.g. 10001).'
    if (londonCity || ukPostcodeLike || /london/i.test(state)) {
      return 'Country is set to United States, but address looks UK. Change country to United Kingdom (GB) or enter a real US address.'
    }
  }

  // If customer selects UK, guide toward UK postcode format.
  if ((country === 'GB' || country === 'UK') && postal && !ukPostcodeLike) {
    return 'For United Kingdom, use a valid UK postcode (e.g. SW1A 1AA).'
  }

  return null
}

function friendlyStripeErrorMessage(raw: string | undefined, country: unknown): string {
  const msg = (raw || '').trim()
  const isShippingValidation = msg.includes('When providing a shipping address')
  if (isShippingValidation) {
    return String(country).toUpperCase() === 'US'
      ? 'Please enter street, city, state, ZIP code, country, and a valid email before paying.'
      : 'Please enter street, city, postal code, country, and a valid email before paying.'
  }
  return msg || 'Payment failed. Please try again.'
}

export type PendingCheckoutPayload = {
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

interface PaymentFormProps {
  totalAmount: number
  customerInfo: any
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  /** True when PaymentIntent was created with Klarna (not card-only fallback) */
  stripeIncludesKlarna?: boolean
  /** Saved before Klarna/card redirect so order can be created on return */
  buildPendingCheckout?: () => PendingCheckoutPayload
}

export default function PaymentForm({
  totalAmount,
  customerInfo,
  onSuccess,
  onError,
  buildPendingCheckout,
  stripeIncludesKlarna = false,
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'apple' | 'google'>('card')

  // Setup Apple Pay, Google Pay and Payment Request
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'SE',
        currency: 'sek',
        total: {
          label: 'Falco P Order',
          amount: sekToOre(totalAmount),
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: true,
      })

      // Check if Apple Pay and Google Pay are available
      pr.canMakePayment().then((result) => {
        if (result) {
          setCanMakePayment(true)
          setPaymentRequest(pr)
        }
      })

      pr.on('paymentmethod', async (ev) => {
        try {
          // Create payment intent
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: sekToOre(totalAmount),
              currency: 'sek',
              customerInfo,
              payment_method_id: ev.paymentMethod.id,
            }),
          })

          const payload = await response.json().catch(() => ({}))
          if (!response.ok) {
            ev.complete('fail')
            throw new Error(
              typeof payload.error === 'string' ? payload.error : `Server error: ${response.status}`
            )
          }

          const { clientSecret, error: serverError } = payload

          if (serverError) {
            ev.complete('fail')
            throw new Error(serverError)
          }

          const { email, hasFullAddressForIntent } = buildConfirmBilling(customerInfo)
          const walletConfirm: Parameters<typeof stripe.confirmCardPayment>[1] = {
            payment_method: ev.paymentMethod.id,
            ...(email && hasFullAddressForIntent ? { receipt_email: email } : {}),
          }

          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, walletConfirm)

          if (error) {
            ev.complete('fail')
            onError(friendlyStripeErrorMessage(error.message, customerInfo?.country))
          } else if (paymentIntent?.status === 'succeeded') {
            ev.complete('success')
            toast.success('Payment successful!')
            onSuccess(paymentIntent)
          } else {
            ev.complete('fail')
            onError('Payment was not completed')
          }
        } catch (error: any) {
          ev.complete('fail')
          onError(friendlyStripeErrorMessage(error?.message, customerInfo?.country))
        }
      })
    }
  }, [stripe, totalAmount, customerInfo, onSuccess, onError])

  /* Apple Pay / Google Pay: charges go through Stripe PaymentRequest + PaymentIntent (useEffect above).
   * Swish: disabled — restore from git / re-enable Swish UI + swiss-payment route when ready. */

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (selectedPaymentMethod === 'google' || selectedPaymentMethod === 'apple') {
      toast('Use the Google Pay or Apple Pay button above — payment runs through Stripe.', {
        icon: '💳',
        duration: 4000,
      })
      return
    }

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setCardError(null)

    try {
      const { email, billing_details, hasFullAddressForIntent } = buildConfirmBilling(customerInfo)
      const consistencyError = validateAddressCountryConsistency(customerInfo)

      if (!email || !email.includes('@')) {
        const msg = 'Enter a valid email address before paying.'
        setCardError(msg)
        onError(msg)
        toast.error(msg)
        setIsProcessing(false)
        return
      }

      if (consistencyError) {
        setCardError(consistencyError)
        onError(consistencyError)
        toast.error(consistencyError)
        setIsProcessing(false)
        return
      }

      if (!hasFullAddressForIntent) {
        const msg =
          customerInfo.country === 'US'
            ? 'Fill in street, city, state, ZIP, and country before paying (required for Klarna and delivery).'
            : 'Fill in street, city, postal code, and country before paying (required for Klarna and delivery).'
        setCardError(msg)
        onError(msg)
        toast.error(msg)
        setIsProcessing(false)
        return
      }

      if (buildPendingCheckout) {
        try {
          sessionStorage.setItem('falco_pending_checkout', JSON.stringify(buildPendingCheckout()))
        } catch {
          /* ignore quota / private mode */
        }
      }

      const { error: submitError } = await elements.submit()
      if (submitError) {
        setCardError(submitError.message || 'Check payment details')
        onError(submitError.message || 'Invalid payment form')
        setIsProcessing(false)
        return
      }

      const returnUrl = `${window.location.origin}/order-confirmation`

      /** `redirect: 'if_required'` is required for correct typings (`PaymentIntentResult`); Klarna still redirects when needed. */
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: returnUrl,
          receipt_email: email,
          payment_method_data: {
            billing_details,
          },
        },
      })

      if (error) {
        const friendly = friendlyStripeErrorMessage(error.message, customerInfo?.country)
        setCardError(friendly)
        onError(friendly)
        try {
          sessionStorage.removeItem('falco_pending_checkout')
        } catch {
          /* ignore */
        }
      } else if (paymentIntent?.status === 'succeeded') {
        try {
          sessionStorage.removeItem('falco_pending_checkout')
        } catch {
          /* ignore */
        }
        toast.success('Payment successful!', {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
          },
        })
        onSuccess(paymentIntent)
      }
      /* Klarna may redirect the browser — sessionStorage keeps pending order until return */
    } catch (error: any) {
      const errorMessage = friendlyStripeErrorMessage(error?.message, customerInfo?.country)
      setCardError(errorMessage)
      onError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Secure Payment</h3>
        <p className="text-gray-300">Choose your preferred payment method</p>
        <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-gray-400">
          <Shield className="w-4 h-4 text-falco-accent" />
          <span>256-bit SSL encryption</span>
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>PCI compliant</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Credit Card */}
          <label className={`group relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedPaymentMethod === 'card' 
              ? 'border-falco-accent bg-gradient-to-br from-falco-accent/20 to-falco-accent/10 shadow-lg ring-2 ring-falco-accent/30' 
              : 'border-white/20 hover:border-white/40 hover:shadow-md bg-white/5'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={selectedPaymentMethod === 'card'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'card')}
              className="sr-only"
            />
            
            {/* Selection indicator */}
            {selectedPaymentMethod === 'card' && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-falco-accent rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg mr-4 transition-colors ${
                selectedPaymentMethod === 'card' ? 'bg-falco-accent' : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <CreditCard className={`w-6 h-6 ${selectedPaymentMethod === 'card' ? 'text-black' : 'text-white'}`} />
              </div>
              <div>
                <div className="font-semibold text-white">
                  {stripeIncludesKlarna ? 'Card & Klarna' : 'Card'}
                </div>
                <div className="text-sm text-gray-300">
                  {stripeIncludesKlarna ? 'Stripe — card or pay later' : 'Stripe — debit / credit'}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 mb-3">
              <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
              <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
              <div className="w-10 h-6 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
            </div>
            
            <div className="text-xs text-gray-400">
              Secure payment processing by Stripe
            </div>
          </label>

          {/* Apple Pay */}
          <label className={`group relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedPaymentMethod === 'apple' 
              ? 'border-falco-accent bg-gradient-to-br from-falco-accent/20 to-falco-accent/10 shadow-lg ring-2 ring-falco-accent/30' 
              : 'border-white/20 hover:border-white/40 hover:shadow-md bg-white/5'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="apple"
              checked={selectedPaymentMethod === 'apple'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'apple')}
              className="sr-only"
            />
            
            {/* Selection indicator */}
            {selectedPaymentMethod === 'apple' && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-falco-accent rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg mr-4 transition-colors ${
                selectedPaymentMethod === 'apple' ? 'bg-black' : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-white">Apple Pay</div>
                <div className="text-sm text-gray-300">Touch ID / Face ID</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-300">One-tap payment</div>
            </div>
            
            <div className="text-xs text-gray-400">
              Secure biometric authentication
            </div>
          </label>

          {/* Google Pay */}
          <label className={`group relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedPaymentMethod === 'google' 
              ? 'border-falco-accent bg-gradient-to-br from-falco-accent/20 to-falco-accent/10 shadow-lg ring-2 ring-falco-accent/30' 
              : 'border-white/20 hover:border-white/40 hover:shadow-md bg-white/5'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="google"
              checked={selectedPaymentMethod === 'google'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'google')}
              className="sr-only"
            />
            
            {/* Selection indicator */}
            {selectedPaymentMethod === 'google' && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-falco-accent rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg mr-4 transition-colors ${
                selectedPaymentMethod === 'google' ? 'bg-blue-500' : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-white">Google Pay</div>
                <div className="text-sm text-gray-300">Fast & secure</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-300">Quick checkout</div>
            </div>
            
            <div className="text-xs text-gray-400">
              Pay with your Google account
            </div>
          </label>

          {/* Swish — disabled for now; re-enable radio + panels when integrating real Swish.
          <label className={...}> ... Swish ... </label>
          */}
        </div>
      </div>


      {/* Payment Form */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-4 sm:p-8">
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Debug Info */}
          {!stripe && selectedPaymentMethod === 'card' && (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-3"></div>
          <p className="text-yellow-200 text-sm">
            Loading Stripe... Please wait a moment.
          </p>
              </div>
        </div>
      )}

          {/* Card + Klarna (Stripe Payment Element) */}
          {selectedPaymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-falco-accent" />
                <h4 className="text-lg font-semibold text-white">
                  {stripeIncludesKlarna ? 'Card or Klarna' : 'Card'}
                </h4>
              </div>
              {stripeIncludesKlarna ? null : (
                <p className="text-xs text-amber-200/90 leading-relaxed rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2">
                  Klarna isn’t on this PaymentIntent (enable it in{' '}
                  <strong>Stripe → Settings → Payment methods</strong>, match currency/country/amount rules, and check
                  the terminal for “card+klarna failed”). The country in this form should match your Klarna customer
                  rules; the country inside the card box must be supported too. You can still pay by card.
                </p>
              )}
              <div className="p-3 sm:p-6 border-2 border-white/20 rounded-xl bg-white/5 hover:border-white/30 transition-colors">
                {stripe ? (
                  <PaymentElement
                    options={{
                      layout: {
                        type: 'accordion',
                        defaultCollapsed: false,
                        radios: true,
                        spacedAccordionItems: false,
                      },
                      paymentMethodOrder: ['klarna', 'card'],
                      defaultValues: {
                        billingDetails: {
                          name: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || undefined,
                          email: customerInfo.email || undefined,
                          phone: customerInfo.phone || undefined,
                          address: {
                            line1: customerInfo.address || undefined,
                            city: customerInfo.city || undefined,
                            state: customerInfo.state || undefined,
                            postal_code: customerInfo.zipCode || undefined,
                            country: customerInfo.country || undefined,
                          },
                        },
                      },
                    }}
                    onChange={() => setCardError(null)}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-falco-accent mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading payment form...</p>
                  </div>
                )}
              </div>
              {cardError && (
                <div
                  className="rounded-xl border-2 border-red-300 bg-gradient-to-br from-red-700/90 to-red-800/90 px-4 py-3 shadow-[0_0_0_1px_rgba(254,202,202,0.35),0_10px_28px_rgba(69,10,10,0.45)]"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-wide text-amber-100">Payment issue</p>
                      <p className="mt-1 text-base font-semibold leading-6 text-white">{cardError}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Apple Pay Section */}
          {selectedPaymentMethod === 'apple' && canMakePayment && paymentRequest && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-900">Apple Pay Ready</h4>
              </div>
              <div className="p-6 border-2 border-gray-200 rounded-xl bg-white text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl">🍎</span>
                  </div>
                  <p className="text-gray-600">Apple Pay is ready for your payment</p>
                  <p className="text-sm text-gray-500">Use Touch ID or Face ID to complete your purchase</p>
                </div>
              </div>
            </div>
          )}

          {/* Google Pay Section */}
          {selectedPaymentMethod === 'google' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-gray-600" />
                <h4 className="text-lg font-semibold text-gray-900">Google Pay Ready</h4>
              </div>
              <div className="p-6 border-2 border-gray-200 rounded-xl bg-white text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-xl font-bold">G</span>
                  </div>
                  <p className="text-gray-600">Google Pay is ready for your payment</p>
                  <p className="text-sm text-gray-500">Quick and secure checkout</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Buttons */}
          <div className="space-y-4">
            {/* Apple Pay Button */}
            {selectedPaymentMethod === 'apple' && (
              <div className="space-y-3">
                {canMakePayment && paymentRequest && (
                  <div className="relative">
                    <PaymentRequestButtonElement
                      options={{
                        paymentRequest,
                        style: {
                          paymentRequestButton: {
                            type: 'default',
                            theme: 'dark',
                            height: '56px',
                          },
                        },
                      }}
                    />
                  </div>
                )}
                <p className="text-center text-sm text-gray-400">
                  Tap the button above — Apple Pay is processed securely by Stripe.
                </p>
                {!canMakePayment && (
                  <p className="text-center text-sm text-amber-200/90">
                    Apple Pay isn’t available here (try Safari on iPhone/Mac, or use card).
                  </p>
                )}
              </div>
            )}

            {/* Google Pay Button */}
            {selectedPaymentMethod === 'google' && (
              <div className="space-y-3">
                {canMakePayment && paymentRequest && (
                  <div className="relative">
                    <PaymentRequestButtonElement
                      options={{
                        paymentRequest,
                        style: {
                          paymentRequestButton: {
                            type: 'default',
                            theme: 'light',
                            height: '56px',
                          },
                        },
                      }}
                    />
                  </div>
                )}
                <p className="text-center text-sm text-gray-400">
                  Tap the button above — Google Pay is processed securely by Stripe.
                </p>
                {!canMakePayment && (
                  <p className="text-center text-sm text-amber-200/90">
                    Google Pay isn’t available in this browser. Try Chrome or use card payment.
                  </p>
                )}
              </div>
            )}

            {/* Credit Card Payment Button */}
            {selectedPaymentMethod === 'card' && (
      <button
        type="submit"
        disabled={!stripe || isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
      >
        {isProcessing ? (
          <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
                    <CreditCard className="w-6 h-6" />
            <span>Pay {formatPrice(totalAmount)}</span>
                    <div className="flex space-x-1">
                      <div className="w-6 h-4 bg-white rounded text-blue-600 text-xs flex items-center justify-center font-bold">V</div>
                      <div className="w-6 h-4 bg-white rounded text-red-600 text-xs flex items-center justify-center font-bold">M</div>
                      <div className="w-6 h-4 bg-white rounded text-green-600 text-xs flex items-center justify-center font-bold">A</div>
                    </div>
                  </>
                )}
              </button>
            )}

          </div>

      {/* Security Notice */}
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 pt-4 border-t border-gray-200">
        <Lock className="w-4 h-4" />
            <span>
              {selectedPaymentMethod === 'card' &&
                (stripeIncludesKlarna ? 'Card & Klarna via Stripe' : 'Secure payment via Stripe')}
              {selectedPaymentMethod === 'apple' && 'Apple Pay via Stripe'}
              {selectedPaymentMethod === 'google' && 'Google Pay via Stripe'}
            </span>
      </div>
    </form>
      </div>
    </div>
  )
}
