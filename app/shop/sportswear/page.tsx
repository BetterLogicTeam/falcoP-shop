'use client'

import React from 'react'
import Link from 'next/link'
import { useProducts } from '../../../contexts/ProductContext'
import { ArrowLeft, Users, Star, ShoppingBag, Shirt } from 'lucide-react'
import { formatPrice } from '@/lib/currency'

export default function SportswearPage() {
  const { products, isLoading } = useProducts()

  const sportswearProducts = products.filter(p => p.subcategory === 'sportswear')
  const menCount = sportswearProducts.filter(p => p.category === 'men').length
  const womenCount = sportswearProducts.filter(p => p.category === 'women').length
  const kidsCount = sportswearProducts.filter(p => p.category === 'kids').length

  const categories = [
    { name: 'Men', slug: 'men', count: menCount, color: 'from-blue-600 to-blue-800' },
    { name: 'Women', slug: 'women', count: womenCount, color: 'from-pink-600 to-purple-800' },
    { name: 'Kids', slug: 'kids', count: kidsCount, color: 'from-green-600 to-teal-800' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
          <div className="flex items-center space-x-4">
            <Shirt className="w-12 h-12 text-falco-accent" />
            <div>
              <h1 className="text-4xl font-bold text-white">Sportswear</h1>
              <p className="text-gray-400">{sportswearProducts.length} Products</p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/sportswear/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-falco-accent transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className="relative p-8 text-center">
                <Users className="w-16 h-16 text-falco-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                <p className="text-gray-400">{cat.count} Products</p>
              </div>
            </Link>
          ))}
        </div>

        {/* All Sportswear Products */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-falco-accent border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : sportswearProducts.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Sportswear</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sportswearProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/sportswear/${product.category}/${product.id}`}
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
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-300 text-sm">{product.rating}</span>
                      </div>
                      <div className="text-falco-accent font-bold">{formatPrice(product.price)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700">
            <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Sportswear Yet</h3>
            <p className="text-gray-400">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
