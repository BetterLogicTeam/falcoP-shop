'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useClientTranslation } from '../../../../../hooks/useClientTranslation'
import { products } from '../../../../../data/products'
import { ArrowLeft, ShoppingBag, Star, Filter, Grid, List } from 'lucide-react'
import CartButton from '../../../../../components/CartButton'

interface TypePageProps {
  params: {
    category: string
    subcategory: string
    type: string
  }
}

const TypePage = ({ params }: TypePageProps) => {
  const { t } = useClientTranslation()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 500])

  // Decode the type parameter (replace hyphens with spaces and capitalize)
  const decodedType = params.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  
  // Filter products for this specific type
  const typeProducts = products.filter(p => 
    p.category === params.category && 
    p.subcategory === params.subcategory && 
    p.type.toLowerCase().replace(/\s+/g, '-') === params.type
  )

  // If no products found, redirect to subcategory page
  useEffect(() => {
    if (typeProducts.length === 0) {
      router.push(`/shop/${params.category}/${params.subcategory}`)
    }
  }, [typeProducts.length, router, params.category, params.subcategory])

  if (typeProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-falco-accent mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href={`/shop/${params.category}/${params.subcategory}`}
              className="flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to {params.subcategory}</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-falco-accent font-bold text-xl">
                <Star className="w-6 h-6" />
                <span>{decodedType}</span>
              </div>
              <CartButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-falco-accent/5 via-transparent to-falco-accent/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Star className="w-16 h-16 text-falco-accent drop-shadow-lg" />
                <div className="absolute -inset-4 bg-falco-accent/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              <span className="gradient-text">{decodedType}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover our collection of {decodedType.toLowerCase()} for {params.category}
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-falco-accent" />
                <span>{typeProducts.length}+ Products</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="w-5 h-5 text-falco-accent" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {typeProducts.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${params.category}/${params.subcategory}/${params.type}/${product.id}`}
              className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-falco-accent transition-all duration-500 overflow-hidden hover:scale-105 hover:shadow-xl hover:shadow-falco-accent/20"
            >
              <div className="aspect-square bg-gray-700 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder-product.jpg'
                  }}
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-falco-accent text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.badge}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                      {product.reviews} reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-falco-accent transition-colors duration-300">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-300 text-sm">{product.rating}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-falco-accent font-bold group-hover:text-white transition-colors duration-300">${product.price}</div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-gray-500 text-sm line-through">${product.originalPrice}</div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Products Message */}
        {typeProducts.length === 0 && (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
            <p className="text-gray-400 mb-6">We couldn't find any products in this category.</p>
            <Link
              href={`/shop/${params.category}/${params.subcategory}`}
              className="bg-falco-accent text-black px-6 py-3 rounded-full font-bold hover:bg-falco-gold transition-colors duration-300"
            >
              Back to {params.subcategory}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TypePage
