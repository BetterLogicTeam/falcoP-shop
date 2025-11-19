import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/customers - List all customers with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query parameters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get total count
    const total = await prisma.customer.count({ where })

    // Get customers with order stats
    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        addresses: {
          where: {
            isDefault: true,
          },
          take: 1,
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Calculate total spent for each customer
    const customersWithStats = customers.map((customer) => {
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)
      return {
        ...customer,
        totalSpent,
        orderCount: customer._count.orders,
        reviewCount: customer._count.reviews,
      }
    })

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, firstName, lastName' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: body.email },
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 400 }
      )
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        email: body.email,
        password: body.password || null, // Should be hashed in production
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || null,
        avatar: body.avatar || null,
        status: body.status || 'active',
        loyaltyPoints: body.loyaltyPoints || 0,
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
