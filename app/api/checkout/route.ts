import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getShippingCostBySubtotal } from '@/lib/currency'
import { calculateCouponDiscount } from '@/lib/coupons'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerInfo,
      items,
      totalAmount,
      paymentIntentId,
      customerId,
      couponCode
    } = body

    // Get logged-in user session
    const session = await getServerSession(authOptions)

    // If user is logged in, use their account email for order tracking
    // The checkout form email is used for shipping/notifications
    const orderEmail = session?.user?.email || customerInfo.email

    // Get customer ID if logged in
    let resolvedCustomerId = customerId || null
    if (session?.user?.email && !resolvedCustomerId) {
      const customer = await prisma.customer.findUnique({
        where: { email: session.user.email }
      })
      if (customer) {
        resolvedCustomerId = customer.id
      }
    }

    console.log('=== API CHECKOUT DEBUG ===')
    console.log('Session email:', session?.user?.email)
    console.log('Order linked to email:', orderEmail)
    console.log('Received items count:', items?.length)

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
    let couponId: string | null = null
    let discount = 0

    if (couponCode) {
      const normalizedCode = String(couponCode).trim().toUpperCase()
      const coupon = await prisma.coupon.findUnique({ where: { code: normalizedCode } })

      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 })
      }

      const now = new Date()
      if (coupon.startDate && now < coupon.startDate) {
        return NextResponse.json({ error: 'Coupon is not active yet' }, { status: 400 })
      }
      if (coupon.endDate && now > coupon.endDate) {
        return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 })
      }
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
      }
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        return NextResponse.json({ error: 'Order does not meet coupon minimum amount' }, { status: 400 })
      }

      const customerUsage = await prisma.order.count({
        where: {
          email: orderEmail,
          couponId: coupon.id,
        },
      })
      if (customerUsage >= coupon.usagePerCustomer) {
        return NextResponse.json({ error: 'Coupon already used maximum times by this customer' }, { status: 400 })
      }

      discount = calculateCouponDiscount(coupon, subtotal)
      couponId = coupon.id
    }

    const shippingCost = getShippingCostBySubtotal(subtotal)
    const tax = 0
    const total = Math.max(0, subtotal + shippingCost + tax - discount)

    // Create order with items
    // Link order to logged-in user's email so it shows in their orders page
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: resolvedCustomerId,
          email: orderEmail,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          phone: customerInfo.phone || null,
          status: 'pending',
          paymentStatus: paymentIntentId ? 'paid' : 'pending',
          paymentIntentId: paymentIntentId || null,
          subtotal,
          shippingCost,
          tax,
          discount,
          couponId,
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

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        })
      }

      return createdOrder
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
