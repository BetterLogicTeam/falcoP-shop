'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { useCart } from '@/contexts/CartContext'

interface WishlistProduct {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number | null
  image: string
  category: string
  inStock: boolean
  colors: string[]
  sizes: string[]
}

interface WishlistItem {
  id: string
  productId: string
  customerId: string
  createdAt: string
  product: WishlistProduct
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchWishlist()
    }
  }, [status, router])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.wishlist)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    setRemovingId(productId)
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.productId !== productId))
        toast.success('Removed from wishlist')
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove item')
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = (product: WishlistProduct) => {
    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      image: product.image,
      category: product.category as 'men' | 'women' | 'kids',
      subcategory: 'sportswear' as const,
      type: '',
      inStock: product.inStock,
      colors: product.colors,
      sizes: product.sizes,
      rating: 0,
      reviews: 0,
      reviewCount: 0,
      badge: undefined,
      images: [product.image],
      description: '',
      features: []
    }

    addToCart(cartProduct, 1)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-12 sm:pt-16 mt-8 sm:mt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Heart className="w-8 h-8 mr-3 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding items you love!</p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link href={`/shop/${item.product.slug}`} className="block relative aspect-square">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                  {!item.product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <Link href={`/shop/${item.product.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-falco-accent transition-colors mb-2">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.product.price.toFixed(2)}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      disabled={!item.product.inStock}
                      className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm">Add to Cart</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId)}
                      disabled={removingId === item.productId}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {removingId === item.productId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
