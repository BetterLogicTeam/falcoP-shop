'use client'

import { useState } from 'react'
import { ShoppingCart, Heart, Eye, Star, Filter, Grid, List } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../contexts/CartContext'
import { useProducts } from '../contexts/ProductContext'
import ProductSelectionModal from './ProductSelectionModal'
import { Product } from '../data/products'
import { formatPrice } from '../lib/currency'

interface ProductCatalogProps {
  category?: 'men' | 'women' | 'kids'
  subcategory?: 'sportswear' | 'shoes'
  type?: string
}

export default function ProductCatalog({ category, subcategory, type }: ProductCatalogProps) {
  const { addToCart } = useCart()
  const { products } = useProducts()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter products based on props
  let filteredProducts = [...products]
  if (category) filteredProducts = filteredProducts.filter(p => p.category === category)
  if (subcategory) filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory)
  if (type) filteredProducts = filteredProducts.filter(p => p.type === type)

  // Apply additional filters
  filteredProducts = filteredProducts.filter(product => {
    const inPriceRange = product.price >= priceRange[0] && product.price <= priceRange[1]
    const hasSelectedColor = selectedColors.length === 0 || product.colors.some(color => selectedColors.includes(color))
    const hasSelectedSize = selectedSizes.length === 0 || product.sizes.some(size => selectedSizes.includes(size))
    return inPriceRange && hasSelectedColor && hasSelectedSize
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      case 'newest': return b.id.localeCompare(a.id)
      default: return 0
    }
  })

  // Get unique colors and sizes for filters
  const allColors = Array.from(new Set(filteredProducts.flatMap(p => p.colors)))
  const allSizes = Array.from(new Set(filteredProducts.flatMap(p => p.sizes)))

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const handleAddToCart = (product: Product) => {
    // Check if product has sizes or colors that need selection
    if (product.sizes.length > 0 || product.colors.length > 0) {
      setSelectedProduct(product)
      setIsModalOpen(true)
    } else {
      // Add directly to cart if no size/color selection needed
      addToCart(product)
    }
  }

  return (
    <section className="section-padding bg-falco-primary">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s ` : ''}
              {type || subcategory || 'Products'}
            </h1>
            <p className="text-gray-400 text-lg">
              {sortedProducts.length} products found
            </p>
          </div>
          
          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-falco-accent text-falco-primary' : 'text-white'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-falco-accent text-falco-primary' : 'text-white'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-falco-accent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Price Range</h4>
                <div className="flex items-center gap-2 text-white">
                  <span>${priceRange[0]}</span>
                  <span>-</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full mt-2 accent-falco-accent"
                />
              </div>

              {/* Colors - Hidden, only White available */}
              {/* {allColors.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                          selectedColors.includes(color)
                            ? 'bg-falco-accent text-falco-primary'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Sizes */}
              {allSizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Sizes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {allSizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`p-2 rounded text-sm transition-all duration-300 ${
                          selectedSizes.includes(size)
                            ? 'bg-falco-accent text-falco-primary'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedColors([])
                  setSelectedSizes([])
                  setPriceRange([0, 200])
                }}
                className="w-full bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-colors duration-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Product Image */}
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'h-64'
                  }`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-falco-accent text-falco-primary px-3 py-1 rounded-full text-xs font-bold">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick Add Button */}
                    <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                      hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-falco-accent transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating - Hidden for launch */}
                    {/* <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-falco-gold fill-current'
                                : 'text-white/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/60 text-sm">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div> */}

                    {/* Colors - Hidden, only White available */}
                    {/* <div className="flex items-center space-x-2 mb-4">
                      <span className="text-white/60 text-sm">Colors:</span>
                      <div className="flex space-x-1">
                        {product.colors.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border-2 border-white/30"
                            style={{ backgroundColor: color.toLowerCase().replace('/', '').split(' ')[0] }}
                            title={color}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-white/60 text-xs">+{product.colors.length - 4}</span>
                        )}
                      </div>
                    </div> */}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      {!product.inStock && (
                        <span className="text-red-400 text-sm font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
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
