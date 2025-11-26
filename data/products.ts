export interface Product {
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

// Empty product list - products are now managed via admin panel
export const products: Product[] = []
