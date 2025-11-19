'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface Product {
  id: string
  name: string
  slug: string
  category: 'men' | 'women' | 'kids'
  subcategory: 'sportswear' | 'shoes'
  type: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  reviewCount?: number
  image: string
  images: string[]
  badge?: string
  colors: string[]
  sizes: string[]
  description: string
  features: string[]
  inStock: boolean
}

interface ProductContextType {
  products: Product[]
  isLoading: boolean
  error: string | null
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => Promise<Product>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProduct: (id: string) => Product | undefined
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/products?limit=1000')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      // Map API response to match expected Product interface
      const mappedProducts = data.products.map((p: any) => ({
        ...p,
        reviews: p.reviewCount || p.reviews || 0,
      }))
      setProducts(mappedProducts)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load products from API on mount
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const addProduct = async (productData: Omit<Product, 'id' | 'slug'>): Promise<Product> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add product')
      }

      const newProduct = await response.json()
      const mappedProduct = {
        ...newProduct,
        reviews: newProduct.reviewCount || newProduct.reviews || 0,
      }
      setProducts(prev => [...prev, mappedProduct])
      return mappedProduct
    } catch (err) {
      console.error('Error adding product:', err)
      throw err
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }

      const updatedProduct = await response.json()
      const mappedProduct = {
        ...updatedProduct,
        reviews: updatedProduct.reviewCount || updatedProduct.reviews || 0,
      }
      setProducts(prev => prev.map(product =>
        product.id === id ? mappedProduct : product
      ))
    } catch (err) {
      console.error('Error updating product:', err)
      throw err
    }
  }

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }

      setProducts(prev => prev.filter(product => product.id !== id))
    } catch (err) {
      console.error('Error deleting product:', err)
      throw err
    }
  }

  const getProduct = (id: string): Product | undefined => {
    return products.find(product => product.id === id || product.slug === id)
  }

  const refreshProducts = async (): Promise<void> => {
    await fetchProducts()
  }

  return (
    <ProductContext.Provider value={{
      products,
      isLoading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct,
      refreshProducts
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
