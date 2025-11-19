'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Truck, Home, ShoppingBag, Clock, Mail, Phone, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
  total: number
  subtotal: number
  shipping: number
  tax: number
  shippingAddress: any
  items: OrderItem[]
  createdAt: string
  trackingNumber: string | null
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      const orderNumber = searchParams?.get('order')

      if (!orderNumber) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/orders?orderNumber=${orderNumber}`)
        if (response.ok) {
          const data = await response.json()
          if (data.orders && data.orders.length > 0) {
            setOrder(data.orders[0])
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [searchParams])

  // Calculate estimated delivery (3-5 business days)
  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5)

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
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Thank you for your purchase
            </p>
            <p className="text-lg text-gray-500">
              Your order #{order?.orderNumber || 'N/A'} has been successfully placed
            </p>
          </div>

          {/* Order Details Card */}
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
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                          {(item.size || item.color) && ' • '}
                          Qty: {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${order?.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>{order?.shipping === 0 ? 'Free' : `$${order?.shipping?.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>${order?.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-2xl text-green-600">${order?.total?.toFixed(2) || '0.00'}</span>
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
                        <p className="font-semibold text-gray-900">Order Confirmed</p>
                        <p className="text-sm text-gray-600">Payment processed successfully</p>
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
                      <p className="text-sm text-blue-800 mt-1">
                        Tracking: <span className="font-mono font-bold">{order.trackingNumber}</span>
                      </p>
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
                        <span className="text-sm text-gray-700">support@falcop.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">+1 (555) 123-4567</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              <p className="text-sm text-gray-600">On all orders over $50</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">30-Day Returns</h3>
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
