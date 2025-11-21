import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerInfo,
      items,
      totalAmount,
      paymentIntentId,
      customerId
    } = body

    console.log('=== API CHECKOUT DEBUG ===')
    console.log('Received items count:', items?.length)
    console.log('Received items:', JSON.stringify(items, null, 2))

    // Validate required fields
    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `FP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)
    const shippingCost = 0 // Free shipping
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shippingCost + tax

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customerId || null,
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone || null,
        status: 'pending',
        paymentStatus: paymentIntentId ? 'paid' : 'pending',
        paymentIntentId: paymentIntentId || null,
        subtotal,
        shippingCost,
        tax,
        total,
        // Shipping address fields
        shippingLine1: customerInfo.address,
        shippingCity: customerInfo.city,
        shippingState: customerInfo.state,
        shippingPostal: customerInfo.zipCode,
        shippingCountry: customerInfo.country || 'US',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null
          }))
        }
      },
      include: {
        items: true
      }
    })

    console.log('Order created with', order.items.length, 'items')
    console.log('Order items:', JSON.stringify(order.items, null, 2))

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
