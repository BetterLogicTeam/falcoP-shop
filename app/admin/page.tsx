'use client'

import { useState, useEffect } from 'react'
import { Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, User, Loader2, RefreshCw, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  subcategory: string
  type: string
  price: number
  image: string
  inStock: boolean
  createdAt: string
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  customer: {
    firstName: string
    lastName: string
    email: string
  }
}

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
  ordersGrowth: number
  revenueGrowth: number
  customersGrowth: number
}

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    ordersGrowth: 0,
    revenueGrowth: 0,
    customersGrowth: 0
  })
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchDashboardData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      // Fetch all data in parallel
      const [productsRes, ordersRes, customersRes, analyticsRes] = await Promise.all([
        fetch('/api/products?limit=5&sort=createdAt&order=desc'),
        fetch('/api/orders?limit=5'),
        fetch('/api/customers?limit=1'),
        fetch('/api/analytics')
      ])

      const productsData = await productsRes.json()
      const ordersData = await ordersRes.json()
      const customersData = await customersRes.json()
      const analyticsData = await analyticsRes.json()

      // Set recent products
      setRecentProducts(productsData.products || [])

      // Set recent orders
      setRecentOrders(ordersData.orders || [])

      // Set stats from analytics
      setStats({
        totalProducts: productsData.pagination?.total || 0,
        totalOrders: analyticsData.overview?.totalOrders || 0,
        totalCustomers: analyticsData.overview?.totalCustomers || 0,
        totalRevenue: analyticsData.overview?.totalRevenue || 0,
        ordersGrowth: analyticsData.overview?.ordersGrowth || 0,
        revenueGrowth: analyticsData.overview?.revenueGrowth || 0,
        customersGrowth: analyticsData.overview?.customersGrowth || 0
      })

      if (!showLoader) {
        toast.success('Dashboard refreshed!')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData(true)

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboardData(false)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      setIsDeleting(productId)
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      // Remove from local state
      setRecentProducts(prev => prev.filter(p => p.id !== productId))
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }))

      toast.success('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    } finally {
      setIsDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-falco-accent mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchDashboardData(false)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="w-10 h-10 bg-falco-accent rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link href="/admin/products" className="mt-4 flex items-center text-sm text-blue-600 hover:text-blue-800">
            View all products
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              {stats.ordersGrowth !== 0 && (
                <p className={`text-xs flex items-center mt-1 ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.ordersGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(stats.ordersGrowth).toFixed(1)}% from last month
                </p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Link href="/admin/orders" className="mt-4 flex items-center text-sm text-green-600 hover:text-green-800">
            View all orders
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              {stats.customersGrowth !== 0 && (
                <p className={`text-xs flex items-center mt-1 ${stats.customersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.customersGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(stats.customersGrowth).toFixed(1)}% from last month
                </p>
              )}
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <Link href="/admin/customers" className="mt-4 flex items-center text-sm text-purple-600 hover:text-purple-800">
            View all customers
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              {stats.revenueGrowth !== 0 && (
                <p className={`text-xs flex items-center mt-1 ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.revenueGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(stats.revenueGrowth).toFixed(1)}% from last month
                </p>
              )}
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <Link href="/admin/analytics" className="mt-4 flex items-center text-sm text-yellow-600 hover:text-yellow-800">
            View analytics
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center space-x-2 bg-falco-accent text-black px-4 py-2 rounded-lg hover:bg-falco-gold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>View Orders</span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>View Customers</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
              <Link
                href="/admin/products"
                className="text-falco-accent hover:text-falco-gold transition-colors text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {recentProducts.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.image}
                              alt={product.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/images/placeholder-product.jpg'
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="text-falco-accent hover:text-falco-gold"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isDeleting === product.id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            title="Delete"
                          >
                            {isDeleting === product.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No products yet</p>
                <Link href="/admin/products/new" className="text-falco-accent hover:underline text-sm">
                  Add your first product
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-falco-accent hover:text-falco-gold transition-colors text-sm"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No orders yet</p>
                <p className="text-sm text-gray-400">Orders will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
