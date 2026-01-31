'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, Check, LogIn } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCart } from '../../contexts/CartContext'
import { useClientTranslation } from '../../hooks/useClientTranslation'
import StripeElementsProvider from '../../components/StripeElementsProvider'
import PaymentForm from '../../components/PaymentForm'
import toast from 'react-hot-toast'
import { formatPrice, FREE_SHIPPING_THRESHOLD_SEK } from '../../lib/currency'

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { state, clearCart } = useCart()
  const { t } = useClientTranslation()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  })

  // Wait for client-side hydration before checking cart
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Pre-fill email from session
  useEffect(() => {
    if (session?.user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: session.user?.email || '' }))
    }
  }, [session, formData.email])

  useEffect(() => {
    // Only redirect after hydration is complete and cart is confirmed empty
    if (isMounted && state.items.length === 0) {
      router.push('/shop')
    }
  }, [isMounted, state.items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Create order in database
      const orderItems = state.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize || null,
        color: item.selectedColor || null
      }))

      console.log('=== CHECKOUT DEBUG ===')
      console.log('Cart items:', state.items.length)
      console.log('Order items to send:', orderItems)
      console.log('Total price:', state.totalPrice)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo: formData,
          items: orderItems,
          totalAmount: state.totalPrice,
          paymentIntentId: paymentIntent.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Failed to create order:', data.error)
        toast.error('Order created but failed to save. Please contact support.')
      }

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order-confirmation?order=${data.order?.orderNumber || ''}&payment_intent=${paymentIntent.id}`)
    } catch (error) {
      console.error('Error creating order:', error)
      // Still redirect even if order save fails
      clearCart()
      router.push(`/order-confirmation?payment_intent=${paymentIntent.id}`)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
  }

  // Show loading while checking authentication status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-falco-primary flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-falco-accent border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Require authentication to checkout
  if (!session) {
    return (
      <div className="min-h-screen bg-falco-primary flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black"></div>
        <div className="relative z-10 text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-falco-accent to-falco-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-300 mb-8">Please sign in to your account to complete your purchase. This helps us track your orders and provide better support.</p>
          <div className="space-y-4">
            <Link
              href="/auth/login?callbackUrl=/checkout"
              className="block w-full bg-gradient-to-r from-falco-accent to-falco-gold text-black px-8 py-4 rounded-xl font-bold hover:from-falco-gold hover:to-falco-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register?callbackUrl=/checkout"
              className="block w-full bg-white/10 text-white px-8 py-4 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Create Account
            </Link>
            <Link href="/shop" className="block text-gray-400 hover:text-white transition-colors mt-4">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-falco-primary flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black"></div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-falco-accent to-falco-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-gray-300 mb-8">Add some premium items to get started</p>
          <Link href="/shop" className="bg-gradient-to-r from-falco-accent to-falco-gold text-black px-8 py-4 rounded-xl font-bold hover:from-falco-gold hover:to-falco-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-falco-primary">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors duration-300 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Continue Shopping</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">CHECKOUT</h1>
            <p className="text-gray-300 text-lg">Complete your premium order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-falco-accent to-falco-gold rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white">Shipping Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                  placeholder="Enter your email"
                />
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-200 mb-3">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-200 mb-3">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-200 mb-3">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                  placeholder="Enter your address"
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-200 mb-3">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-200 mb-3">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-200 mb-3">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                    placeholder="ZIP"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-200 mb-3">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white transition-all duration-300 hover:bg-white/15"
                >
                  <option value="US" className="bg-gray-800 text-white">United States</option>
                  <option value="CA" className="bg-gray-800 text-white">Canada</option>
                  <option value="GB" className="bg-gray-800 text-white">United Kingdom</option>
                  <option value="AU" className="bg-gray-800 text-white">Australia</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-200 mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-falco-accent focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:bg-white/15"
                  placeholder="Phone number (optional)"
                />
              </div>

              {/* Payment Section */}
              <div className="border-t border-white/20 pt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-falco-accent to-falco-gold rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Payment Information</h3>
                </div>
                <StripeElementsProvider>
                  <PaymentForm
                    totalAmount={state.totalPrice}
                    customerInfo={formData}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </StripeElementsProvider>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-falco-accent to-falco-gold rounded-xl flex items-center justify-center">
                <Check className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white">Order Summary</h2>
            </div>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {item.product.name}
                    </h3>
                    {item.selectedSize && (
                      <p className="text-xs text-gray-300">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs text-gray-300">Color: {item.selectedColor}</p>
                    )}
                    <p className="text-sm text-gray-300">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-white">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t border-white/20 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white font-semibold">{formatPrice(state.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Shipping</span>
                <span className="text-green-400 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Tax</span>
                <span className="text-gray-300">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-white/20 pt-4">
                <span className="text-white">Total</span>
                <span className="text-falco-accent">{formatPrice(state.totalPrice)}</span>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span>Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD_SEK)}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span>14-day return policy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span>Secure payment processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
