import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { normalizeProductGallery } from '@/lib/normalizeProductGallery'

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/products/[id] - Get a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
      })
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(normalizeProductGallery(product))
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const { id } = await params
    const body = await request.json()

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // If name is being updated, regenerate slug
    let slug = existingProduct.slug
    if (body.name && body.name !== existingProduct.name) {
      slug = generateSlug(body.name)

      // Check for duplicate slug
      const slugExists = await prisma.product.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (slugExists) {
        let counter = 1
        let newSlug = `${slug}-${counter}`
        while (await prisma.product.findFirst({ where: { slug: newSlug, NOT: { id } } })) {
          counter++
          newSlug = `${slug}-${counter}`
        }
        slug = newSlug
      }
    }

    let imageUpdate: { image?: string; images?: string[] } = {}
    if (body.images !== undefined && Array.isArray(body.images)) {
      const trimmed = body.images
        .filter((u: unknown) => typeof u === 'string' && String(u).trim())
        .map((u: string) => u.trim())
        .slice(0, 15)
      const primary =
        typeof body.image === 'string' && body.image.trim()
          ? body.image.trim()
          : trimmed[0] || existingProduct.image
      const seen = new Set<string>()
      const gallery: string[] = []
      for (const u of [primary, ...trimmed]) {
        if (!u || seen.has(u)) continue
        seen.add(u)
        gallery.push(u)
      }
      imageUpdate = { image: gallery[0] || existingProduct.image, images: gallery }
    } else if (body.image !== undefined && typeof body.image === 'string' && body.image.trim()) {
      imageUpdate = { image: body.image.trim() }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name, slug }),
        ...(body.category && { category: body.category }),
        ...(body.subcategory && { subcategory: body.subcategory }),
        ...(body.type && { type: body.type }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.originalPrice !== undefined && {
          originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        }),
        ...(body.rating !== undefined && { rating: parseFloat(body.rating) }),
        ...(body.reviews !== undefined && { reviewCount: body.reviews }),
        ...imageUpdate,
        ...(body.badge !== undefined && { badge: body.badge || null }),
        ...(body.colors && { colors: body.colors }),
        ...(body.sizes && { sizes: body.sizes }),
        ...(body.description && { description: body.description }),
        ...(body.features && { features: body.features }),
        ...(body.inStock !== undefined && { inStock: body.inStock }),
        ...(body.stockQuantity !== undefined && { stockQuantity: body.stockQuantity }),
        ...(body.sku !== undefined && { sku: body.sku || null }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle || null }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription || null }),
      },
    })

    return NextResponse.json(normalizeProductGallery(product))
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const { id } = await params

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product is referenced in any orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id },
    })

    if (orderItemsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete this product because it's referenced in ${orderItemsCount} order(s). You can mark it as out of stock instead.`
        },
        { status: 400 }
      )
    }

    // Check if product is in any wishlists
    const wishlistCount = await prisma.wishlistItem.count({
      where: { productId: id },
    })

    // Delete wishlist items first if any
    if (wishlistCount > 0) {
      await prisma.wishlistItem.deleteMany({
        where: { productId: id },
      })
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
