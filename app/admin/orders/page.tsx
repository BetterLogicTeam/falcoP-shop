'use client'

import { useState } from 'react'
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock, DollarSign, Calendar, User, MapPin, Phone, Mail } from 'lucide-react'

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Impressive dummy order data
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001'
      },
      items: [
        { name: 'WING P Pro', quantity: 2, price: 299, image: '/images/11.jpg' },
        { name: 'Falco Training Tee', quantity: 1, price: 49, image: '/images/13.jpg' }
      ],
      total: 647,
      status: 'completed',
      paymentMethod: 'Credit Card',
      orderDate: '2024-01-15',
      shippingDate: '2024-01-16',
      deliveryDate: '2024-01-18',
      trackingNumber: 'TRK123456789',
      notes: 'Customer requested express delivery'
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'Sarah Williams',
        email: 'sarah.w@email.com',
        phone: '+1 (555) 987-6543',
        address: '456 Oak Ave, Los Angeles, CA 90210'
      },
      items: [
        { name: 'WING P Basketball Elite', quantity: 1, price: 349, image: '/images/12.jpg' }
      ],
      total: 349,
      status: 'shipped',
      paymentMethod: 'PayPal',
      orderDate: '2024-01-14',
      shippingDate: '2024-01-15',
      deliveryDate: null,
      trackingNumber: 'TRK987654321',
      notes: 'Gift wrapping requested'
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1 (555) 456-7890',
        address: '789 Pine St, Chicago, IL 60601'
      },
      items: [
        { name: 'Falco Compression Shorts', quantity: 3, price: 39, image: '/images/14.jpg' },
        { name: 'Falco Running Jacket', quantity: 1, price: 129, image: '/images/15.jpg' }
      ],
      total: 246,
      status: 'processing',
      paymentMethod: 'Bank Transfer',
      orderDate: '2024-01-13',
      shippingDate: null,
      deliveryDate: null,
      trackingNumber: null,
      notes: 'Bulk order discount applied'
    },
    {
      id: 'ORD-2024-004',
      customer: {
        name: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '+1 (555) 321-0987',
        address: '321 Elm St, Miami, FL 33101'
      },
      items: [
        { name: 'WING P Soccer Cleats', quantity: 1, price: 279, image: '/images/16.jpg' }
      ],
      total: 279,
      status: 'pending',
      paymentMethod: 'Credit Card',
      orderDate: '2024-01-12',
      shippingDate: null,
      deliveryDate: null,
      trackingNumber: null,
      notes: 'Customer requested size exchange'
    },
    {
      id: 'ORD-2024-005',
      customer: {
        name: 'David Rodriguez',
        email: 'david.r@email.com',
        phone: '+1 (555) 654-3210',
        address: '654 Maple Dr, Seattle, WA 98101'
      },
      items: [
        { name: 'WING P Pro', quantity: 1, price: 299, image: '/images/11.jpg' },
        { name: 'Falco Training Tee', quantity: 2, price: 49, image: '/images/13.jpg' },
        { name: 'Falco Compression Shorts', quantity: 1, price: 39, image: '/images/14.jpg' }
      ],
      total: 436,
      status: 'cancelled',
      paymentMethod: 'Credit Card',
      orderDate: '2024-01-11',
      shippingDate: null,
      deliveryDate: null,
      trackingNumber: null,
      notes: 'Customer cancelled due to shipping delay'
    }
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const statusIcons = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    completed: CheckCircle,
    cancelled: XCircle
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const statusCounts = getStatusCounts()
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage customer orders and track fulfillment</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.completed || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="px-4 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.status as keyof typeof statusIcons]
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.items.length} item(s)</div>
                      <div className="text-sm text-gray-500">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} total
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-falco-accent hover:text-falco-gold transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Order Details - {selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedOrder.customer.email}
                    </p>
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedOrder.customer.phone}
                    </p>
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-1" />
                      {selectedOrder.customer.address}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    {selectedOrder.shippingDate && (
                      <p><span className="font-medium">Shipping Date:</span> {new Date(selectedOrder.shippingDate).toLocaleDateString()}</p>
                    )}
                    {selectedOrder.deliveryDate && (
                      <p><span className="font-medium">Delivery Date:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                    )}
                    {selectedOrder.trackingNumber && (
                      <p><span className="font-medium">Tracking:</span> {selectedOrder.trackingNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.price}</p>
                        <p className="text-gray-600">Total: ${item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-gray-900">${selectedOrder.total}</span>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600"><span className="font-medium">Notes:</span> {selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Print Invoice
                </button>
                <button className="px-4 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold transition-colors">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderManagement
