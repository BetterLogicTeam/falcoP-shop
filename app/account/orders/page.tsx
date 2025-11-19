'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Truck, CheckCircle, Clock, XCircle, Loader2, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface OrderItem {
  id: string
  productName: string
  productImage: string
  quantity: number
  price: number
  size?: string
  color?: string
}

interface Order {
  id: string
  orderNumber: string
  firstName: string
  lastName: string
  status: string
  paymentStatus: string
  total: number
  subtotal: number
  tax: number
  shippingCost: number
  items: OrderItem[]
  createdAt: string
  shippingLine1?: string
  shippingCity?: string
  shippingState?: string
  shippingPostal?: string
  shippingCountry?: string
}

const statusConfig: Record<string, { color: string; icon: any; label: string; description: string }> = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    label: 'Pending',
    description: 'Your order is being processed'
  },
  processing: {
    color: 'bg-blue-100 text-blue-800',
    icon: Package,
    label: 'Processing',
    description: 'Your order is being prepared'
  },
  shipped: {
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
    label: 'Shipped',
    description: 'Your order is on the way'
  },
  delivered: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    label: 'Delivered',
    description: 'Your order has been delivered'
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    label: 'Cancelled',
    description: 'Your order has been cancelled'
  }
}

export default function CustomerOrdersPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [sessionStatus, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return

      try {
        const response = await fetch('/api/orders/customer')
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchOrders()
    }
  }, [session])

  if (sessionStatus === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Account
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">View your order history and track shipments</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">When you make a purchase, your orders will appear here.</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-falco-accent text-black font-semibold rounded-lg hover:bg-falco-gold transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = status.icon
              const isExpanded = expandedOrder === order.id

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <button
                    onClick={() => toggleOrder(order.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                          <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6">
                      {/* Status Timeline */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Order Status</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <StatusIcon className={`w-8 h-8 ${status.color.replace('bg-', 'text-').split(' ')[0].replace('100', '600')}`} />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">{status.label}</p>
                              <p className="text-sm text-gray-600">{status.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.productName}</p>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity}
                                  {item.size && ` | Size: ${item.size}`}
                                  {item.color && ` | Color: ${item.color}`}
                                </p>
                              </div>
                              <p className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      {order.shippingLine1 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Shipping Address</h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.firstName} {order.lastName}</p>
                            <p>{order.shippingLine1}</p>
                            <p>
                              {order.shippingCity}, {order.shippingState} {order.shippingPostal}
                            </p>
                            <p>{order.shippingCountry}</p>
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2) || '0.00'}`}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span>${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
