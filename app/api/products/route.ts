import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/products - List all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query parameters
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const inStock = searchParams.get('inStock')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (subcategory) {
      where.subcategory = subcategory
    }

    if (type) {
      where.type = {
        contains: type,
        mode: 'insensitive',
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (inStock !== null && inStock !== undefined) {
      where.inStock = inStock === 'true'
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'category', 'subcategory', 'type', 'price', 'description']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate slug
    let slug = generateSlug(body.name)

    // Check for duplicate slug and append number if needed
    let slugExists = await prisma.product.findUnique({ where: { slug } })
    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(body.name)}-${counter}`
      slugExists = await prisma.product.findUnique({ where: { slug } })
      counter++
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        category: body.category,
        subcategory: body.subcategory,
        type: body.type,
        price: parseFloat(body.price),
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        rating: body.rating ? parseFloat(body.rating) : 0,
        reviewCount: body.reviews || 0,
        image: body.image || '/images/products/placeholder.jpg',
        images: body.images || [],
        badge: body.badge || null,
        colors: body.colors || [],
        sizes: body.sizes || [],
        description: body.description,
        features: body.features || [],
        inStock: body.inStock !== false,
        stockQuantity: body.stockQuantity || 0,
        sku: body.sku || null,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
