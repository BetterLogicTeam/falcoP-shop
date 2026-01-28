'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Eye, Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useClientTranslation } from '../hooks/useClientTranslation'
import { useCart } from '../contexts/CartContext'
import { useProducts } from '../contexts/ProductContext'
import ProductSelectionModal from './ProductSelectionModal'
import { Product } from '../data/products'

export default function Products() {
  const { t } = useClientTranslation()
  const { addToCart } = useCart()
  const { products } = useProducts()
  const { data: session } = useSession()
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())
  const [togglingWishlist, setTogglingWishlist] = useState<string | null>(null)

  // Fetch wishlist on mount
  useEffect(() => {
    if (session) {
      fetchWishlist()
    }
  }, [session])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist')
      if (response.ok) {
        const data = await response.json()
        const productIds = new Set<string>(data.wishlist.map((item: { productId: string }) => item.productId))
        setWishlistItems(productIds)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const toggleWishlist = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!session) {
      toast.error('Please sign in to add items to wishlist')
      return
    }

    setTogglingWishlist(product.id)

    try {
      const isInWishlist = wishlistItems.has(product.id)

      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${product.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          const newWishlist = new Set(wishlistItems)
          newWishlist.delete(product.id)
          setWishlistItems(newWishlist)
          toast.success('Removed from wishlist')
        } else {
          toast.error('Failed to remove from wishlist')
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })

        if (response.ok) {
          const newWishlist = new Set(wishlistItems)
          newWishlist.add(product.id)
          setWishlistItems(newWishlist)
          toast.success('Added to wishlist')
        } else {
          const data = await response.json()
          toast.error(data.error || 'Failed to add to wishlist')
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast.error('Something went wrong')
    } finally {
      setTogglingWishlist(null)
    }
  }

  const categories = [
    { id: 'all', label: t('products.all_products', 'All Products') },
    { id: 'shoes', label: t('products.sport_shoes', 'Sport Shoes') },
    { id: 'clothing', label: t('products.sport_clothing', 'Sport Clothing') },
    { id: 'accessories', label: t('products.accessories', 'Accessories') },
  ]

  const handleAddToCart = (product: Product) => {
    // Check if product has sizes or colors that need selection
    if (product.sizes && product.sizes.length > 0 || product.colors && product.colors.length > 0) {
      setSelectedProduct(product)
      setIsModalOpen(true)
    } else {
      // Add directly to cart if no size/color selection needed
      addToCart(product)
    }
  }

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => {
        if (activeCategory === 'shoes') return product.subcategory === 'shoes'
        if (activeCategory === 'clothing') return product.subcategory === 'sportswear'
        return true
      })

  return (
    <section id="products" className="section-padding bg-falco-primary">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
            {t('products.title', 'PREMIUM COLLECTION')}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('products.subtitle', 'Discover our carefully curated selection of high-performance sportswear, designed to elevate your athletic journey with style and precision.')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-6 lg:px-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-0">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="bg-white text-black px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
                    {product.badge}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col space-y-1 sm:space-y-2 transition-all duration-300 opacity-100">
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    disabled={togglingWishlist === product.id}
                    className={`w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 ${
                      wishlistItems.has(product.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlistItems.has(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <Link href={`/shop/${product.slug}`} className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </Link>
                </div>

                {/* Quick Add Button */}
                <div className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 transition-all duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white text-black py-2 sm:py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating - Hidden for launch */}
                {/* <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-falco-gold fill-current'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white/60 text-xs sm:text-sm">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div> */}

                {/* Colors - Hidden, only White available */}
                {/* <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                  <span className="text-white/60 text-xs sm:text-sm">Colors:</span>
                  <div className="flex space-x-1">
                    {product.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white/30"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div> */}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-400 line-through text-sm sm:text-base">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <button className="text-white hover:text-gray-300 transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-6 lg:px-0">
          <Link href="/shop" className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2 mx-auto w-fit">
            <span>{t('products.view_all', 'View All Products')}</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </section>
  )
}
