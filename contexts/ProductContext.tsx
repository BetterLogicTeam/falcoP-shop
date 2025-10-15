'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { products as initialProducts } from '../data/products'

interface Product {
  id: string
  name: string
  type: string
  category: string
  subcategory: string
  price: number
  originalPrice?: number
  description?: string
  image: string
  badge?: string
  rating: number
  reviews: number
  inStock: boolean
}

interface ProductContextType {
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  // Load products from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('falco-products')
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
      } catch (error) {
        console.error('Error loading products from localStorage:', error)
      }
    }
  }, [])

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('falco-products', JSON.stringify(products))
  }, [products])

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ))
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const getProduct = (id: string) => {
    return products.find(product => product.id === id)
  }

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}
