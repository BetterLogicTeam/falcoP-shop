'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Eye, Star, Calendar, BarChart3, PieChart, Activity } from 'lucide-react'

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d')

  // Impressive dummy analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 45678,
      totalOrders: 1247,
      totalCustomers: 892,
      conversionRate: 3.2,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
      customersGrowth: 15.7,
      conversionGrowth: -0.5
    },
    revenueData: [
      { month: 'Jan', revenue: 12000, orders: 145 },
      { month: 'Feb', revenue: 15000, orders: 178 },
      { month: 'Mar', revenue: 18000, orders: 201 },
      { month: 'Apr', revenue: 22000, orders: 234 },
      { month: 'May', revenue: 25000, orders: 267 },
      { month: 'Jun', revenue: 28000, orders: 298 },
      { month: 'Jul', revenue: 32000, orders: 334 },
      { month: 'Aug', revenue: 35000, orders: 367 },
      { month: 'Sep', revenue: 38000, orders: 401 },
      { month: 'Oct', revenue: 42000, orders: 445 },
      { month: 'Nov', revenue: 45000, orders: 478 },
      { month: 'Dec', revenue: 45678, orders: 1247 }
    ],
    topProducts: [
      { name: 'WING P Pro', sales: 234, revenue: 70032, growth: 15.2 },
      { name: 'Falco Training Tee', sales: 189, revenue: 9261, growth: 8.7 },
      { name: 'WING P Basketball Elite', sales: 156, revenue: 54444, growth: 22.1 },
      { name: 'Falco Compression Shorts', sales: 145, revenue: 5655, growth: 12.3 },
      { name: 'Falco Running Jacket', sales: 123, revenue: 15867, growth: 6.8 }
    ],
    customerSegments: [
      { segment: 'New Customers', count: 234, percentage: 26.2, revenue: 12567 },
      { segment: 'Returning Customers', count: 445, percentage: 49.9, revenue: 28934 },
      { segment: 'VIP Customers', count: 213, percentage: 23.9, revenue: 4177 }
    ],
    trafficSources: [
      { source: 'Direct', visitors: 4567, percentage: 35.2, conversion: 4.1 },
      { source: 'Google Search', visitors: 3234, percentage: 24.9, conversion: 3.8 },
      { source: 'Social Media', visitors: 2890, percentage: 22.3, conversion: 2.9 },
      { source: 'Email Marketing', visitors: 1876, percentage: 14.5, conversion: 5.2 },
      { source: 'Referrals', visitors: 423, percentage: 3.1, conversion: 3.5 }
    ],
    recentActivity: [
      { type: 'order', message: 'New order #ORD-2024-001 from Alex Johnson', time: '2 minutes ago', amount: 647 },
      { type: 'customer', message: 'New customer Sarah Williams registered', time: '15 minutes ago', amount: null },
      { type: 'product', message: 'Product "WING P Pro" stock updated', time: '1 hour ago', amount: null },
      { type: 'order', message: 'Order #ORD-2024-002 shipped to Mike Chen', time: '2 hours ago', amount: 349 },
      { type: 'review', message: '5-star review received for Falco Training Tee', time: '3 hours ago', amount: null }
    ]
  }

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
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const ChartBar = ({ height, label, value }: any) => (
    <div className="flex flex-col items-center">
      <div className="w-full bg-gray-200 rounded-full h-32 flex items-end">
        <div 
          className="bg-falco-accent rounded-t-full w-full transition-all duration-500"
          style={{ height: `${height}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-2">{label}</p>
      <p className="text-xs font-medium text-gray-900">${value.toLocaleString()}</p>
    </div>
  )

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
          value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
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
          title="Conversion Rate"
          value={`${analyticsData.overview.conversionRate}%`}
          growth={analyticsData.overview.conversionGrowth}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-end justify-between h-64 space-x-2">
            {analyticsData.revenueData.slice(-6).map((data, index) => (
              <ChartBar
                key={index}
                height={(data.revenue / Math.max(...analyticsData.revenueData.map(d => d.revenue))) * 100}
                label={data.month}
                value={data.revenue}
              />
            ))}
          </div>
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
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
                  <p className="text-xs text-gray-500">{segment.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products and Traffic Sources */}
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
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-falco-accent rounded-full flex items-center justify-center text-black font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${product.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">+{product.growth}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{source.source}</p>
                    <p className="text-sm text-gray-500">{source.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{source.percentage}%</p>
                    <p className="text-xs text-gray-500">{source.conversion}% conversion</p>
                  </div>
                </div>
              ))}
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
                    <p className="text-sm font-medium text-gray-900">${activity.amount}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
