'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useClientTranslation } from '../../../hooks/useClientTranslation'
import { products } from '../../../data/products'
import { ArrowLeft, Filter, Grid, List, Star, ShoppingBag, Baby } from 'lucide-react'
import CartButton from '../../../components/CartButton'
import { formatPrice } from '@/lib/currency'

const KidsCategoryPage = () => {
  const { t } = useClientTranslation()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 500])

  // Filter products for kids
  const kidsProducts = products.filter(p => p.category === 'kids')
  const sportswearProducts = kidsProducts.filter(p => p.subcategory === 'sportswear')
  const shoesProducts = kidsProducts.filter(p => p.subcategory === 'shoes')

  const subcategories = [
    {
      name: t('shop.sportswear', 'Sportswear'),
      slug: 'sportswear',
      count: sportswearProducts.length,
      description: t('shop.kids_sportswear_desc', 'Fun and functional gear for active kids'),
      products: sportswearProducts
    },
    {
      name: t('shop.shoes', 'Shoes'),
      slug: 'shoes',
      count: shoesProducts.length,
      description: t('shop.kids_shoes_desc', 'Comfortable and durable footwear for growing feet'),
      products: shoesProducts
    }
  ]

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-falco-accent font-bold text-xl">
                <Baby className="w-6 h-6" />
                <span>{t('shop.kids', 'Kids')}</span>
              </div>
              <CartButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-teal-800/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Baby className="w-16 h-16 text-falco-accent drop-shadow-lg" />
                <div className="absolute -inset-4 bg-falco-accent/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              <span className="gradient-text">{t('shop.kids', 'Kids')}</span> {t('nav.shop', 'Shop')}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('shop.kids_hero', 'Fun and functional gear designed for active kids. From playtime essentials to sports equipment, built for growing champions.')}
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-falco-accent" />
                <span>{kidsProducts.length}+ {t('shop.products', 'Products')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="w-5 h-5 text-falco-accent" />
                <span>{t('shop.premium_quality', 'Premium Quality')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.slug}
              href={`/shop/kids/${subcategory.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-falco-accent transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-falco-accent/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-teal-800 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <ShoppingBag className="w-12 h-12 text-falco-accent group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -inset-2 bg-falco-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-white group-hover:text-falco-accent transition-colors duration-300">{subcategory.count}</span>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Products</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-falco-accent transition-colors duration-300">{subcategory.name}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{subcategory.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-falco-accent font-semibold group-hover:text-white transition-colors duration-300">
                    <span>Shop {subcategory.name}</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-falco-accent/20 rounded-full flex items-center justify-center group-hover:bg-falco-accent group-hover:scale-110 transition-all duration-300">
                    <svg className="w-4 h-4 text-falco-accent group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Kids' Products</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Our most popular kids' items, trusted by parents and loved by children</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kidsProducts.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/shop/kids/${product.subcategory}/${product.type.toLowerCase().replace(/\s+/g, '-')}/${product.id}`}
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
                    <div className="text-falco-accent font-bold group-hover:text-white transition-colors duration-300">{formatPrice(product.price)}</div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-gray-500 text-sm line-through">{formatPrice(product.originalPrice)}</div>
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

export default KidsCategoryPage
