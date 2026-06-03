/**
 * Idempotent: creates Order + OrderItems for a paid Stripe payment that never reached the DB.
 * VERIFY product and coupon IDs exist in the TARGET database (production IDs differ from dev).
 *
 * Usage (PowerShell):
 *   $env:DATABASE_URL="postgresql://..."
 *   node scripts/manual-recover-stripe-order.mjs
 *
 * Optional env overrides:
 *   RECOVERY_PAYMENT_INTENT_ID  (default: pi from May 2026 case)
 *   RECOVERY_EMAIL, RECOVERY_FIRST_NAME, RECOVERY_LAST_NAME
 *   RECOVERY_LINE1, RECOVERY_CITY, RECOVERY_POSTAL, RECOVERY_COUNTRY, RECOVERY_STATE
 *   RECOVERY_PRODUCT_ID  (must exist in DB)
 *   RECOVERY_COUPON_CODE (default FALCO10) — set empty to skip coupon link / usage bump
 *   DRY_RUN=1 — only prints plan, no writes
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const pi =
  process.env.RECOVERY_PAYMENT_INTENT_ID?.trim() || 'pi_3Tc0haE6BpmyBGYJ1iRXKRSz'
const email = (process.env.RECOVERY_EMAIL || 'firiyeahamd82@gmail.com').trim().toLowerCase()
const firstName = process.env.RECOVERY_FIRST_NAME || 'Ahammad'
const lastName = process.env.RECOVERY_LAST_NAME || 'Kalid'
const line1 = process.env.RECOVERY_LINE1 || 'Vikingavägen 1E'
const city = process.env.RECOVERY_CITY || 'Lund'
const postal = process.env.RECOVERY_POSTAL || '22476'
const country = (process.env.RECOVERY_COUNTRY || 'SE').trim().toUpperCase()
const state = process.env.RECOVERY_STATE?.trim() || ''
const productId =
  process.env.RECOVERY_PRODUCT_ID?.trim() || 'cmifksd9t0001v018puzfe22b'
const couponCode = (process.env.RECOVERY_COUPON_CODE ?? 'FALCO10').trim().toUpperCase()
const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'

function calculatePercentageDiscount(subtotal, pct) {
  return Math.min(subtotal, Math.max(0, (subtotal * pct) / 100))
}

const prisma = new PrismaClient()

try {
  const existing = await prisma.order.findFirst({
    where: { OR: [{ paymentIntentId: pi }, { email }] },
    select: { orderNumber: true, paymentIntentId: true, email: true, total: true },
  })
  if (existing?.paymentIntentId === pi) {
    console.log('Already exists for this PaymentIntent:', JSON.stringify(existing, null, 2))
    process.exit(0)
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    console.error('Product not found:', productId, '- set RECOVERY_PRODUCT_ID to a valid id in THIS database.')
    process.exit(1)
  }

  const qty = 1
  const subtotal = product.price * qty
  let couponId = null
  let discount = 0
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } })
    if (!coupon) {
      console.error('Coupon not found:', couponCode)
      process.exit(1)
    }
    if (coupon.discountType.toLowerCase() === 'percentage') {
      discount = calculatePercentageDiscount(subtotal, coupon.discountValue)
    } else {
      discount = Math.min(subtotal, coupon.discountValue)
    }
    couponId = coupon.id
  }

  const shippingCost = 0
  const tax = 0
  const total = Math.max(0, subtotal + shippingCost + tax - discount)
  const orderNumber = `FP-RECOVERY-${Date.now()}-${randomBytes(3).toString('hex').toUpperCase()}`

  const plan = {
    orderNumber,
    paymentIntentId: pi,
    email,
    firstName,
    lastName,
    product: product.name,
    subtotal,
    discount,
    total,
    couponCode: couponCode || null,
  }
  console.log(JSON.stringify({ dryRun, plan }, null, 2))

  if (dryRun) {
    console.log('DRY_RUN set — no database writes.')
    process.exit(0)
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        customerId: null,
        email,
        firstName,
        lastName,
        phone: null,
        status: 'processing',
        paymentStatus: 'paid',
        paymentIntentId: pi,
        subtotal,
        shippingCost,
        tax,
        discount,
        couponId,
        total,
        shippingLine1: line1,
        shippingCity: city,
        shippingState: state || null,
        shippingPostal: postal,
        shippingCountry: country,
        adminNotes: 'Manual recovery: Stripe payment succeeded but storefront order was missing.',
        items: {
          create: [
            {
              productId: product.id,
              name: product.name,
              image: product.image,
              quantity: qty,
              price: product.price,
              size: null,
              color: null,
            },
          ],
        },
      },
      include: { items: true },
    })

    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usageCount: { increment: 1 } },
      })
    }
    return created
  })

  console.log('Created order:', order.orderNumber, 'id', order.id)
} finally {
  await prisma.$disconnect()
}
