import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import {
  isValidFraktjaktWebhookToken,
  mapFraktjaktStatusToOrderStatus,
  parseFraktjaktWebhook,
} from '@/lib/fraktjakt'

/**
 * Fraktjakt webhook endpoint.
 *
 * Configure in Fraktjakt:
 *   URL: https://www.falcop.com/api/webhooks/fraktjakt
 *   Header: x-fraktjakt-token: <FRAKTJAKT_WEBHOOK_TOKEN> (recommended)
 */
export async function POST(request: NextRequest) {
  try {
    const headerToken = request.headers.get('x-fraktjakt-token')
    if (!isValidFraktjaktWebhookToken(headerToken)) {
      return NextResponse.json({ error: 'Unauthorized webhook token' }, { status: 401 })
    }

    const raw = await request.text()
    const payload = parseFraktjaktWebhook(raw)

    if (!payload.ref) {
      return NextResponse.json(
        { ok: false, message: 'No order reference in payload; ignored.' },
        { status: 202 }
      )
    }

    const status = mapFraktjaktStatusToOrderStatus(payload.status)
    const noteLine = `[Fraktjakt webhook] status=${payload.status || '-'} tracking=${
      payload.trackingNumber || '-'
    } method=${payload.shippingMethod || '-'} ref=${payload.ref}`

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber: payload.ref }, { paymentIntentId: payload.ref }],
      },
      select: { id: true, adminNotes: true },
    })

    if (!order) {
      return NextResponse.json(
        { ok: false, message: `No matching order for reference ${payload.ref}` },
        { status: 202 }
      )
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        ...(payload.trackingNumber ? { trackingNumber: payload.trackingNumber } : {}),
        ...(payload.shippingMethod ? { shippingMethod: payload.shippingMethod } : {}),
        ...(status ? { status } : {}),
        adminNotes: [order.adminNotes, noteLine].filter(Boolean).join('\n'),
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Fraktjakt webhook error:', error)
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 })
  }
}

