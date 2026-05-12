'use client'

import { useState, useEffect } from 'react'
import { Package, Search, Truck, CheckCircle, Clock, XCircle, Loader2, RefreshCw, DollarSign, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/currency'

interface OrderItem {
  id: string
  name: string
  image: string
  quantity: number
  price: number
  size?: string
  color?: string
}

interface Order {
  id: string
  orderNumber: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  status: string
  paymentStatus: string
  paymentIntentId?: string | null
  total: number
  subtotal: number
  shippingCost?: number
  tax: number
  items: OrderItem[]
  createdAt: string
  shippingLine1?: string
  shippingLine2?: string | null
  shippingCity?: string
  shippingState?: string
  shippingPostal?: string
  shippingCountry?: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true)
      const response = await fetch('/api/orders?limit=100')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      if (showLoading) toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(true) // Show loading on initial fetch

    // Auto-refresh every 10 seconds for real-time updates (silent)
    const interval = setInterval(() => {
      fetchOrders(false)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId)
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update order')

      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ))

      toast.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdatingOrder(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase().trim()
    const fullName = `${order.firstName || ''} ${order.lastName || ''}`.toLowerCase().trim()
    const matchesSearch =
      !term ||
      order.orderNumber.toLowerCase().includes(term) ||
      order.email.toLowerCase().includes(term) ||
      fullName.includes(term) ||
      (order.phone && String(order.phone).toLowerCase().includes(term))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = orders.filter(o => o.status === 'delivered' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search order #, email, name, or phone…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">Orders will appear here once customers make purchases.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Shipping Address</th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-4 sm:px-6 py-4 align-top min-w-0 max-w-[min(100vw,14rem)] sm:max-w-none">
                        <div className="text-sm font-medium text-gray-900 break-all">{order.orderNumber}</div>
                        {/* Buyer summary on small screens (full table hides Customer column until md) */}
                        <div className="md:hidden mt-2 space-y-1 text-xs">
                          <div className="font-medium text-gray-900">
                            {order.firstName} {order.lastName}
                          </div>
                          <div className="text-gray-600 break-all">{order.email}</div>
                          {order.phone ? (
                            <div className="text-gray-500">{order.phone}</div>
                          ) : null}
                          <p className="text-[10px] uppercase tracking-wide text-gray-500 pt-0.5">
                            Tap row for full buyer and shipping
                          </p>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 min-w-0 max-w-[14rem] lg:max-w-xs">
                        <div className="text-sm text-gray-900 break-all">{order.email}</div>
                        <div className="mt-0.5 text-xs text-gray-600">
                          {order.firstName} {order.lastName}
                        </div>
                        {order.phone ? (
                          <div className="mt-0.5 text-xs text-gray-500">{order.phone}</div>
                        ) : null}
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-[200px]">
                          {order.shippingLine1 ? (
                            <>
                              <div className="truncate">{order.shippingLine1}</div>
                              <div className="text-xs text-gray-500">
                                {order.shippingCity}, {order.shippingState} {order.shippingPostal}
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-400 italic">No address</span>
                          )}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items?.length || 0} items
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPrice(order.total ?? 0)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">{order.status}</span>
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-800 shadow-sm hover:bg-gray-50 hover:border-falco-accent/50"
                            title="Buyer, contact, shipping, line items"
                          >
                            <Eye className="h-4 w-4 text-gray-600 shrink-0" />
                            <span>Details</span>
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={updatingOrder === order.id}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-falco-accent disabled:opacity-50 bg-white text-gray-900 min-w-[6.5rem]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updatingOrder === order.id && (
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-200 p-4 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Order {selectedOrder.orderNumber}</h2>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">Buyer, contact, shipping address, and items</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
              {/* Buyer & contact */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Buyer</h3>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {selectedOrder.firstName} {selectedOrder.lastName}
                </p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Email</dt>
                    <dd>
                      <a
                        href={`mailto:${selectedOrder.email}`}
                        className="break-all text-gray-900 underline decoration-gray-400 underline-offset-2 hover:text-blue-800 hover:decoration-blue-800"
                      >
                        {selectedOrder.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Phone</dt>
                    <dd className="text-gray-900">
                      {selectedOrder.phone ? (
                        <a
                          href={`tel:${String(selectedOrder.phone).replace(/\s/g, '')}`}
                          className="text-gray-900 underline decoration-gray-400 underline-offset-2 hover:text-blue-800 hover:decoration-blue-800"
                        >
                          {selectedOrder.phone}
                        </a>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selectedOrder.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      Payment: {selectedOrder.paymentStatus || 'unknown'}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-800'}`}
                    >
                      Order: {selectedOrder.status}
                    </span>
                  </div>
                  {selectedOrder.paymentIntentId ? (
                    <p className="text-xs text-gray-500">
                      Stripe payment: <code className="rounded bg-gray-200 px-1 py-0.5">{selectedOrder.paymentIntentId}</code>
                    </p>
                  ) : null}
                </dl>
              </div>

              {/* Shipping */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Shipping address</h3>
                <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-800">
                  {selectedOrder.shippingLine1 || selectedOrder.shippingCity ? (
                    <>
                      {selectedOrder.shippingLine1 ? <p>{selectedOrder.shippingLine1}</p> : null}
                      {selectedOrder.shippingLine2 ? <p>{selectedOrder.shippingLine2}</p> : null}
                      <p>
                        {[selectedOrder.shippingCity, selectedOrder.shippingState, selectedOrder.shippingPostal]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      {selectedOrder.shippingCountry ? (
                        <p className="font-medium text-gray-900">{selectedOrder.shippingCountry}</p>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-gray-400 italic">No shipping address on file</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-900">{item.name}</span>
                        <span className="text-gray-500"> x{item.quantity}</span>
                        {item.size && <span className="text-gray-500"> ({item.size})</span>}
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Shipping</span>
                  <span>
                    {(selectedOrder.shippingCost ?? 0) > 0
                      ? formatPrice(selectedOrder.shippingCost!)
                      : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tax</span>
                  <span>{formatPrice(selectedOrder.tax ?? 0)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
