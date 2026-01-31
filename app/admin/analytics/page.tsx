'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Star, BarChart3, PieChart, Activity, Loader2, RefreshCw } from 'lucide-react'
import { formatPrice } from '../../lib/currency'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    conversionRate: number
    revenueGrowth: number
    ordersGrowth: number
    customersGrowth: number
    conversionGrowth: number
  }
  revenueData: Array<{ month: string; revenue: number; orders: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number; growth: number }>
  customerSegments: Array<{ segment: string; count: number; percentage: number; revenue: number }>
  recentActivity: Array<{ type: string; message: string; time: string; amount: number | null }>
  orderStatuses: {
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  }
}

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  const fetchAnalytics = async (showLoader = true) => {
    if (showLoader) setLoading(true)
    else setRefreshing(true)

    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(true)
  }, [timeRange])

  useEffect(() => {
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchAnalytics(false)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ title, value, growth, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? '+' : ''}{growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const ChartBar = ({ height, label, value, isHighest }: any) => (
    <div className="flex flex-col items-center flex-1 group cursor-pointer">
      <div className="relative w-full">
        {/* Tooltip on hover */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {formatPrice(value)}
        </div>
        <div className="w-full bg-gray-100 rounded-lg h-40 flex items-end overflow-hidden">
          <div
            className={`w-full transition-all duration-700 ease-out rounded-t-lg ${
              isHighest
                ? 'bg-gradient-to-t from-green-600 to-green-400'
                : 'bg-gradient-to-t from-blue-600 to-blue-400'
            } group-hover:from-falco-accent group-hover:to-yellow-400`}
            style={{ height: `${Math.max(height, 8)}%` }}
          />
        </div>
      </div>
      <p className="text-xs font-medium text-gray-600 mt-3">{label}</p>
      <p className={`text-sm font-bold ${isHighest ? 'text-green-600' : 'text-gray-900'}`}>
        {formatPrice(value)}
      </p>
    </div>
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-falco-accent mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Failed to load analytics data</p>
        <button
          onClick={() => fetchAnalytics(true)}
          className="mt-4 px-4 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold"
        >
          Retry
        </button>
      </div>
    )
  }

  const maxRevenue = Math.max(...analyticsData.revenueData.map(d => d.revenue), 1)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your business performance and growth</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchAnalytics(false)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatPrice(analyticsData.overview.totalRevenue)}
          growth={analyticsData.overview.revenueGrowth}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={analyticsData.overview.totalOrders.toLocaleString()}
          growth={analyticsData.overview.ordersGrowth}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Customers"
          value={analyticsData.overview.totalCustomers.toLocaleString()}
          growth={analyticsData.overview.customersGrowth}
          icon={Users}
          color="bg-purple-500"
        />
        <StatCard
          title="Avg Order Value"
          value={formatPrice(analyticsData.overview.totalOrders > 0
            ? Math.round(analyticsData.overview.totalRevenue / analyticsData.overview.totalOrders)
            : 0)}
          growth={0}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-500">Last 6 months performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"></div>
                <span className="text-xs text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-600 to-green-400"></div>
                <span className="text-xs text-gray-500">Highest</span>
              </div>
            </div>
          </div>
          {analyticsData.revenueData.length > 0 ? (
            <div className="flex items-end justify-between gap-3 pt-4">
              {analyticsData.revenueData.map((data, index) => (
                <ChartBar
                  key={index}
                  height={(data.revenue / maxRevenue) * 100}
                  label={data.month}
                  value={data.revenue}
                  isHighest={data.revenue === maxRevenue && data.revenue > 0}
                />
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="w-12 h-12 mb-3" />
              <p>No revenue data available</p>
              <p className="text-sm">Place orders to see trends</p>
            </div>
          )}
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          {analyticsData.customerSegments.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900">{segment.segment}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{segment.count} customers</p>
                    <p className="text-xs text-gray-500">{segment.percentage}% | {formatPrice(segment.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500">
              No customer data available
            </div>
          )}
        </div>
      </div>

      {/* Top Products and Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <Star className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {analyticsData.topProducts.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-falco-accent rounded-full flex items-center justify-center text-black font-bold text-sm mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-[180px]">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                No product sales data yet
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              <ShoppingBag className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { label: 'Pending', count: analyticsData.orderStatuses.pending, color: 'bg-orange-500' },
                { label: 'Processing', count: analyticsData.orderStatuses.processing, color: 'bg-yellow-500' },
                { label: 'Shipped', count: analyticsData.orderStatuses.shipped, color: 'bg-blue-500' },
                { label: 'Delivered', count: analyticsData.orderStatuses.delivered, color: 'bg-green-500' },
                { label: 'Cancelled', count: analyticsData.orderStatuses.cancelled, color: 'bg-red-500' }
              ].map((status, index) => {
                const total = analyticsData.overview.totalOrders || 1
                const percentage = (status.count / total) * 100
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{status.label}</span>
                      <span className="text-sm text-gray-900">{status.count} orders</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${status.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="p-6">
          {analyticsData.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      activity.type === 'order' ? 'bg-green-500' :
                      activity.type === 'customer' ? 'bg-blue-500' :
                      activity.type === 'product' ? 'bg-purple-500' :
                      'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatPrice(activity.amount)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
