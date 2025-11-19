'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Product } from '../data/products'
import toast from 'react-hot-toast'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number; size?: string; color?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity = 1, size, color } = action.payload
      const existingItemIndex = state.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
      )

      let newItems: CartItem[]
      
      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${size || 'default'}-${color || 'default'}`,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        }
        newItems = [...state.items, newItem]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload.id)
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: { id } })
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      }

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      }

    case 'LOAD_CART': {
      const items = action.payload
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

      return {
        ...state,
        items,
        totalItems,
        totalPrice,
      }
    }

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('falco-cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('falco-cart', JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity, size, color } })
    toast.success(`${product.name} added to cart!`, {
      id: `cart-add-${product.id}`,
      duration: 2000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } })
    toast.success('Item removed from cart', {
      id: `cart-remove-${id}`,
      duration: 2000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared', {
      id: 'cart-clear',
      duration: 2000,
      style: {
        background: '#10B981',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
      },
    })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
