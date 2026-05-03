'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, X, Save, Loader2, ChevronUp, ChevronDown, Star } from 'lucide-react'
import { productGalleryUrls } from '@/lib/productGalleryUrls'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'

const MAX_GALLERY_IMAGES = 12

const ProductEditForm = () => {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string
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

  const [galleryUrls, setGalleryUrls] = useState<string[]>([])
  const [storedColors, setStoredColors] = useState<string[]>([])
  const [storedSizes, setStoredSizes] = useState<string[]>([])
  const [storedFeatures, setStoredFeatures] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

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
    // Fetch product from API
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }
        const product = await response.json()

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
          reviews: (product.reviewCount || product.reviews || 0).toString(),
          stock: product.inStock ? 'In Stock' : 'Out of Stock'
        })
        const urls = productGalleryUrls(product)
        setGalleryUrls(urls)
        setStoredColors(Array.isArray(product.colors) ? product.colors : [])
        setStoredSizes(Array.isArray(product.sizes) ? product.sizes : [])
        setStoredFeatures(Array.isArray(product.features) ? product.features : [])
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product')
        router.push('/admin/products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const uploadOneToCloudinary = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append('file', file)
    const response = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || 'Failed to upload image')
    }
    const result = await response.json()
    return result.url as string
  }

  const handleGalleryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return

    const remaining = MAX_GALLERY_IMAGES - galleryUrls.length
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_GALLERY_IMAGES} images per product`)
      return
    }
    const toUpload = files.slice(0, remaining)
    if (files.length > remaining) {
      toast(`Only the first ${remaining} file(s) were queued (max ${MAX_GALLERY_IMAGES} images).`)
    }

    setIsUploading(true)
    const uploaded: string[] = []
    try {
      for (const file of toUpload) {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`)
          continue
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} must be under 10MB`)
          continue
        }
        uploaded.push(await uploadOneToCloudinary(file))
      }
      if (uploaded.length > 0) {
        setGalleryUrls((prev) => {
          const next = [...prev, ...uploaded].slice(0, MAX_GALLERY_IMAGES)
          setFormData((f) => ({ ...f, image: next[0] || '' }))
          return next
        })
        toast.success(`${uploaded.length} image(s) uploaded`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image(s)')
    } finally {
      setIsUploading(false)
    }
  }

  const removeGalleryAt = (index: number) => {
    setGalleryUrls((prev) => {
      const next = prev.filter((_, i) => i !== index)
      setFormData((f) => ({ ...f, image: next[0] || '' }))
      return next
    })
  }

  const moveGallery = (index: number, direction: -1 | 1) => {
    setGalleryUrls((prev) => {
      const next = [...prev]
      const to = index + direction
      if (to < 0 || to >= next.length) return prev
      ;[next[index], next[to]] = [next[to], next[index]]
      setFormData((f) => ({ ...f, image: next[0] || '' }))
      return next
    })
  }

  const setCoverAt = (index: number) => {
    if (index === 0) return
    setGalleryUrls((prev) => {
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.unshift(item)
      setFormData((f) => ({ ...f, image: next[0] || '' }))
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fallbackImg = '/images/placeholder-product.jpg'
      const imageUrls =
        galleryUrls.length > 0
          ? galleryUrls
          : [formData.image || fallbackImg]

      const updatedProductData = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        description: formData.description,
        image: imageUrls[0] || fallbackImg,
        images: imageUrls,
        badge: formData.badge || undefined,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        inStock: formData.stock === 'In Stock',
        colors: storedColors.length > 0 ? storedColors : ['White'],
        sizes:
          storedSizes.length > 0
            ? storedSizes
            : formData.subcategory === 'shoes'
              ? ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
              : ['S', 'M', 'L'],
        features:
          storedFeatures.length > 0
            ? storedFeatures
            : ['High Quality', 'Comfortable'],
      }

      // Update product via API
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProductData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }

      const updatedProduct = await response.json()
      console.log('Product updated successfully:', updatedProduct)

      // Show success toast
      toast.success('Product updated successfully!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })

      // Redirect to products list after a short delay
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error instanceof Error ? error.message : 'Error updating product. Please try again.', {
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
                placeholder="Enter product description..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Product images</h2>
              <p className="text-sm text-gray-600 mb-4">
                For <strong>existing</strong> products too: tap <strong>Add photos</strong> to upload more angles, reorder or set cover, then <strong>Update Product</strong>. The storefront gallery and zoom show every photo saved here.
              </p>

              {galleryUrls.length > 0 && (
                <ul className="grid grid-cols-2 gap-3 mb-4">
                  {galleryUrls.map((url, index) => (
                    <li
                      key={`${url}-${index}`}
                      className="relative group rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
                    >
                      <img src={url} alt="" className="w-full h-28 object-cover" />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 flex items-center gap-0.5 rounded bg-falco-accent text-black text-[10px] font-bold px-1.5 py-0.5">
                          <Star className="w-3 h-3 fill-current" /> Cover
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-1 bg-black/60 p-1">
                        <div className="flex gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0 || isUploading}
                            onClick={() => moveGallery(index, -1)}
                            className="p-1 rounded bg-white/90 hover:bg-white disabled:opacity-40"
                            aria-label="Move up"
                          >
                            <ChevronUp className="w-4 h-4 text-gray-800" />
                          </button>
                          <button
                            type="button"
                            disabled={index === galleryUrls.length - 1 || isUploading}
                            onClick={() => moveGallery(index, 1)}
                            className="p-1 rounded bg-white/90 hover:bg-white disabled:opacity-40"
                            aria-label="Move down"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-800" />
                          </button>
                        </div>
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setCoverAt(index)}
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-falco-accent/90 hover:bg-falco-accent text-black"
                          >
                            Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeGalleryAt(index)}
                          className="p-1 rounded bg-red-500 text-white hover:bg-red-600"
                          aria-label="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </div>
              )}

              <label
                className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-falco-accent hover:bg-falco-accent/5 ${
                  isUploading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                <span className="mt-2 text-sm font-medium text-gray-900">Add photos</span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB each — max {MAX_GALLERY_IMAGES} images ({galleryUrls.length} / {MAX_GALLERY_IMAGES})
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isUploading || galleryUrls.length >= MAX_GALLERY_IMAGES}
                  onChange={handleGalleryFiles}
                />
              </label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
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
                  disabled={isSubmitting || isUploading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-falco-accent text-black px-4 py-2 rounded-lg hover:bg-falco-gold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Updating...' : isUploading ? 'Uploading...' : 'Update Product'}</span>
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
