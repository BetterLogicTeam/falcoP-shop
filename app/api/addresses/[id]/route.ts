import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/addresses/[id] - Get a single address
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    const address = await prisma.address.findFirst({
      where: {
        id,
        customerId: customer.id
      }
    })

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { error: 'Failed to fetch address' },
      { status: 500 }
    )
  }
}

// PUT /api/addresses/[id] - Update an address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Verify address belongs to customer
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        customerId: customer.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // If setting as default, remove default from other addresses
    if (body.isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: { customerId: customer.id },
        data: { isDefault: false }
      })
    }

    // Update address
    const address = await prisma.address.update({
      where: { id },
      data: {
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.company !== undefined && { company: body.company || null }),
        ...(body.address1 && { address1: body.address1 }),
        ...(body.address2 !== undefined && { address2: body.address2 || null }),
        ...(body.city && { city: body.city }),
        ...(body.state !== undefined && { state: body.state || null }),
        ...(body.postalCode && { postalCode: body.postalCode }),
        ...(body.country && { country: body.country }),
        ...(body.phone !== undefined && { phone: body.phone || null }),
        ...(body.isDefault !== undefined && { isDefault: body.isDefault })
      }
    })

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE /api/addresses/[id] - Delete an address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Verify address belongs to customer
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        customerId: customer.id
      }
    })

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Delete address
    await prisma.address.delete({
      where: { id }
    })

    // If deleted address was default, set another as default
    if (existingAddress.isDefault) {
      const firstAddress = await prisma.address.findFirst({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' }
      })

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isDefault: true }
        })
      }
    }

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
