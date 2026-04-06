import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { buildFraktjaktTrackingUrl } from '@/lib/fraktjakt'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email!.toLowerCase()
    const userId = (session.user as { id?: string }).id

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { email: { equals: userEmail, mode: 'insensitive' } },
          ...(userId ? [{ customerId: userId }] : []),
        ],
      },
      include: {
        items: true,
        coupon: {
          select: {
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const normalized = orders.map((order) => ({
      ...order,
      trackingUrl: buildFraktjaktTrackingUrl(order.trackingNumber),
    }))

    return NextResponse.json({ orders: normalized })
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
