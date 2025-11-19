import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}${random}`
}

// GET /api/orders - List all orders with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query parameters
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const customerId = searchParams.get('customerId')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    // Get total count
    const total = await prisma.order.count({ where })

    // Get orders with items
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      )
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must have at least one item' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        image: product.image,
      })
    }

    const shippingCost = body.shippingCost || 0
    const tax = body.tax || 0
    const discount = body.discount || 0
    const total = subtotal + shippingCost + tax - discount

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: body.customerId || null,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || null,
        shippingLine1: body.shippingLine1 || null,
        shippingLine2: body.shippingLine2 || null,
        shippingCity: body.shippingCity || null,
        shippingState: body.shippingState || null,
        shippingPostal: body.shippingPostal || null,
        shippingCountry: body.shippingCountry || null,
        status: 'pending',
        paymentStatus: body.paymentStatus || 'pending',
        paymentMethod: body.paymentMethod || null,
        paymentIntentId: body.paymentIntentId || null,
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        shippingMethod: body.shippingMethod || null,
        trackingNumber: body.trackingNumber || null,
        estimatedDelivery: body.estimatedDelivery
          ? new Date(body.estimatedDelivery)
          : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        customerNotes: body.customerNotes || null,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    })

    // Update product stock (optional)
    if (body.updateStock) {
      for (const item of body.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        })
      }
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
