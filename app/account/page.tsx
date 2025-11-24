'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Package, Heart, MapPin, LogOut, Loader2, Settings, ChevronRight, RefreshCw, ShoppingBag, Clock, CheckCircle, Truck } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  items: { id: string; name: string; image: string; quantity: number }[]
}

interface AccountStats {
  ordersCount: number
  wishlistCount: number
  addressesCount: number
  recentOrders: Order[]
}

const statusConfig: Record<string, { color: string; icon: any; bgColor: string }> = {
  pending: { color: 'text-yellow-600', icon: Clock, bgColor: 'bg-yellow-100' },
  processing: { color: 'text-blue-600', icon: Package, bgColor: 'bg-blue-100' },
  shipped: { color: 'text-purple-600', icon: Truck, bgColor: 'bg-purple-100' },
  delivered: { color: 'text-green-600', icon: CheckCircle, bgColor: 'bg-green-100' },
  cancelled: { color: 'text-red-600', icon: Package, bgColor: 'bg-red-100' }
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [stats, setStats] = useState<AccountStats>({
    ordersCount: 0,
    wishlistCount: 0,
    addressesCount: 0,
    recentOrders: []
  })

  const fetchAccountData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      // Fetch all data in parallel
      const [ordersRes, wishlistRes, addressesRes] = await Promise.all([
        fetch('/api/orders/customer'),
        fetch('/api/wishlist'),
        fetch('/api/addresses')
      ])

      const ordersData = await ordersRes.json()
      const wishlistData = await wishlistRes.json()
      const addressesData = await addressesRes.json()

      setStats({
        ordersCount: ordersData.orders?.length || 0,
        wishlistCount: wishlistData.wishlist?.length || 0,
        addressesCount: addressesData.addresses?.length || 0,
        recentOrders: (ordersData.orders || []).slice(0, 3)
      })

      if (!showLoader) {
        toast.success('Account refreshed!')
      }
    } catch (error) {
      console.error('Error fetching account data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAccountData(true)
    }
  }, [status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-falco-accent mx-auto" />
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut({ redirect: false })
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Failed to sign out')
      setSigningOut(false)
    }
  }

  const quickLinks = [
    {
      href: '/account/orders',
      icon: Package,
      title: 'My Orders',
      description: 'Track orders & view history',
      count: stats.ordersCount,
      color: 'blue'
    },
    {
      href: '/account/wishlist',
      icon: Heart,
      title: 'Wishlist',
      description: 'Saved items for later',
      count: stats.wishlistCount,
      color: 'red'
    },
    {
      href: '/account/addresses',
      icon: MapPin,
      title: 'Addresses',
      description: 'Manage shipping addresses',
      count: stats.addressesCount,
      color: 'green'
    }
  ]

  const colorClasses: Record<string, { bg: string; icon: string }> = {
    blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
    red: { bg: 'bg-red-100', icon: 'text-red-600' },
    green: { bg: 'bg-green-100', icon: 'text-green-600' }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 sm:pt-16 sm:pb-12 mt-8 sm:mt-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-falco-accent rounded-full flex items-center justify-center flex-shrink-0">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Welcome back!</h1>
                <p className="text-lg sm:text-xl font-medium text-falco-accent">{session.user?.name}</p>
                <p className="text-gray-400 text-sm sm:text-base">{session.user?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchAccountData(false)}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                {signingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? '-' : stats.ordersCount}</p>
            <p className="text-xs sm:text-sm text-gray-600">Orders</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? '-' : stats.wishlistCount}</p>
            <p className="text-xs sm:text-sm text-gray-600">Wishlist</p>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? '-' : stats.addressesCount}</p>
            <p className="text-xs sm:text-sm text-gray-600">Addresses</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-xl shadow-sm p-5 sm:p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 border border-transparent hover:border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${colorClasses[link.color].bg} rounded-xl flex items-center justify-center`}>
                    <link.icon className={`w-6 h-6 ${colorClasses[link.color].icon}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-500">{link.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {link.count > 0 && (
                    <span className="bg-gray-100 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {link.count}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-600">Your latest purchases</p>
            </div>
            <Link
              href="/account/orders"
              className="text-sm text-falco-accent hover:underline flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            </div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-falco-accent text-black font-semibold rounded-lg hover:bg-falco-gold transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {stats.recentOrders.map((order) => {
                const statusInfo = statusConfig[order.status] || statusConfig.pending
                const StatusIcon = statusInfo.icon

                return (
                  <Link
                    key={order.id}
                    href="/account/orders"
                    className="p-4 sm:p-6 hover:bg-gray-50 transition-colors block"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Order Images */}
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <img
                              key={item.id}
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                              style={{ zIndex: 3 - index }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = '/images/placeholder-product.jpg'
                              }}
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                            {' '}&middot;{' '}
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.bgColor}`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                          <span className={`text-sm font-medium capitalize ${statusInfo.color}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        <ChevronRight className="w-5 h-5 text-gray-400 hidden sm:block" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-falco-accent text-black font-semibold rounded-lg hover:bg-falco-gold transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {signingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            Sign Out
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
