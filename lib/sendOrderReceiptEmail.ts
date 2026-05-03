import type { Order, OrderItem } from '@prisma/client'
import { formatPrice } from '@/lib/currency'
import { EMAILJS_CONFIG } from '@/lib/emailjs'

const EMAILJS_SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send'

type OrderWithItems = Order & { items: OrderItem[] }

function buildItemsSummary(items: OrderItem[]): string {
  return items
    .map((i) => {
      const bits = [i.name]
      if (i.size) bits.push(`Size ${i.size}`)
      if (i.color) bits.push(i.color)
      return `• ${bits.join(' — ')} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`
    })
    .join('\n')
}

function buildShippingAddress(order: Order): string {
  const parts = [
    order.shippingLine1,
    order.shippingLine2,
    [order.shippingCity, order.shippingState].filter(Boolean).join(', '),
    order.shippingPostal,
    order.shippingCountry,
  ].filter((p) => p && String(p).trim())
  return parts.join('\n')
}

/**
 * Sends purchase thank-you / order summary via EmailJS REST API (server-side).
 * Requires EMAILJS_PRIVATE_KEY + EMAILJS_ORDER_TEMPLATE_ID in env.
 * Fails open: returns ok:false without throwing so checkout is never blocked.
 */
export async function sendOrderReceiptEmail(order: OrderWithItems): Promise<{ ok: boolean; skipped?: string }> {
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim()
  const templateId = process.env.EMAILJS_ORDER_TEMPLATE_ID?.trim()
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim() || EMAILJS_CONFIG.SERVICE_ID
  const userId =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() || EMAILJS_CONFIG.PUBLIC_KEY

  if (!privateKey || !templateId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[order-email] Set EMAILJS_PRIVATE_KEY and EMAILJS_ORDER_TEMPLATE_ID to send purchase emails.'
      )
    }
    return { ok: false, skipped: 'emailjs_not_configured' }
  }

  const customerName = `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Customer'
  const thankYou =
    'Thank you for purchasing from Falco P. Your payment was received and your order is confirmed. We will email you again when your order ships.'

  const template_params: Record<string, string> = {
    customer_email: order.email,
    customer_name: customerName,
    order_number: order.orderNumber,
    order_total: formatPrice(order.total),
    subtotal: formatPrice(order.subtotal),
    shipping: formatPrice(order.shippingCost),
    discount: order.discount > 0 ? formatPrice(order.discount) : '—',
    items_summary: buildItemsSummary(order.items),
    shipping_address: buildShippingAddress(order) || '—',
    thank_you_message: thankYou,
  }

  const res = await fetch(EMAILJS_SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      accessToken: privateKey,
      template_params,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[order-email] EmailJS send failed:', res.status, text)
    return { ok: false, skipped: 'emailjs_send_failed' }
  }

  return { ok: true }
}
