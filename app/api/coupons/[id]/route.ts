import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PUT /api/coupons/[id] - Update coupon fields (admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.discountType && { discountType: String(body.discountType).toLowerCase() }),
        ...(body.discountValue !== undefined && { discountValue: Number(body.discountValue) }),
        ...(body.minOrderAmount !== undefined && { minOrderAmount: body.minOrderAmount ? Number(body.minOrderAmount) : null }),
        ...(body.maxDiscount !== undefined && { maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : null }),
        ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit ? Number(body.usageLimit) : null }),
        ...(body.usagePerCustomer !== undefined && { usagePerCustomer: Number(body.usagePerCustomer) }),
        ...(body.startDate !== undefined && { startDate: body.startDate ? new Date(body.startDate) : null }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    })

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Error updating coupon:', error)
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 })
  }
}

// DELETE /api/coupons/[id] - Remove coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.coupon.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    }

    if (existing._count.orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete coupon with existing orders. Set it inactive instead.' },
        { status: 400 }
      )
    }

    await prisma.coupon.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting coupon:', error)
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}

