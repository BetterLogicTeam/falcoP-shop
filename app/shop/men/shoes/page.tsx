'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useClientTranslation } from '../../../../hooks/useClientTranslation'
import { products } from '../../../../data/products'
import { ArrowLeft, Filter, Grid, List, Star, ShoppingBag, Star as StarIcon } from 'lucide-react'

const MenShoesPage = () => {
  const { t } = useClientTranslation()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 500])

  // Filter products for men shoes
  const menShoesProducts = products.filter(p => p.category === 'men' && p.subcategory === 'shoes')

  // Get unique types for this subcategory
  const productTypes = Array.from(new Set(menShoesProducts.map(p => p.type)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/shop/men" 
              className="flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('common.back', 'Back to Men')}</span>
            </Link>
            <div className="flex items-center space-x-2 text-falco-accent font-bold text-xl">
              <StarIcon className="w-6 h-6" />
              <span>{t('shop.shoes', 'Shoes')}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-800/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <StarIcon className="w-16 h-16 text-falco-accent drop-shadow-lg" />
                <div className="absolute -inset-4 bg-falco-accent/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              <span className="gradient-text">{t('shop.shoes', 'Shoes')}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('shop.men_shoes_desc', 'Premium footwear for every activity. From running to training, built for performance and durability.')}
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-falco-accent" />
                <span>{menShoesProducts.length}+ {t('shop.products', 'Products')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="w-5 h-5 text-falco-accent" />
                <span>{t('shop.premium_quality', 'Premium Quality')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Types */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Shop by Type</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Find the perfect shoes for your activity</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productTypes.map((type) => {
            const typeProducts = menShoesProducts.filter(p => p.type === type)
            return (
              <Link
                key={type}
                href={`/shop/men/shoes/${type.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-falco-accent transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-falco-accent/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative p-6 text-center">
                  <div className="relative mb-4">
                    <ShoppingBag className="w-12 h-12 text-falco-accent mx-auto group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -inset-2 bg-falco-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-falco-accent transition-colors duration-300">{type}</h3>
                  <p className="text-gray-400 text-sm mb-4">{typeProducts.length} products</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-falco-accent to-transparent w-32"></div>
            <Star className="w-8 h-8 text-falco-accent mx-4" />
            <div className="h-px bg-gradient-to-r from-transparent via-falco-accent to-transparent w-32"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Shoes</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Our most popular men's shoes</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {menShoesProducts.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/shop/men/shoes/${product.type.toLowerCase().replace(/\s+/g, '-')}/${product.id}`}
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
      </div>
    </div>
  )
}

export default MenShoesPage
