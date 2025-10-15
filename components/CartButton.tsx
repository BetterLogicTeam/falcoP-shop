'use client'

import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

interface CartButtonProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CartButton({ className = '', size = 'md' }: CartButtonProps) {
  const { state, openCart } = useCart()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const badgeSizeClasses = {
    sm: 'w-3 h-3 text-xs',
    md: 'w-4 h-4 text-xs',
    lg: 'w-5 h-5 text-sm'
  }

  return (
    <button 
      onClick={openCart}
      className={`p-2 text-white hover:text-falco-accent transition-colors duration-300 hover:bg-white/10 rounded-full relative ${className}`}
    >
      <ShoppingBag className={sizeClasses[size]} />
      {state.totalItems > 0 && (
        <span className={`absolute -top-1 -right-1 ${badgeSizeClasses[size]} bg-falco-accent text-falco-primary rounded-full flex items-center justify-center font-bold`}>
          {state.totalItems}
        </span>
      )}
    </button>
  )
}
