'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, Package, Loader2, RefreshCw, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatPrice } from '../../lib/currency'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  subcategory: string
  type: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  description?: string
  colors?: string[]
  sizes?: string[]
  badge?: string
  rating?: number
  reviewCount?: number
  inStock: boolean
  stockQuantity?: number
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const categories = ['all', 'men', 'women', 'kids']

  // Fetch products from API
  useEffect(() => {
    fetchProducts(true)
  }, [])

  const fetchProducts = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true)
      else setIsRefreshing(true)

      const response = await fetch('/api/products?limit=1000')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.products || [])
      setFilteredProducts(data.products || [])

      if (!showLoader) {
        toast.success('Products refreshed!')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Filter products
  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, products])

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      setIsDeleting(productId)
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete product')
      }

      // Remove from local state
      setProducts(prev => prev.filter(p => p.id !== productId))

      toast.success('Product deleted successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    } finally {
      setIsDeleting(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchProducts(false)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/admin/products/new"
              className="flex items-center space-x-2 bg-falco-accent text-black px-4 py-2 rounded-lg hover:bg-falco-gold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            >
              <option value="all">All Categories</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                        <img
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder-product.jpg'
                          }}
                        />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-[120px] sm:max-w-none truncate">
                          {product.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {product.type}
                        </div>
                        {/* Show category on mobile */}
                        <div className="md:hidden text-xs text-gray-400 capitalize">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                    <div className="text-sm text-gray-500 capitalize">{product.subcategory}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(product.price)}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice ?? 0)}
                      </div>
                    )}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Product"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="text-falco-accent hover:text-falco-gold"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting === product.id}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        title="Delete Product"
                      >
                        {isDeleting === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first product.'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <div className="mt-6">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-falco-accent hover:bg-falco-gold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/images/placeholder-product.jpg'
                    }}
                  />
                  {selectedProduct.badge && (
                    <span className="inline-block mt-2 px-3 py-1 bg-falco-accent text-black text-sm font-medium rounded-full">
                      {selectedProduct.badge}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-500">{selectedProduct.type}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-green-600">{formatPrice(selectedProduct.price)}</span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-lg text-gray-400 line-through">{formatPrice(selectedProduct.originalPrice)}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <span className="ml-2 text-gray-900 capitalize">{selectedProduct.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Subcategory:</span>
                      <span className="ml-2 text-gray-900 capitalize">{selectedProduct.subcategory}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Stock:</span>
                      <span className={`ml-2 ${selectedProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Rating:</span>
                      <span className="ml-2 text-gray-900">{selectedProduct.rating || 0} ({selectedProduct.reviewCount || 0} reviews)</span>
                    </div>
                  </div>

                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600 text-sm">Colors:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedProduct.colors.map((color, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600 text-sm">Sizes:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedProduct.sizes.map((size, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <Link
                  href={`/admin/products/edit/${selectedProduct.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-falco-accent text-black py-2 rounded-lg hover:bg-falco-gold transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Product
                </Link>
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    handleDelete(selectedProduct.id)
                  }}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement
