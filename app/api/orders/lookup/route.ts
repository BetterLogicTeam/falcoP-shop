import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Public guest lookup: order number + email must match (same pattern as Amazon, Shopify guest emails, etc.).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')?.trim()
    const email = searchParams.get('email')?.trim().toLowerCase()

    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'Order number and email are required' }, { status: 400 })
    }

    const row = await prisma.order.findFirst({
      where: {
        orderNumber,
        email: { equals: email, mode: 'insensitive' },
      },
      include: { items: true },
    })

    if (!row) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = {
      id: row.id,
      orderNumber: row.orderNumber,
      email: row.email,
      status: row.status,
      total: row.total,
      subtotal: row.subtotal,
      shippingCost: row.shippingCost,
      tax: row.tax,
      trackingNumber: row.trackingNumber,
      createdAt: row.createdAt.toISOString(),
      items: row.items.map((i) => ({
        id: i.id,
        productName: i.name,
        productImage: i.image || '',
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
      })),
      shippingAddress: {
        firstName: row.firstName,
        lastName: row.lastName,
        address: row.shippingLine1 || '',
        city: row.shippingCity || '',
        state: row.shippingState || '',
        zipCode: row.shippingPostal || '',
        country: row.shippingCountry || '',
      },
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Order lookup error:', error)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}
