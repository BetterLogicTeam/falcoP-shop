import type { PrismaClient } from '@prisma/client'

/** Default code used if env is unset (keep server + NEXT_PUBLIC in sync in production). */
export const DEFAULT_NEWSLETTER_SUBSCRIBER_COUPON_CODE = 'FALCO10'

export const NEWSLETTER_SUBSCRIBER_DISCOUNT_PERCENT = 10

/** Coupon code stored in DB and shown to subscribers (uppercase). */
export function getNewsletterSubscriberCouponCode(): string {
  const raw =
    process.env.NEWSLETTER_SUBSCRIBER_COUPON_CODE?.trim() ||
    process.env.NEXT_PUBLIC_NEWSLETTER_SUBSCRIBER_COUPON_CODE?.trim() ||
    DEFAULT_NEWSLETTER_SUBSCRIBER_COUPON_CODE
  return raw.toUpperCase()
}

/**
 * Ensures the newsletter promo coupon exists so /api/coupons/validate and checkout can link couponId.
 * Does not overwrite an existing row (admins may tune limits or deactivate).
 */
export async function ensureNewsletterSubscriberCoupon(prisma: PrismaClient): Promise<void> {
  const code = getNewsletterSubscriberCouponCode()
  const existing = await prisma.coupon.findUnique({ where: { code } })
  if (existing) return

  await prisma.coupon.create({
    data: {
      code,
      description: 'Newsletter subscriber — 10% off (one use per email)',
      discountType: 'percentage',
      discountValue: NEWSLETTER_SUBSCRIBER_DISCOUNT_PERCENT,
      usagePerCustomer: 1,
      isActive: true,
    },
  })
}
