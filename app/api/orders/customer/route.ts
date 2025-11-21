import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        email: session.user.email
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('=== FETCHED ORDERS DEBUG ===')
    console.log('Total orders:', orders.length)
    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, order.orderNumber, '- Items:', order.items.length)
      console.log('Items:', JSON.stringify(order.items, null, 2))
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
