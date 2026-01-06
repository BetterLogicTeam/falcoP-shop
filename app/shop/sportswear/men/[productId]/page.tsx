'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useProducts } from '../../../../../contexts/ProductContext'
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Award } from 'lucide-react'
import { useCart } from '../../../../../contexts/CartContext'
import toast from 'react-hot-toast'
import CartButton from '../../../../../components/CartButton'

const ProductDetailPage = () => {
  const params = useParams()
  const productId = params.productId as string
  const { products, isLoading } = useProducts()
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const product = products.find(p => p.id === productId)

  useEffect(() => {
    if (product) {
      if (product.sizes.length > 0 && !selectedSize) setSelectedSize(product.sizes[0])
      if (product.colors.length > 0 && !selectedColor) setSelectedColor(product.colors[0])
    }
  }, [product, selectedSize, selectedColor])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-falco-accent border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
          <p className="text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/shop/sportswear/men" className="bg-falco-accent text-black px-6 py-3 rounded-full font-bold hover:bg-falco-gold transition-colors duration-300">
            Back to Men's Sportswear
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) { toast.error('Please select a size'); return }
    if (product.colors.length > 0 && !selectedColor) { toast.error('Please select a color'); return }
    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined)
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.subcategory === product.subcategory && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/shop/sportswear/men" className="flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Men's Sportswear</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-falco-accent font-bold text-xl">FALCO P</Link>
              <CartButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden">
                <img src={product.images[activeImageIndex] || product.image} alt={product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg' }} />
              </div>
              {product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button key={index} onClick={() => setActiveImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${activeImageIndex === index ? 'border-falco-accent' : 'border-gray-600'}`}>
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                {product.badge && <span className="inline-block bg-falco-accent text-black px-3 py-1 rounded-full text-sm font-bold mb-4">{product.badge}</span>}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{product.name}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />)}
                    <span className="text-white ml-2">{product.rating}</span>
                  </div>
                  <span className="text-gray-400">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-falco-accent">${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>}
                </div>
              </div>

              <div><h3 className="text-xl font-semibold text-white mb-3">Description</h3><p className="text-gray-300 leading-relaxed">{product.description}</p></div>
              <div><h3 className="text-xl font-semibold text-white mb-3">Features</h3><ul className="space-y-2">{product.features.map((feature, index) => <li key={index} className="flex items-center space-x-3 text-gray-300"><div className="w-2 h-2 bg-falco-accent rounded-full"></div><span>{feature}</span></li>)}</ul></div>

              {product.sizes.length > 0 && (
                <div><h3 className="text-lg font-semibold text-white mb-3">Size</h3><div className="flex flex-wrap gap-3">{product.sizes.map((size) => <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg border transition-colors duration-300 ${selectedSize === size ? 'border-falco-accent bg-falco-accent text-black' : 'border-gray-600 text-white hover:border-falco-accent'}`}>{size}</button>)}</div></div>
              )}
              {product.colors.length > 0 && (
                <div><h3 className="text-lg font-semibold text-white mb-3">Color</h3><div className="flex flex-wrap gap-3">{product.colors.map((color) => <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg border transition-colors duration-300 ${selectedColor === color ? 'border-falco-accent bg-falco-accent text-black' : 'border-gray-600 text-white hover:border-falco-accent'}`}>{color}</button>)}</div></div>
              )}

              <div><h3 className="text-lg font-semibold text-white mb-3">Quantity</h3><div className="flex items-center space-x-4"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-600 text-white hover:border-falco-accent transition-colors duration-300 flex items-center justify-center">-</button><span className="text-white font-semibold text-lg w-8 text-center">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-gray-600 text-white hover:border-falco-accent transition-colors duration-300 flex items-center justify-center">+</button></div></div>

              <div className="flex space-x-4">
                <button onClick={handleAddToCart} className="flex-1 bg-falco-accent text-black px-6 py-4 rounded-full font-bold hover:bg-falco-gold transition-colors duration-300 flex items-center justify-center space-x-2"><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></button>
                <button className="p-4 border border-gray-600 text-white rounded-full hover:border-falco-accent hover:text-falco-accent transition-colors duration-300"><Heart className="w-5 h-5" /></button>
                <button className="p-4 border border-gray-600 text-white rounded-full hover:border-falco-accent hover:text-falco-accent transition-colors duration-300"><Share2 className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-800">
                <div className="flex items-center space-x-3"><Truck className="w-6 h-6 text-falco-accent" /><div><p className="text-white font-semibold">Free Shipping</p><p className="text-gray-400 text-sm">On orders over $1900</p></div></div>
                <div className="flex items-center space-x-3"><Shield className="w-6 h-6 text-falco-accent" /><div><p className="text-white font-semibold">Warranty</p><p className="text-gray-400 text-sm">1 year guarantee</p></div></div>
                <div className="flex items-center space-x-3"><RotateCcw className="w-6 h-6 text-falco-accent" /><div><p className="text-white font-semibold">Easy Returns</p><p className="text-gray-400 text-sm">14 day return policy</p></div></div>
                <div className="flex items-center space-x-3"><Award className="w-6 h-6 text-falco-accent" /><div><p className="text-white font-semibold">Premium Quality</p><p className="text-gray-400 text-sm">Certified materials</p></div></div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/shop/${relatedProduct.subcategory}/${relatedProduct.category}/${relatedProduct.id}`} className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-falco-accent transition-all duration-500 overflow-hidden hover:scale-105">
                    <div className="aspect-square bg-gray-700 relative overflow-hidden">
                      <img src={relatedProduct.image} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder-product.jpg' }} />
                      {relatedProduct.badge && <div className="absolute top-3 left-3 bg-falco-accent text-black px-3 py-1 rounded-full text-xs font-bold">{relatedProduct.badge}</div>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-falco-accent transition-colors">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-gray-300 text-sm">{relatedProduct.rating}</span></div>
                        <div className="text-falco-accent font-bold">${relatedProduct.price}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
