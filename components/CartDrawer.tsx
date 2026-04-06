'use client'

import React from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../contexts/CartContext'
import { useClientTranslation } from '../hooks/useClientTranslation'
import { formatPrice } from '../lib/currency'

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
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeCart}
          aria-hidden
        />
      )}

      <div
        className={`fixed top-0 right-0 z-50 flex h-full h-dvh max-h-dvh w-full max-w-[min(100vw,22rem)] sm:max-w-md flex-col border-l-2 border-gray-200 bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-in-out ${
          state.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title', 'Shopping Cart')}
      >
        <div className="flex min-h-0 flex-1 flex-col pt-[max(0px,env(safe-area-inset-top,0px))]">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
              {t('cart.title', 'Shopping Cart')}{' '}
              <span className="font-semibold text-gray-600">({state.totalItems})</span>
            </h2>
            <button
              type="button"
              onClick={closeCart}
              className="shrink-0 rounded-full border border-transparent p-2 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 active:scale-95"
              aria-label={t('cart.close', 'Close cart')}
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
            {state.items.length === 0 ? (
              <div className="flex h-full min-h-[12rem] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 text-center">
                <ShoppingBag className="mb-4 h-14 w-14 text-gray-300 sm:h-16 sm:w-16" />
                <h3 className="mb-2 text-base font-semibold text-gray-700 sm:text-lg">
                  {t('cart.empty', 'Your cart is empty')}
                </h3>
                <p className="mb-6 max-w-xs text-sm text-gray-500">
                  {t('cart.empty_description', 'Add some items to get started')}
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="rounded-full border-2 border-gray-900 bg-falco-accent px-6 py-3 text-sm font-semibold text-black shadow-md transition-all duration-300 hover:bg-falco-gold active:scale-[0.98] sm:text-base"
                >
                  {t('cart.start_shopping', 'Start Shopping')}
                </Link>
              </div>
            ) : (
              <ul className="space-y-3 sm:space-y-4">
                {state.items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50/90 p-3 shadow-sm transition-colors hover:border-gray-300 sm:p-4"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-gray-200 bg-white sm:h-20 sm:w-20">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                              {item.product.name}
                            </h3>
                            <p className="mt-0.5 text-sm font-medium text-gray-800">
                              {formatPrice(item.product.price)}
                            </p>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600">
                              {item.selectedSize && (
                                <span>
                                  {t('cart.size', 'Size')}: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span>
                                  {t('cart.color', 'Color')}: {item.selectedColor}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="shrink-0 rounded-full border border-red-100 p-2 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
                            aria-label={t('cart.remove_item', 'Remove item')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/80 pt-3">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                              className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-700 transition-colors hover:border-falco-accent/70 active:scale-95"
                              aria-label={t('cart.decrease_qty', 'Decrease quantity')}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-700 transition-colors hover:border-falco-accent/70 active:scale-95"
                              aria-label={t('cart.increase_qty', 'Increase quantity')}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 tabular-nums">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="shrink-0 space-y-4 border-t-2 border-gray-100 bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:py-5">
              <button
                type="button"
                onClick={clearCart}
                className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50/50 hover:text-red-600"
              >
                {t('cart.clear_cart', 'Clear Cart')}
              </button>

              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-gray-50/80 px-4 py-3 sm:px-5">
                <span className="text-base font-semibold text-gray-900 sm:text-lg">
                  {t('cart.total', 'Total')}:
                </span>
                <span className="text-lg font-bold tabular-nums text-gray-900 sm:text-xl">
                  {formatPrice(state.totalPrice)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex w-full flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-gray-900 bg-gradient-to-r from-falco-accent to-falco-gold px-3 py-3.5 text-center text-base font-bold text-black shadow-lg ring-1 ring-inset ring-white/40 transition-all duration-300 hover:border-black hover:from-falco-gold hover:to-falco-accent hover:shadow-xl active:scale-[0.99] sm:gap-3 sm:py-4 sm:text-lg sm:hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                <span>{t('cart.checkout', 'Proceed to Checkout')}</span>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
