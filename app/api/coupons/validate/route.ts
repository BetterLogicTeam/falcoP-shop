import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { calculateCouponDiscount } from '@/lib/coupons'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const code = String(body.code || '').trim().toUpperCase()
    const subtotal = Number(body.subtotal || 0)
    const customerEmail = body.customerEmail ? String(body.customerEmail).toLowerCase() : null

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } })
    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 400 })
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
      return NextResponse.json(
        { error: `Minimum order amount is ${coupon.minOrderAmount}` },
        { status: 400 }
      )
    }

    if (customerEmail && coupon.usagePerCustomer > 0) {
      const customerUsage = await prisma.order.count({
        where: {
          email: customerEmail,
          couponId: coupon.id,
        },
      })

      if (customerUsage >= coupon.usagePerCustomer) {
        return NextResponse.json({ error: 'Coupon usage limit reached for this customer' }, { status: 400 })
      }
    }

    const discountAmount = calculateCouponDiscount(coupon, subtotal)

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}

