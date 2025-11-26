'use client'

import React from 'react'
import Link from 'next/link'
import { useProducts } from '../../../../contexts/ProductContext'
import { ArrowLeft, Star, ShoppingBag } from 'lucide-react'

export default function KidsSportswearPage() {
  const { products, isLoading } = useProducts()

  const filteredProducts = products.filter(p => p.subcategory === 'sportswear' && p.category === 'kids')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop/sportswear" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sportswear
          </Link>
          <h1 className="text-4xl font-bold text-white">Kids' Sportswear</h1>
          <p className="text-gray-400 mt-2">{filteredProducts.length} Products</p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-falco-accent border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/sportswear/kids/${product.id}`}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-falco-accent transition-all duration-300 overflow-hidden hover:scale-105"
              >
                <div className="aspect-square bg-gray-700 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-product.jpg'
                    }}
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-falco-accent text-black px-3 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-falco-accent transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300 text-sm">{product.rating}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-falco-accent font-bold">${product.price}</div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-gray-500 text-sm line-through">${product.originalPrice}</div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
            <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products Yet</h3>
            <p className="text-gray-400">Check back soon for kids' sportswear!</p>
          </div>
        )}
      </div>
    </div>
  )
}
