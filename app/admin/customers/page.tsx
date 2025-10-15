'use client'

import { useState } from 'react'
import { Search, Filter, Eye, User, Mail, Phone, MapPin, Calendar, ShoppingBag, Star, TrendingUp, Users } from 'lucide-react'

const CustomerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  // Impressive dummy customer data
  const customers = [
    {
      id: 'CUST-001',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      joinDate: '2023-08-15',
      status: 'active',
      totalOrders: 12,
      totalSpent: 2847,
      averageOrderValue: 237,
      lastOrderDate: '2024-01-15',
      favoriteCategory: 'Shoes',
      loyaltyPoints: 2847,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      orders: [
        { id: 'ORD-2024-001', date: '2024-01-15', total: 647, status: 'completed' },
        { id: 'ORD-2023-045', date: '2023-12-20', total: 299, status: 'completed' },
        { id: 'ORD-2023-038', date: '2023-11-15', total: 189, status: 'completed' }
      ]
    },
    {
      id: 'CUST-002',
      name: 'Sarah Williams',
      email: 'sarah.w@email.com',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      joinDate: '2023-09-22',
      status: 'active',
      totalOrders: 8,
      totalSpent: 1923,
      averageOrderValue: 240,
      lastOrderDate: '2024-01-14',
      favoriteCategory: 'Sportswear',
      loyaltyPoints: 1923,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      orders: [
        { id: 'ORD-2024-002', date: '2024-01-14', total: 349, status: 'shipped' },
        { id: 'ORD-2023-042', date: '2023-12-10', total: 156, status: 'completed' }
      ]
    },
    {
      id: 'CUST-003',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 456-7890',
      address: '789 Pine St, Chicago, IL 60601',
      joinDate: '2023-10-05',
      status: 'active',
      totalOrders: 15,
      totalSpent: 3421,
      averageOrderValue: 228,
      lastOrderDate: '2024-01-13',
      favoriteCategory: 'Accessories',
      loyaltyPoints: 3421,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      orders: [
        { id: 'ORD-2024-003', date: '2024-01-13', total: 246, status: 'processing' },
        { id: 'ORD-2023-048', date: '2023-12-28', total: 189, status: 'completed' }
      ]
    },
    {
      id: 'CUST-004',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 321-0987',
      address: '321 Elm St, Miami, FL 33101',
      joinDate: '2023-11-18',
      status: 'active',
      totalOrders: 5,
      totalSpent: 1245,
      averageOrderValue: 249,
      lastOrderDate: '2024-01-12',
      favoriteCategory: 'Shoes',
      loyaltyPoints: 1245,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      orders: [
        { id: 'ORD-2024-004', date: '2024-01-12', total: 279, status: 'pending' }
      ]
    },
    {
      id: 'CUST-005',
      name: 'David Rodriguez',
      email: 'david.r@email.com',
      phone: '+1 (555) 654-3210',
      address: '654 Maple Dr, Seattle, WA 98101',
      joinDate: '2023-07-30',
      status: 'inactive',
      totalOrders: 3,
      totalSpent: 892,
      averageOrderValue: 297,
      lastOrderDate: '2023-12-05',
      favoriteCategory: 'Sportswear',
      loyaltyPoints: 892,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      orders: [
        { id: 'ORD-2023-035', date: '2023-12-05', total: 436, status: 'cancelled' }
      ]
    },
    {
      id: 'CUST-006',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 789-0123',
      address: '987 Cedar Ln, Boston, MA 02101',
      joinDate: '2023-12-01',
      status: 'active',
      totalOrders: 7,
      totalSpent: 1687,
      averageOrderValue: 241,
      lastOrderDate: '2024-01-10',
      favoriteCategory: 'Shoes',
      loyaltyPoints: 1687,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      orders: [
        { id: 'ORD-2024-006', date: '2024-01-10', total: 189, status: 'completed' }
      ]
    }
  ]

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    vip: 'bg-purple-100 text-purple-800'
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getCustomerStats = () => {
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.status === 'active').length
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
    const averageOrderValue = customers.reduce((sum, customer) => sum + customer.averageOrderValue, 0) / totalCustomers

    return { totalCustomers, activeCustomers, totalRevenue, averageOrderValue }
  }

  const stats = getCustomerStats()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
        <p className="text-gray-600">Manage customer relationships and track engagement</p>
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
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${Math.round(stats.averageOrderValue)}</p>
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
            <button className="px-4 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Customer Header */}
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[customer.status as keyof typeof statusColors]}`}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">${customer.totalSpent}</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {customer.address.split(',')[0]}...
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {new Date(customer.joinDate).toLocaleDateString()}
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

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Profile */}
              <div className="flex items-center space-x-6">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${statusColors[selectedCustomer.status as keyof typeof statusColors]}`}>
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)} Customer
                  </span>
                </div>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">${selectedCustomer.averageOrderValue}</p>
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
                      <span className="text-gray-700">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 mt-1 text-gray-400" />
                      <span className="text-gray-700">{selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Join Date:</span> {new Date(selectedCustomer.joinDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Last Order:</span> {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</p>
                    <p><span className="font-medium">Favorite Category:</span> {selectedCustomer.favoriteCategory}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h4>
                <div className="space-y-3">
                  {selectedCustomer.orders.map((order: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.total}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Send Email
                </button>
                <button className="px-4 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold transition-colors">
                  Edit Customer
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
