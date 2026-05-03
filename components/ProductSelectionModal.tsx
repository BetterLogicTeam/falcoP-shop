'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { Product } from '../data/products'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'
import { formatPrice } from '../lib/currency'
import { shoeDisplayColors } from '@/lib/shoeDisplayColors'
import ProductImageGallery from '@/components/ProductImageGallery'
import { productGalleryUrls } from '@/lib/productGalleryUrls'

interface ProductSelectionModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function ProductSelectionModal({ product, isOpen, onClose }: ProductSelectionModalProps) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  const modalColorOptions =
    product && product.subcategory === 'shoes' ? shoeDisplayColors(product.colors) : product?.colors ?? []

  useEffect(() => {
    if (!isOpen || !product) return
    const opts = product.subcategory === 'shoes' ? shoeDisplayColors(product.colors) : product.colors
    if (opts.length > 0) setSelectedColor(opts[0])
  }, [isOpen, product])

  const handleAddToCart = () => {
    if (!product) return

    // Validate selections
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }

    const colorOpts = product.subcategory === 'shoes' ? shoeDisplayColors(product.colors) : product.colors
    if (colorOpts.length > 0 && !selectedColor) {
      toast.error('Please select a color')
      return
    }

    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined)
    onClose()
    
    // Reset form
    setSelectedSize('')
    setSelectedColor('')
    setQuantity(1)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  if (!isOpen || !product) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end justify-center pb-0 sm:items-center sm:pb-4 p-3 sm:p-4 md:p-6">
        <div
          className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full sm:max-w-lg md:max-w-xl max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain shadow-2xl border-2 border-gray-200 ring-1 ring-black/5 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white shrink-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 min-w-0">
              <svg className="w-6 h-6 text-falco-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>Add to Cart</span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 shrink-0 hover:bg-gray-100 rounded-full border border-transparent hover:border-gray-200 transition-all duration-200 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6 pb-8 sm:pb-5 md:pb-6">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-2.5 sm:p-3">
              <ProductImageGallery
                key={product.id}
                urls={productGalleryUrls(product)}
                alt={product.name}
                compact
              />
            </div>

            {/* Product Info */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-3 sm:p-4 rounded-xl border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">{product.description}</p>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-falco-accent">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-500 line-through text-lg">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>
            </div>

            {modalColorOptions.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 sm:p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Color</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {modalColorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`relative p-3 sm:p-4 min-h-[44px] text-sm font-semibold rounded-xl border-2 transition-all duration-300 sm:hover:scale-[1.02] active:scale-[0.98] ${
                        selectedColor === color
                          ? 'border-falco-accent bg-gradient-to-br from-falco-accent to-falco-gold text-black shadow-lg ring-2 ring-falco-accent/30'
                          : 'border-gray-300 text-gray-700 hover:border-falco-accent/60 bg-white hover:shadow-md'
                      }`}
                    >
                      {color}
                      {selectedColor === color && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-falco-accent rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 sm:p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Size</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`relative p-3 sm:p-4 min-h-[44px] text-sm font-semibold rounded-xl border-2 transition-all duration-300 sm:hover:scale-[1.02] active:scale-[0.98] ${
                        selectedSize === size
                          ? 'border-falco-accent bg-gradient-to-br from-falco-accent to-falco-gold text-black shadow-lg ring-2 ring-falco-accent/30'
                          : 'border-gray-300 text-gray-700 hover:border-falco-accent/60 bg-white hover:shadow-md'
                      }`}
                    >
                      {size}
                      {selectedSize === size && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-falco-accent rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 sm:p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h4>
              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] bg-white border-2 border-gray-300 hover:border-falco-accent/70 hover:bg-gray-50 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
                >
                  <Minus className="w-5 h-5 text-gray-700" />
                </button>
                <div className="bg-gradient-to-br from-falco-accent to-falco-gold text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg min-w-[3rem] sm:min-w-[60px] text-center shadow-md border-2 border-gray-900/15">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] bg-white border-2 border-gray-300 hover:border-falco-accent/70 hover:bg-gray-50 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-falco-accent to-falco-gold text-black py-3.5 sm:py-4 px-3 rounded-xl font-bold text-base sm:text-lg border-2 border-gray-900 hover:border-black ring-1 ring-inset ring-white/40 hover:from-falco-gold hover:to-falco-accent transition-all duration-300 flex flex-wrap items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl sm:hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="text-center leading-tight">
                Add to Cart — {formatPrice(product.price * quantity)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen zoom viewer */}
    </>
  )
}
