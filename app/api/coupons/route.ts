import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'

// GET /api/coupons - List coupons with influencer stats (admin only)
export async function GET() {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const coupons = await prisma.coupon.findMany({
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            discount: true,
            createdAt: true,
            paymentStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const result = coupons.map((coupon) => {
      const paidOrders = coupon.orders.filter((o) => o.paymentStatus === 'paid')
      const totalSales = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
      const totalDiscountGiven = paidOrders.reduce((sum, o) => sum + (o.discount || 0), 0)
      const safeCode = coupon.code?.trim() || `LEGACY-${coupon.id.slice(-6).toUpperCase()}`

      return {
        ...coupon,
        code: safeCode,
        stats: {
          totalOrders: paidOrders.length,
          totalSales,
          totalDiscountGiven,
        },
      }
    })

    return NextResponse.json({ coupons: result })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 })
  }
}

// POST /api/coupons - Create coupon (admin only)
export async function POST(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const body = await request.json()
    const code = String(body.code || '').trim().toUpperCase()
    const discountType = String(body.discountType || '').toLowerCase()
    const discountValue = Number(body.discountValue || 0)

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
    }

    // Keep codes clean for checkout UX and tracking
    const validCodePattern = /^(?=.*[A-Z0-9])[A-Z0-9_-]{3,30}$/
    if (!validCodePattern.test(code)) {
      return NextResponse.json(
        { error: 'Code must be 3-30 chars and use A-Z, 0-9, - or _' },
        { status: 400 }
      )
    }

    if (!['percentage', 'fixed'].includes(discountType)) {
      return NextResponse.json({ error: 'discountType must be percentage or fixed' }, { status: 400 })
    }

    if (discountValue <= 0) {
      return NextResponse.json({ error: 'discountValue must be greater than 0' }, { status: 400 })
    }

    const existing = await prisma.coupon.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description: body.description || null,
        discountType,
        discountValue,
        minOrderAmount: body.minOrderAmount ? Number(body.minOrderAmount) : null,
        maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : null,
        usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
        usagePerCustomer: body.usagePerCustomer ? Number(body.usagePerCustomer) : 1,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isActive: body.isActive !== false,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}

