import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/addresses - Get all addresses for logged in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: {
          orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' }
          ]
        }
      }
    })

    if (!customer) {
      return NextResponse.json({ addresses: [] })
    }

    return NextResponse.json({ addresses: customer.addresses })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST /api/addresses - Create a new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    })

    if (!customer) {
      // Create customer from session
      customer = await prisma.customer.create({
        data: {
          email: session.user.email,
          firstName: session.user.name?.split(' ')[0] || 'Customer',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        }
      })
    }

    // If this is the first address or marked as default, update other addresses
    const existingAddresses = await prisma.address.count({
      where: { customerId: customer.id }
    })

    const isDefault = body.isDefault || existingAddresses === 0

    if (isDefault) {
      // Remove default from other addresses
      await prisma.address.updateMany({
        where: { customerId: customer.id },
        data: { isDefault: false }
      })
    }

    // Create address
    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
        firstName: body.firstName,
        lastName: body.lastName,
        company: body.company || null,
        address1: body.address1,
        address2: body.address2 || null,
        city: body.city,
        state: body.state || null,
        postalCode: body.postalCode,
        country: body.country,
        phone: body.phone || null,
        isDefault
      }
    })

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}
