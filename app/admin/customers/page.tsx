'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Eye, User, Mail, Phone, MapPin, Calendar, ShoppingBag, Star, TrendingUp, Users, Loader2, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/currency'

interface OrderSummary {
  id: string
  total: number
  status: string
  createdAt: string
}

interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  avatar: string | null
  status: string
  loyaltyPoints: number
  createdAt: string
  updatedAt: string
  orders: OrderSummary[]
  addresses: Array<{
    address1: string
    city: string
    state: string | null
    country: string
  }>
  totalSpent: number
  orderCount: number
  reviewCount: number
}

interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  totalRevenue: number
  averageOrderValue: number
}

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  })

  const fetchCustomers = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    else setRefreshing(true)

    try {
      const params = new URLSearchParams()
      params.append('limit', '100')

      const response = await fetch(`/api/customers?${params.toString()}`)
      const data = await response.json()

      if (data.customers) {
        setAllCustomers(data.customers)

        // Calculate stats from all customers
        const totalCustomers = data.pagination?.total || data.customers.length
        const activeCustomers = data.customers.filter((c: Customer) => c.status === 'active').length
        const totalRevenue = data.customers.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0)
        const avgOrderValue = data.customers.length > 0
          ? data.customers.reduce((sum: number, c: Customer) => {
              const avg = c.orderCount > 0 ? c.totalSpent / c.orderCount : 0
              return sum + avg
            }, 0) / data.customers.filter((c: Customer) => c.orderCount > 0).length || 0
          : 0

        setStats({
          totalCustomers,
          activeCustomers,
          totalRevenue,
          averageOrderValue: avgOrderValue
        })
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filter customers locally based on search and status
  useEffect(() => {
    let filtered = [...allCustomers]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    // Filter by search term
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase()
      filtered = filtered.filter(c =>
        c.firstName.toLowerCase().includes(searchLower) ||
        c.lastName.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        (c.phone && c.phone.includes(debouncedSearch))
      )
    }

    setCustomers(filtered)
  }, [allCustomers, statusFilter, debouncedSearch])

  useEffect(() => {
    fetchCustomers(true)

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchCustomers(false)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    vip: 'bg-purple-100 text-purple-800'
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCustomerName = (customer: Customer) => {
    return `${customer.firstName} ${customer.lastName}`
  }

  const getCustomerAddress = (customer: Customer) => {
    if (customer.addresses && customer.addresses.length > 0) {
      const addr = customer.addresses[0]
      return `${addr.address1}, ${addr.city}`
    }
    return 'No address'
  }

  const getLastOrderDate = (customer: Customer) => {
    if (customer.orders && customer.orders.length > 0) {
      return new Date(customer.orders[0].createdAt).toLocaleDateString()
    }
    return 'No orders'
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-falco-accent mx-auto mb-4" />
          <p className="text-gray-600">Loading customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage customer relationships and track engagement</p>
        </div>
        <button
          onClick={() => fetchCustomers(false)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(Math.round(stats.averageOrderValue))}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-purple-600" />
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
                placeholder="Search customers by name, email, or phone..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="vip">VIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      {customers.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Customers Found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Customers will appear here when they register or place orders'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Customer Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-falco-accent flex items-center justify-center text-black font-bold text-lg">
                    {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{getCustomerName(customer)}</h3>
                    <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[customer.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>

                {/* Customer Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{customer.orderCount}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{formatPrice(customer.totalSpent)}</p>
                    <p className="text-xs text-gray-500">Total Spent</p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-2 mb-4">
                  {customer.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {getCustomerAddress(customer)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2" />
                    {customer.loyaltyPoints} points
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="w-full bg-falco-accent text-black py-2 rounded-lg hover:bg-falco-gold transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Profile */}
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-falco-accent flex items-center justify-center text-black font-bold text-2xl">
                  {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{getCustomerName(selectedCustomer)}</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${statusColors[selectedCustomer.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)} Customer
                  </span>
                </div>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.orderCount}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{formatPrice(selectedCustomer.totalSpent)}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedCustomer.orderCount > 0 ? formatPrice(selectedCustomer.totalSpent / selectedCustomer.orderCount) : '0.00'}
                  </p>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedCustomer.loyaltyPoints}</p>
                  <p className="text-sm text-gray-600">Loyalty Points</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-700">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-700">{selectedCustomer.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                      <span className="text-gray-700">{getCustomerAddress(selectedCustomer)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Customer ID:</span> {selectedCustomer.id.slice(0, 8)}...</p>
                    <p><span className="font-medium">Join Date:</span> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Last Updated:</span> {new Date(selectedCustomer.updatedAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Reviews:</span> {selectedCustomer.reviewCount}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h4>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{order.id.slice(0, 12)}...</p>
                          <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(order.total)}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No orders yet</p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerManagement
