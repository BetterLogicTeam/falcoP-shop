'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react'
import { useClientTranslation } from '../../../hooks/useClientTranslation'
import { products } from '../../../data/products'
import CartButton from '../../../components/CartButton'

const SportPage = () => {
  const { t } = useClientTranslation()
  
  // Get sport-related products
  const sportProducts = products.filter(p => 
    p.name.toLowerCase().includes('sport') ||
    p.subcategory === 'sportswear'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/shop" 
              className="flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('common.back_to_home', 'Back to Shop')}</span>
            </Link>
            <CartButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-800/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              <span className="gradient-text">Sport</span> Collection
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              Professional-grade athletic gear for serious athletes
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-32"></div>
            <TrendingUp className="w-6 h-6 text-blue-500 mx-4" />
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-32"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Sport Products</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">High-performance gear for champions</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sportProducts.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.category}/${product.subcategory}/${product.type}/${product.id}`}
              className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  SPORT
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-falco-accent font-bold text-lg">${product.price}</span>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-400 text-sm">{product.rating}</span>
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

export default SportPage
