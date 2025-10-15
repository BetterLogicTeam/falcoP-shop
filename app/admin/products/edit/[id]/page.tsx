'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, X, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProducts } from '../../../../../contexts/ProductContext'
import toast from 'react-hot-toast'

const ProductEditForm = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const { getProduct, updateProduct } = useProducts()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: 'men',
    subcategory: 'sportswear',
    price: '',
    originalPrice: '',
    description: '',
    image: '',
    badge: '',
    rating: '4.5',
    reviews: '0',
    stock: 'In Stock'
  })

  const [imagePreview, setImagePreview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const categories = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' }
  ]

  const subcategories = [
    { value: 'sportswear', label: 'Sportswear' },
    { value: 'shoes', label: 'Shoes' }
  ]

  const badges = [
    { value: '', label: 'No Badge' },
    { value: 'Best Seller', label: 'Best Seller' },
    { value: 'Popular', label: 'Popular' },
    { value: 'Pro Choice', label: 'Pro Choice' },
    { value: 'Elite Collection', label: 'Elite Collection' },
    { value: 'New Arrival', label: 'New Arrival' }
  ]

  useEffect(() => {
    // Find the product to edit using context
    const product = getProduct(params.id)
    if (product) {
      setFormData({
        name: product.name,
        type: product.type,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        description: product.description || '',
        image: product.image,
        badge: product.badge || '',
        rating: product.rating.toString(),
        reviews: product.reviews.toString(),
        stock: product.inStock ? 'In Stock' : 'Out of Stock'
      })
      setImagePreview(product.image)
    }
    setIsLoading(false)
  }, [params.id, getProduct])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({
          ...prev,
          image: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview('')
    setFormData(prev => ({
      ...prev,
      image: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create updated product object
      const updatedProductData = {
        name: formData.name,
        type: formData.type,
        category: formData.category as 'men' | 'women' | 'kids',
        subcategory: formData.subcategory as 'sportswear' | 'shoes',
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        description: formData.description,
        image: formData.image || '/images/placeholder-product.jpg',
        images: [formData.image || '/images/placeholder-product.jpg'],
        badge: formData.badge || undefined,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        inStock: formData.stock === 'In Stock',
        colors: ['Black', 'White'], // Default colors
        sizes: ['S', 'M', 'L'], // Default sizes
        features: ['High Quality', 'Comfortable'] // Default features
      }

      // Update product using context
      updateProduct(params.id, updatedProductData)
      
      console.log('Product updated successfully:', updatedProductData)
      
      // Show success toast
      toast.success('🎉 Product updated successfully!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
        icon: '✅',
      })
      
      // Redirect to products list after a short delay
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('❌ Error updating product. Please try again.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-200 h-64 rounded-lg"></div>
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-200 h-48 rounded-lg"></div>
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/admin/products"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type *
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                    placeholder="e.g., Running Shoes, Hoodie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory *
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                  >
                    {subcategories.map(sub => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                    placeholder="0.00 (for sale prices)"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                placeholder="Enter product description..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Image</h2>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload an image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge
                  </label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                  >
                    {badges.map(badge => (
                      <option key={badge.value} value={badge.value}>
                        {badge.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reviews Count
                  </label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <input
                    type="text"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent"
                    placeholder="e.g., In Stock, Out of Stock"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center space-x-2 bg-falco-accent text-black px-4 py-2 rounded-lg hover:bg-falco-gold transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Updating...' : 'Update Product'}</span>
                </button>
                <Link
                  href="/admin/products"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductEditForm
