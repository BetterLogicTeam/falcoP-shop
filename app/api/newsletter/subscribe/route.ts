import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  ensureNewsletterSubscriberCoupon,
  getNewsletterSubscriberCouponCode,
  NEWSLETTER_SUBSCRIBER_DISCOUNT_PERCENT,
} from '@/lib/newsletter-coupon'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = String(body.email || '')
      .trim()
      .toLowerCase()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    await ensureNewsletterSubscriberCoupon(prisma)

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, isActive: true },
      update: { isActive: true },
    })

    const discountCode = getNewsletterSubscriberCouponCode()

    return NextResponse.json({
      ok: true,
      discountCode,
      discountPercent: NEWSLETTER_SUBSCRIBER_DISCOUNT_PERCENT,
    })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Could not save subscription' }, { status: 500 })
  }
}
