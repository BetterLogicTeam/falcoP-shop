import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'

/** GET — recent `CheckoutAuditLog` rows (admin only). Query: paymentIntentId, outcome, limit (max 500). */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin.ok) return admin.response

  try {
    const { searchParams } = new URL(request.url)
    const paymentIntentId = searchParams.get('paymentIntentId')?.trim()
    const outcome = searchParams.get('outcome')?.trim()
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '100', 10) || 100))

    const logs = await prisma.checkoutAuditLog.findMany({
      where: {
        ...(paymentIntentId
          ? { paymentIntentId: { contains: paymentIntentId, mode: 'insensitive' as const } }
          : {}),
        ...(outcome ? { outcome } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ logs })
  } catch (e) {
    console.error('[admin/checkout-audit]', e)
    return NextResponse.json({ error: 'Failed to load checkout audit' }, { status: 500 })
  }
}
