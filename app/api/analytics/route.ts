import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    let previousStartDate: Date
    let previousEndDate: Date

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        previousEndDate = startDate
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
        previousEndDate = startDate
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000)
        previousEndDate = startDate
        break
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
        previousEndDate = startDate
    }

    // Get current period orders
    const currentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      include: {
        items: true,
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get previous period orders for comparison
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: previousEndDate
        }
      }
    })

    // Get all customers
    const allCustomers = await prisma.customer.findMany({
      include: {
        orders: {
          select: { total: true, createdAt: true }
        }
      }
    })

    // Get customers in current period
    const currentCustomers = allCustomers.filter(
      c => new Date(c.createdAt) >= startDate
    )

    // Get customers in previous period
    const previousCustomers = allCustomers.filter(
      c => new Date(c.createdAt) >= previousStartDate && new Date(c.createdAt) < previousEndDate
    )

    // Calculate overview stats
    const totalRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)
    const revenueGrowth = previousRevenue > 0
      ? ((totalRevenue - previousRevenue) / previousRevenue * 100)
      : totalRevenue > 0 ? 100 : 0

    const totalOrders = currentOrders.length
    const previousOrderCount = previousOrders.length
    const ordersGrowth = previousOrderCount > 0
      ? ((totalOrders - previousOrderCount) / previousOrderCount * 100)
      : totalOrders > 0 ? 100 : 0

    const totalCustomers = allCustomers.length
    const customersGrowth = previousCustomers.length > 0
      ? ((currentCustomers.length - previousCustomers.length) / previousCustomers.length * 100)
      : currentCustomers.length > 0 ? 100 : 0

    // Calculate monthly revenue data (last 6 months)
    const monthlyData: { month: string; revenue: number; orders: number }[] = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthOrders = currentOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= monthDate && orderDate <= monthEnd
      })

      monthlyData.push({
        month: monthNames[monthDate.getMonth()],
        revenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
        orders: monthOrders.length
      })
    }

    // Get top selling products
    const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {}

    currentOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.name,
            sales: 0,
            revenue: 0
          }
        }
        productSales[item.productId].sales += item.quantity
        productSales[item.productId].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(p => ({ ...p, growth: 0 })) // Growth calculation would need previous period data

    // Customer segments
    const newCustomers = allCustomers.filter(c => new Date(c.createdAt) >= startDate)
    const returningCustomers = allCustomers.filter(c => {
      const orderCount = c.orders.length
      return orderCount > 1 && new Date(c.createdAt) < startDate
    })
    const vipCustomers = allCustomers.filter(c => c.status === 'vip')

    const customerSegments = [
      {
        segment: 'New Customers',
        count: newCustomers.length,
        percentage: totalCustomers > 0 ? Math.round((newCustomers.length / totalCustomers) * 100) : 0,
        revenue: newCustomers.reduce((sum, c) => sum + c.orders.reduce((s, o) => s + o.total, 0), 0)
      },
      {
        segment: 'Returning Customers',
        count: returningCustomers.length,
        percentage: totalCustomers > 0 ? Math.round((returningCustomers.length / totalCustomers) * 100) : 0,
        revenue: returningCustomers.reduce((sum, c) => sum + c.orders.reduce((s, o) => s + o.total, 0), 0)
      },
      {
        segment: 'VIP Customers',
        count: vipCustomers.length,
        percentage: totalCustomers > 0 ? Math.round((vipCustomers.length / totalCustomers) * 100) : 0,
        revenue: vipCustomers.reduce((sum, c) => sum + c.orders.reduce((s, o) => s + o.total, 0), 0)
      }
    ]

    // Recent activity from orders
    const recentActivity = currentOrders.slice(0, 5).map(order => ({
      type: 'order',
      message: `New order #${order.orderNumber} from ${order.firstName} ${order.lastName}`,
      time: getTimeAgo(order.createdAt),
      amount: order.total
    }))

    // Add recent customers to activity
    const recentCustomerActivity = currentCustomers.slice(0, 3).map(customer => ({
      type: 'customer',
      message: `New customer ${customer.firstName} ${customer.lastName} registered`,
      time: getTimeAgo(customer.createdAt),
      amount: null
    }))

    // Combine and sort activity by time
    const combinedActivity = [...recentActivity, ...recentCustomerActivity]
      .slice(0, 5)

    // Order status breakdown
    const orderStatuses = {
      pending: currentOrders.filter(o => o.status === 'pending').length,
      processing: currentOrders.filter(o => o.status === 'processing').length,
      shipped: currentOrders.filter(o => o.status === 'shipped').length,
      delivered: currentOrders.filter(o => o.status === 'delivered').length,
      cancelled: currentOrders.filter(o => o.status === 'cancelled').length
    }

    return NextResponse.json({
      overview: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalCustomers,
        conversionRate: 0, // Would need visitor data
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
        customersGrowth: Math.round(customersGrowth * 10) / 10,
        conversionGrowth: 0
      },
      revenueData: monthlyData,
      topProducts,
      customerSegments,
      recentActivity: combinedActivity,
      orderStatuses
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}
