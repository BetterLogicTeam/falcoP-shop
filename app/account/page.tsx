'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Package, Heart, MapPin, LogOut, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!session) {
    router.push('/auth/login')
    return null
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-falco-accent rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.user?.name}</h1>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link
            href="/account/orders"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-600">View order history and track shipments</p>
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Wishlist</h3>
              <p className="text-sm text-gray-600">Items you've saved for later</p>
            </div>
          </Link>

          <Link
            href="/account/addresses"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Addresses</h3>
              <p className="text-sm text-gray-600">Manage your shipping addresses</p>
            </div>
          </Link>

          <button
            onClick={handleSignOut}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center space-x-4 w-full text-left"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sign Out</h3>
              <p className="text-sm text-gray-600">Log out of your account</p>
            </div>
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No orders yet</p>
            <Link
              href="/shop"
              className="text-falco-accent hover:underline mt-2 inline-block"
            >
              Start shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
