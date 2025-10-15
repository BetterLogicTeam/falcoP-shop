'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useClientTranslation } from '../../hooks/useClientTranslation'
import { useProducts } from '../../contexts/ProductContext'
import { ShoppingBag, Users, Baby, Star, TrendingUp, ArrowLeft } from 'lucide-react'

const ShopMainPage = () => {
  const { t } = useClientTranslation()
  const { products } = useProducts()
  const [activeCategory, setActiveCategory] = useState('all')

  // Get category statistics
  const menProducts = products.filter(p => p.category === 'men').length
  const womenProducts = products.filter(p => p.category === 'women').length
  const kidsProducts = products.filter(p => p.category === 'kids').length
  const totalProducts = products.length

  const featuredProducts = products.filter(p => 
    p.badge && ['Best Seller', 'Popular', 'Pro Choice', 'Elite Collection'].includes(p.badge)
  ).slice(0, 8)

  const categories = [
    {
      name: t('footer.men', 'Men'),
      slug: 'men',
      icon: Users,
      count: menProducts,
      description: t('shop.men_desc', 'High-performance gear for the modern athlete'),
      color: 'from-blue-600 to-blue-800',
      subcategories: [
        { name: t('shop.sportswear', 'Sportswear'), count: products.filter(p => p.category === 'men' && p.subcategory === 'sportswear').length },
        { name: t('shop.shoes', 'Shoes'), count: products.filter(p => p.category === 'men' && p.subcategory === 'shoes').length }
      ]
    },
    {
      name: t('shop.women', 'Women'),
      slug: 'women',
      icon: Star,
      count: womenProducts,
      description: t('shop.women_desc', 'Empowering athletic wear for strong women'),
      color: 'from-pink-600 to-purple-800',
      subcategories: [
        { name: t('shop.sportswear', 'Sportswear'), count: products.filter(p => p.category === 'women' && p.subcategory === 'sportswear').length },
        { name: t('shop.shoes', 'Shoes'), count: products.filter(p => p.category === 'women' && p.subcategory === 'shoes').length }
      ]
    },
    {
      name: t('shop.kids', 'Kids'),
      slug: 'kids',
      icon: Baby,
      count: kidsProducts,
      description: t('shop.kids_desc', 'Fun and functional gear for active kids'),
      color: 'from-green-600 to-teal-800',
      subcategories: [
        { name: t('shop.sportswear', 'Sportswear'), count: products.filter(p => p.category === 'kids' && p.subcategory === 'sportswear').length },
        { name: t('shop.shoes', 'Shoes'), count: products.filter(p => p.category === 'kids' && p.subcategory === 'shoes').length }
      ]
    }
  ]

  // Additional quick-entry cards reflecting new top-level menus
  const quickMenus = [
    {
      name: t('shop.new_in', 'New In'),
      href: '/shop/new',
      icon: Star,
      description: t('shop.new_in_desc', 'Latest drops and recent arrivals'),
      color: 'from-yellow-500 to-orange-700',
    },
    {
      name: t('shop.sportswear', 'Sportswear'),
      href: '/shop/sportswear',
      icon: ShoppingBag,
      description: t('shop.sportswear_desc', 'Everyday performance apparel'),
      color: 'from-fuchsia-600 to-rose-700',
    },
    {
      name: t('shop.sport', 'Sport'),
      href: '/shop/sport',
      icon: ShoppingBag,
      description: t('shop.sport_desc', 'Shop by sport and activity'),
      color: 'from-teal-600 to-emerald-700',
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
              <span className="gradient-text">FALCO P</span> {t('nav.shop', 'Shop')}
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

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-falco-accent transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-falco-accent/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <Icon className="w-12 h-12 text-falco-accent group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute -inset-2 bg-falco-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-white group-hover:text-falco-accent transition-colors duration-300">{category.count}</span>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Products</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-falco-accent transition-colors duration-300">{category.name}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{category.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {category.subcategories.map((sub) => (
                      <div key={sub.name} className="flex justify-between items-center text-sm bg-white/5 rounded-lg px-3 py-2 backdrop-blur-sm">
                        <span className="text-gray-300 font-medium">{sub.name}</span>
                        <span className="text-falco-accent font-bold">{sub.count} items</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-falco-accent font-semibold group-hover:text-white transition-colors duration-300">
                      <span>Shop {category.name}</span>
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
            )
          })}
        </div>
        {/* Quick Menus reflecting main navigation */}
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quickMenus.map((q) => {
            const QIcon = q.icon
            return (
              <Link
                key={q.href}
                href={q.href}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-falco-accent transition-all duration-500 hover:shadow-2xl hover:shadow-falco-accent/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${q.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="relative p-6 flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1 group-hover:text-falco-accent transition-colors duration-300">{q.name}</h4>
                    <p className="text-gray-300 text-sm">{q.description}</p>
                  </div>
                  <div className="relative">
                    <QIcon className="w-8 h-8 text-falco-accent group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -inset-2 bg-falco-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">Our most popular and highly-rated items, trusted by athletes worldwide</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.category}/${product.subcategory}/${product.type.toLowerCase().replace(/\s+/g, '-')}/${product.id}`}
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

export default ShopMainPage
