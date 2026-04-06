import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getShippingCostBySubtotal, sekToOre } from '@/lib/currency'
import { calculateCouponDiscount } from '@/lib/coupons'
import Stripe from 'stripe'

const MAX_LINE_ITEMS = 50
const MAX_LINE_QTY = 99

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) return null
  return new Stripe(key, { apiVersion: '2025-09-30.clover' })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerInfo, items, paymentIntentId, couponCode } = body

    // Get logged-in user session
    const session = await getServerSession(authOptions)

    // If user is logged in, use their account email for order tracking
    const orderEmailRaw = session?.user?.email || customerInfo?.email
    const orderEmail =
      typeof orderEmailRaw === 'string' ? orderEmailRaw.trim().toLowerCase() : ''
    if (!orderEmail || !orderEmail.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }

    // Link order to logged-in account only from session (never trust body.customerId).
    let resolvedCustomerId: string | null = null
    if (session?.user?.email) {
      const customer = await prisma.customer.findUnique({
        where: { email: session.user.email },
      })
      if (customer) resolvedCustomerId = customer.id
    }

    // Validate required fields
    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length > MAX_LINE_ITEMS) {
      return NextResponse.json({ error: 'Invalid cart' }, { status: 400 })
    }

    // Server-side line items: never trust client-sent prices or names for charging / records.
    const resolvedLines: {
      productId: string
      name: string
      image: string
      quantity: number
      price: number
      size: string | null
      color: string | null
    }[] = []

    for (const raw of items) {
      const productId = typeof raw?.productId === 'string' ? raw.productId.trim() : ''
      const qty = Number(raw?.quantity)
      if (!productId || !Number.isFinite(qty) || qty < 1 || qty > MAX_LINE_QTY) {
        return NextResponse.json({ error: 'Invalid cart line item' }, { status: 400 })
      }

      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) {
        return NextResponse.json({ error: 'Invalid product in cart' }, { status: 400 })
      }
      if (!product.inStock) {
        return NextResponse.json(
          { error: `Product not available: ${product.name}` },
          { status: 400 }
        )
      }

      const size = raw?.size != null && String(raw.size).trim() !== '' ? String(raw.size).trim() : null
      const color = raw?.color != null && String(raw.color).trim() !== '' ? String(raw.color).trim() : null

      resolvedLines.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        quantity: qty,
        price: product.price,
        size,
        color,
      })
    }

    const subtotal = resolvedLines.reduce((sum, line) => sum + line.price * line.quantity, 0)

    // Generate order number (cryptographically stronger than Math.random)
    const orderNumber = `FP-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`
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
          email: { equals: orderEmail, mode: 'insensitive' },
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

    // Verify Stripe payment before creating paid orders.
    let resolvedPaymentStatus: 'pending' | 'paid' = 'pending'
    if (paymentIntentId) {
      const stripe = getStripe()
      if (!stripe) {
        return NextResponse.json(
          { error: 'Stripe is not configured (missing STRIPE_SECRET_KEY).' },
          { status: 500 }
        )
      }

      const intent = await stripe.paymentIntents.retrieve(String(paymentIntentId))
      const okStatuses = new Set<Stripe.PaymentIntent.Status>(['succeeded', 'processing', 'requires_capture'])
      if (!okStatuses.has(intent.status)) {
        return NextResponse.json(
          { error: `Payment not completed (status: ${intent.status}). Order not created.` },
          { status: 400 }
        )
      }

      const expectedOre = sekToOre(total)
      if (typeof intent.amount === 'number' && intent.amount !== expectedOre) {
        return NextResponse.json(
          { error: 'Payment amount does not match order total.' },
          { status: 400 }
        )
      }
      const cur = typeof intent.currency === 'string' ? intent.currency.toLowerCase() : ''
      if (cur && cur !== 'sek') {
        return NextResponse.json({ error: 'Invalid payment currency.' }, { status: 400 })
      }

      resolvedPaymentStatus = intent.status === 'succeeded' || intent.status === 'requires_capture' ? 'paid' : 'pending'
    }

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
          paymentStatus: resolvedPaymentStatus,
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
            create: resolvedLines.map((line) => ({
              productId: line.productId,
              name: line.name,
              image: line.image,
              quantity: line.quantity,
              price: line.price,
              size: line.size,
              color: line.color,
            })),
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
