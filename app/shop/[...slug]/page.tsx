'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Home, ShoppingBag } from 'lucide-react'

const NotFoundPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to shop after 3 seconds
    const timer = setTimeout(() => {
      router.push('/shop')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        {/* 404 Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-falco-accent/20 to-falco-accent/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-falco-accent" />
          </div>
          <div className="absolute -inset-4 bg-falco-accent/10 rounded-full blur-xl"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved. 
          We're redirecting you to our shop in a few seconds...
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/shop"
            className="group bg-falco-accent text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-falco-gold transition-all duration-300 flex items-center space-x-2 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Go to Shop</span>
          </Link>
          
          <Link
            href="/"
            className="group bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Countdown */}
        <div className="mt-8 text-sm text-gray-500">
          Redirecting automatically in 3 seconds...
        </div>

        {/* Help Text */}
        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">Need Help?</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            If you're looking for a specific product, try browsing our categories or use the search function. 
            You can also contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
