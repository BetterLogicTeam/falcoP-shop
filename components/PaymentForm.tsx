'use client'

import React, { useState, useEffect } from 'react'
import { useStripe, useElements, CardElement, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { CreditCard, Lock, Smartphone, Globe, Shield, CheckCircle, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice, sekToOre } from '../lib/currency'

interface PaymentFormProps {
  totalAmount: number
  customerInfo: any
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
}

export default function PaymentForm({ totalAmount, customerInfo, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'apple' | 'google' | 'swiss'>('card')

  // Setup Apple Pay, Google Pay and Payment Request
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'SE',
        currency: 'sek',
        total: {
          label: 'Falco Peak Order',
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
          
          // Check specifically for Google Pay
          if (result.applePay) {
            console.log('Apple Pay available')
          }
          if (result.googlePay) {
            console.log('Google Pay available')
          }
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

          const { clientSecret, error: serverError } = await response.json()

          if (serverError) {
            ev.complete('fail')
            throw new Error(serverError)
          }

          // Confirm payment
          const { error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: ev.paymentMethod.id,
          })

          if (error) {
            ev.complete('fail')
            onError(error.message || 'Payment failed')
          } else {
            ev.complete('success')
            toast.success('Apple Pay payment successful!')
            onSuccess({ id: ev.paymentMethod.id })
          }
        } catch (error: any) {
          ev.complete('fail')
          onError(error.message || 'Payment failed')
        }
      })
    }
  }, [stripe, totalAmount, customerInfo, onSuccess, onError])

  // Debug: Check if Stripe is loaded
  React.useEffect(() => {
    console.log('Stripe loaded:', !!stripe)
    console.log('Elements loaded:', !!elements)
    console.log('Can make payment:', canMakePayment)
  }, [stripe, elements, canMakePayment])

  const handleGooglePay = async () => {
    setIsProcessing(true)
    try {
      // Show processing message
      toast.loading('Processing Google Pay payment...', { duration: 2000 })

      const response = await fetch('/api/google-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: sekToOre(totalAmount),
          currency: 'SEK',
          customerInfo,
          paymentMethod: 'google_pay',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Google Pay payment failed')
      }

      const result = await response.json()

      if (result.success) {
        // Show success with Google Pay details
        toast.success(`Google Pay payment successful! Transaction: ${result.data.transactionId}`, {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
          },
        })

        // Log the transaction details
        console.log('Google Pay Details:', result.data)

        onSuccess({
          id: result.data.transactionId,
          method: 'google_pay',
          googlePayData: result.data
        })
      } else {
        throw new Error(result.error || 'Google Pay payment failed')
      }
    } catch (error: any) {
      onError(error.message || 'Google Pay payment failed')
      toast.error(`Google Pay payment failed: ${error.message}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplePay = async () => {
    setIsProcessing(true)
    try {
      // Show processing message
      toast.loading('Processing Apple Pay payment...', { duration: 2000 })

      const response = await fetch('/api/apple-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: sekToOre(totalAmount),
          currency: 'SEK',
          customerInfo,
          paymentMethod: 'apple_pay',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Apple Pay payment failed')
      }

      const result = await response.json()

      if (result.success) {
        // Show success with Apple Pay details
        toast.success(`Apple Pay payment successful! Transaction: ${result.data.transactionId}`, {
          duration: 5000,
          style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
          },
        })

        // Log the transaction details
        console.log('Apple Pay Details:', result.data)

        onSuccess({
          id: result.data.transactionId,
          method: 'apple_pay',
          applePayData: result.data
        })
      } else {
        throw new Error(result.error || 'Apple Pay payment failed')
      }
    } catch (error: any) {
      onError(error.message || 'Apple Pay payment failed')
      toast.error(`Apple Pay payment failed: ${error.message}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSwissPay = async () => {
    setIsProcessing(true)
    try {
      // Show processing message
      toast.loading('Processing Swish payment...', { duration: 2000 })

      const response = await fetch('/api/swiss-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: sekToOre(totalAmount),
          currency: 'SEK',
          customerInfo,
          paymentMethod: 'swish',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Swish payment failed')
      }

      const result = await response.json()

      if (result.success) {
        // Show success with Swish details
        toast.success(`Swish payment successful! Transaction: ${result.data.transactionId}`, {
          duration: 5000,
          style: {
            background: '#78BE20',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
          },
        })

        // Log the transaction details
        console.log('Swish Payment Details:', result.data)

        onSuccess({
          id: result.data.transactionId,
          method: 'swish',
          swishData: result.data
        })
      } else {
        throw new Error(result.error || 'Swish payment failed')
      }
    } catch (error: any) {
      onError(error.message || 'Swish payment failed')
      toast.error(`Swish payment failed: ${error.message}`, {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (selectedPaymentMethod === 'swiss') {
      await handleSwissPay()
      return
    }

    if (selectedPaymentMethod === 'google') {
      await handleGooglePay()
      return
    }

    if (selectedPaymentMethod === 'apple') {
      await handleApplePay()
      return
    }

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setCardError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setIsProcessing(false)
      return
    }

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
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`Server error: ${response.status}`)
      }

      const { clientSecret, error: serverError } = await response.json()

      if (serverError) {
        throw new Error(serverError)
      }

      if (!clientSecret) {
        throw new Error('No client secret received from server')
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address,
              city: customerInfo.city,
              state: customerInfo.state,
              postal_code: customerInfo.zipCode,
              country: customerInfo.country,
            },
          },
        },
      })

      if (error) {
        setCardError(error.message || 'Payment failed')
        onError(error.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Credit card payment successful!', {
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
    } catch (error: any) {
      const errorMessage = error.message || 'Payment failed. Please try again.'
      setCardError(errorMessage)
      onError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#ffffff',
        '::placeholder': {
          color: '#9CA3AF',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#EF4444',
      },
    },
    hidePostalCode: false,
  }

  return (
    <div className="space-y-8">
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
                <div className="font-semibold text-white">Credit/Debit Card</div>
                <div className="text-sm text-gray-300">Traditional payment</div>
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

          {/* Swish */}
          <label className={`group relative flex flex-col p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
            selectedPaymentMethod === 'swiss'
              ? 'border-falco-accent bg-gradient-to-br from-falco-accent/20 to-falco-accent/10 shadow-lg ring-2 ring-falco-accent/30'
              : 'border-white/20 hover:border-white/40 hover:shadow-md bg-white/5'
            }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="swiss"
              checked={selectedPaymentMethod === 'swiss'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value as 'swiss')}
              className="sr-only"
            />

            {/* Selection indicator */}
            {selectedPaymentMethod === 'swiss' && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-falco-accent rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
              </div>
            )}

            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-lg mr-4 transition-colors ${
                selectedPaymentMethod === 'swiss' ? 'bg-[#78BE20]' : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <Smartphone className={`w-6 h-6 ${selectedPaymentMethod === 'swiss' ? 'text-white' : 'text-white'}`} />
              </div>
              <div>
                <div className="font-semibold text-white">Swish</div>
                <div className="text-sm text-gray-300">Swedish mobile payment</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-3">
              <div className="w-16 h-8 bg-[#78BE20] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Swish</span>
              </div>
            </div>

            <div className="text-xs text-gray-400">
              Pay instantly with your phone
            </div>
          </label>
        </div>
      </div>


      {/* Payment Form */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
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

          {/* Card Details - Only show for card payment */}
          {selectedPaymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-falco-accent" />
                <h4 className="text-lg font-semibold text-white">Card Information</h4>
              </div>
              <div className="p-6 border-2 border-white/20 rounded-xl bg-white/5 hover:border-white/30 transition-colors">
          {stripe ? (
            <CardElement
              options={cardElementOptions}
              onChange={(event) => {
                setCardError(event.error ? event.error.message : null)
              }}
            />
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-falco-accent mx-auto mb-4"></div>
              <p className="text-gray-300">Loading payment form...</p>
            </div>
          )}
        </div>
        {cardError && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-200 text-sm">{cardError}</p>
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

          {/* Swish Info */}
          {selectedPaymentMethod === 'swiss' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-[#78BE20]" />
                <h4 className="text-lg font-semibold text-white">Swish Payment</h4>
              </div>

              {/* Swish Payment Section */}
              <div className="bg-gradient-to-br from-[#78BE20]/20 to-[#78BE20]/5 border-2 border-[#78BE20]/30 rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#78BE20] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-white font-bold text-2xl">Swish</span>
                  </div>
                  <p className="text-white font-medium">Pay with Swish</p>
                  <p className="text-sm text-gray-400">Fast & secure Swedish mobile payment</p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">Payment Amount</span>
                    <span className="text-lg font-bold text-[#78BE20]">{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Processing Fee</span>
                    <span className="text-sm text-[#78BE20]">Free</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-400 mb-2">Open Swish app to complete payment</p>
                  <div className="flex justify-center">
                    <div className="w-12 h-8 bg-[#78BE20] rounded text-white text-xs flex items-center justify-center font-bold">Swish</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Buttons */}
          <div className="space-y-4">
            {/* Apple Pay Button */}
            {selectedPaymentMethod === 'apple' && canMakePayment && paymentRequest && (
              <div className="space-y-3">
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
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        <span>Pay with Apple Pay</span>
                      </>
                    )}
                  </button>
                </div>
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
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-blue-500 font-bold text-sm">G</span>
                        </div>
                        <span>Pay with Google Pay</span>
                      </>
                    )}
                  </button>
                </div>
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

            {/* Swish Button */}
            {selectedPaymentMethod === 'swiss' && (
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#78BE20] via-[#6BAD1C] to-[#5E9C18] text-white py-4 rounded-xl font-semibold hover:from-[#6BAD1C] hover:via-[#5E9C18] hover:to-[#518B14] transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing Swish Payment...</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-6 bg-white rounded flex items-center justify-center">
                      <span className="text-[#78BE20] font-bold text-xs">Swish</span>
                    </div>
                    <span>Pay {formatPrice(totalAmount)}</span>
                  </>
                )}
              </button>
            )}
          </div>

      {/* Security Notice */}
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 pt-4 border-t border-gray-200">
        <Lock className="w-4 h-4" />
            <span>
              {selectedPaymentMethod === 'card' && 'Secure payment powered by Stripe'}
              {selectedPaymentMethod === 'apple' && 'Secure payment with Apple Pay'}
              {selectedPaymentMethod === 'google' && 'Secure payment with Google Pay'}
              {selectedPaymentMethod === 'swiss' && 'Secure payment with Swish'}
            </span>
      </div>
    </form>
      </div>
    </div>
  )
}
