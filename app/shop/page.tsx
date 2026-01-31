'use client'

import React from 'react'
import Link from 'next/link'
import { useClientTranslation } from '../../hooks/useClientTranslation'
import { useProducts } from '../../contexts/ProductContext'
import { ShoppingBag, Users, Star, TrendingUp, ArrowLeft, Footprints, Shirt } from 'lucide-react'
import { formatPrice } from '@/lib/currency'

const ShopMainPage = () => {
  const { t } = useClientTranslation()
  const { products } = useProducts()

  // Get category statistics
  const shoesProducts = products.filter(p => p.subcategory === 'shoes').length
  const sportswearProducts = products.filter(p => p.subcategory === 'sportswear').length
  const totalProducts = products.length

  const featuredProducts = products.filter(p =>
    p.badge && ['Best Seller', 'Popular', 'Pro Choice', 'Elite Collection'].includes(p.badge)
  ).slice(0, 8)

  // Main categories: Shoes and Sportswear
  const mainCategories = [
    {
      name: 'Shoes',
      slug: 'shoes',
      icon: Footprints,
      count: shoesProducts,
      description: 'Premium athletic footwear for every sport and lifestyle',
      color: 'from-blue-600 to-indigo-800',
      subcategories: [
        { name: 'Men', slug: 'men' },
        { name: 'Women', slug: 'women' },
        { name: 'Kids', slug: 'kids' },
      ]
    },
    {
      name: 'Sportswear',
      slug: 'sportswear',
      icon: Shirt,
      count: sportswearProducts,
      description: 'High-performance apparel for training and everyday wear',
      color: 'from-purple-600 to-pink-800',
      subcategories: [
        { name: 'Men', slug: 'men' },
        { name: 'Women', slug: 'women' },
        { name: 'Kids', slug: 'kids' },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Back to home quick link under shop nav */}
      <div className="pt-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">{t('common.back_to_home', 'Back to Home')}</span>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-falco-accent/5 via-transparent to-blue-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <ShoppingBag className="w-16 h-16 text-falco-accent drop-shadow-lg" />
                <div className="absolute -inset-4 bg-falco-accent/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              <span className="gradient-text">FALCO PEAK</span> {t('nav.shop', 'Shop')}
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('shop.hero', 'Discover our complete collection of premium athletic wear and footwear. From high-performance gear to everyday essentials, engineered for champions.')}
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-falco-accent" />
                <span>{totalProducts}+ {t('shop.products', 'Products')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="w-5 h-5 text-falco-accent" />
                <span>{t('shop.premium_quality', 'Premium Quality')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Category Cards: Shoes & Sportswear */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {mainCategories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.slug}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-falco-accent transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Icon className="w-12 h-12 text-falco-accent" />
                        <div className="absolute -inset-2 bg-falco-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                        <p className="text-gray-400 text-sm">{category.count} Products</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6">{category.description}</p>

                  {/* Subcategory Links: Men, Women, Kids */}
                  <div className="grid grid-cols-3 gap-4">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/shop/${category.slug}/${sub.slug}`}
                        className="group/sub bg-white/5 hover:bg-falco-accent/20 border border-gray-700 hover:border-falco-accent rounded-xl p-4 text-center transition-all duration-300 hover:scale-105"
                      >
                        <Users className="w-8 h-8 text-falco-accent mx-auto mb-2 group-hover/sub:scale-110 transition-transform" />
                        <span className="text-white font-semibold group-hover/sub:text-falco-accent transition-colors">
                          {sub.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-falco-accent to-transparent w-32"></div>
              <Star className="w-8 h-8 text-falco-accent mx-4" />
              <div className="h-px bg-gradient-to-r from-transparent via-falco-accent to-transparent w-32"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Our most popular and highly-rated items, trusted by athletes worldwide</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.subcategory}/${product.category}/${product.id}`}
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
      )}

      {/* Empty State if no products */}
      {totalProducts === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
          <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700">
            <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Products Yet</h3>
            <p className="text-gray-400">Check back soon for our new collection!</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopMainPage
