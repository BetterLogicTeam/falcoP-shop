'use client'

import React from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../contexts/CartContext'
import { useClientTranslation } from '../hooks/useClientTranslation'

export default function CartDrawer() {
  const { state, removeFromCart, updateQuantity, clearCart, closeCart } = useCart()
  const { t } = useClientTranslation()

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {t('cart.title', 'Shopping Cart')} ({state.totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {t('cart.empty', 'Your cart is empty')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t('cart.empty_description', 'Add some items to get started')}
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="bg-falco-accent text-black px-6 py-3 rounded-full font-semibold hover:bg-falco-gold transition-colors duration-300"
                >
                  {t('cart.start_shopping', 'Start Shopping')}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${item.product.price}
                      </p>
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">
                          Size: {item.selectedSize}
                        </p>
                      )}
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">
                          Color: {item.selectedColor}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                {t('cart.clear_cart', 'Clear Cart')}
              </button>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  {t('cart.total', 'Total')}:
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ${state.totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-gradient-to-r from-falco-accent to-falco-gold text-black py-4 rounded-xl font-bold text-center hover:from-falco-gold hover:to-falco-accent transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-lg">{t('cart.checkout', 'Proceed to Checkout')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
