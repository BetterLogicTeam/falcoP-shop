import prisma from '@/lib/prisma'

export type CheckoutAuditPayload = {
  paymentIntentId?: string | null
  outcome: string
  httpStatus?: number | null
  errorCode?: string | null
  serverTotalOre?: number | null
  stripeAmountOre?: number | null
  stripeStatus?: string | null
  itemCount?: number | null
  orderNumber?: string | null
}

/**
 * Persists checkout outcomes to Postgres (survives short-lived Vercel log retention).
 * Never throws — failures only log to console.
 */
export async function writeCheckoutAudit(entry: CheckoutAuditPayload): Promise<void> {
  try {
    await prisma.checkoutAuditLog.create({
      data: {
        paymentIntentId: entry.paymentIntentId ?? null,
        outcome: entry.outcome,
        httpStatus: entry.httpStatus ?? null,
        errorCode: entry.errorCode ?? null,
        serverTotalOre: entry.serverTotalOre ?? null,
        stripeAmountOre: entry.stripeAmountOre ?? null,
        stripeStatus: entry.stripeStatus ?? null,
        itemCount: entry.itemCount ?? null,
        orderNumber: entry.orderNumber ?? null,
      },
    })
  } catch (e) {
    console.error('[checkout-audit] persist failed:', e)
  }
}
