'use client'

import React, { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { Product } from '../data/products'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

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

  const handleAddToCart = () => {
    if (!product) return

    // Validate selections
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size')
      return
    }

    if (product.colors.length > 0 && !selectedColor) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <svg className="w-6 h-6 text-falco-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>Add to Cart</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Image */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-xs font-semibold text-gray-700">Preview</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-3 text-sm leading-relaxed">{product.description}</p>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-falco-accent">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-gray-500 line-through text-lg">
                    ${product.originalPrice}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Size</h4>
                <div className="grid grid-cols-3 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative p-4 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedSize === size
                          ? 'border-falco-accent bg-gradient-to-br from-falco-accent to-falco-gold text-black shadow-lg ring-2 ring-falco-accent/30'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white hover:shadow-md'
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

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Color</h4>
                <div className="grid grid-cols-4 gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative p-4 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedColor === color
                          ? 'border-falco-accent bg-gradient-to-br from-falco-accent to-falco-gold text-black shadow-lg ring-2 ring-falco-accent/30'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 bg-white hover:shadow-md'
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

            {/* Quantity Selection */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h4>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Minus className="w-5 h-5 text-gray-700" />
                </button>
                <div className="bg-gradient-to-br from-falco-accent to-falco-gold text-black px-6 py-3 rounded-xl font-bold text-lg min-w-[60px] text-center shadow-lg">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Plus className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-falco-accent to-falco-gold text-black py-4 rounded-xl font-bold text-lg hover:from-falco-gold hover:to-falco-accent transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
