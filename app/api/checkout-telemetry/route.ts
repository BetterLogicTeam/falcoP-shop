import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * Lightweight client telemetry after Klarna redirect (no secrets).
 * Helps diagnose missing DB orders when sessionStorage is empty.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const paymentIntentId =
      typeof body.paymentIntentId === 'string' ? body.paymentIntentId.trim() || null : null
    const hasPendingCheckout = body.hasPendingCheckout === true
    const redirectStatus = typeof body.redirectStatus === 'string' ? body.redirectStatus : null

    const checkoutHttpOk = body.checkoutHttpOk === true ? true : body.checkoutHttpOk === false ? false : null
    const checkoutError = typeof body.checkoutError === 'string' ? body.checkoutError.slice(0, 500) : null

    let outcome: string
    if (checkoutHttpOk === true) outcome = 'client_checkout_post_ok'
    else if (checkoutHttpOk === false) outcome = 'client_checkout_post_failed'
    else if (hasPendingCheckout) outcome = 'client_klarna_return_has_pending'
    else outcome = 'client_klarna_return_missing_pending'

    await prisma.checkoutAuditLog.create({
      data: {
        paymentIntentId,
        outcome,
        httpStatus: null,
        errorCode: redirectStatus,
        itemCount: null,
        adminNotes: checkoutError,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[checkout-telemetry]', e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
