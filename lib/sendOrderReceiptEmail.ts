import type { Order, OrderItem } from '@prisma/client'
import { formatPrice } from '@/lib/currency'
import { EMAILJS_CONFIG } from '@/lib/emailjs'

const EMAILJS_SEND_URL = 'https://api.emailjs.com/api/v1.0/email/send'
const RESEND_API = 'https://api.resend.com/emails'

type OrderWithItems = Order & { items: OrderItem[] }

export type SendOrderReceiptResult = {
  ok: boolean
  skipped?: string
  via?: 'resend' | 'emailjs'
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

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

function buildOrderReceiptHtml(order: OrderWithItems): string {
  const customerName = `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Customer'
  const thankYou =
    'Thank you for purchasing from Falco P. Your payment was received and your order is confirmed. We will email you again when your order ships.'
  const shipping = order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'Free'
  const discount = order.discount > 0 ? formatPrice(order.discount) : '—'
  const addr = buildShippingAddress(order) || '—'
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(i.name)}${
          i.size ? ` <span style="color:#666">(${escapeHtml(i.size)})</span>` : ''
        }${i.color ? ` · ${escapeHtml(i.color)}` : ''}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${escapeHtml(formatPrice(i.price * i.quantity))}</td></tr>`
    )
    .join('')

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="font-family:system-ui,Segoe UI,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;padding:24px">
  <h1 style="font-size:20px;margin:0 0 8px">Order confirmed</h1>
  <p style="margin:0 0 16px;color:#444">${escapeHtml(thankYou)}</p>
  <p style="margin:0 0 4px"><strong>Order</strong> ${escapeHtml(order.orderNumber)}</p>
  <p style="margin:0 0 16px"><strong>Total</strong> ${escapeHtml(formatPrice(order.total))}</p>
  <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#666;margin:24px 0 8px">Items</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th align="left" style="padding:8px;border-bottom:2px solid #ddd">Product</th><th style="padding:8px;border-bottom:2px solid #ddd">Qty</th><th align="right" style="padding:8px;border-bottom:2px solid #ddd">Line</th></tr></thead><tbody>${rows}</tbody></table>
  <p style="margin:16px 0 0;font-size:14px"><strong>Subtotal</strong> ${escapeHtml(formatPrice(order.subtotal))}<br/>
  <strong>Shipping</strong> ${escapeHtml(shipping)}<br/>
  <strong>Discount</strong> ${escapeHtml(discount)}</p>
  <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#666;margin:24px 0 8px">Ship to</h2>
  <pre style="font-family:inherit;white-space:pre-wrap;margin:0;font-size:14px;color:#333">${escapeHtml(addr)}</pre>
  <p style="margin-top:24px;font-size:13px;color:#666">Questions? Reply to this email or contact us at the address on our website.</p>
  <p style="margin-top:8px;font-size:12px;color:#999">${escapeHtml(customerName)} · ${escapeHtml(order.email)}</p>
</body></html>`
}

async function sendViaResend(order: OrderWithItems): Promise<SendOrderReceiptResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from =
    process.env.RESEND_ORDER_FROM?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim()
  if (!apiKey || !from) {
    return { ok: false, skipped: 'resend_not_configured' }
  }

  const replyTo = process.env.ORDER_EMAIL_REPLY_TO?.trim() || process.env.SUPPORT_EMAIL?.trim()
  const subject = `Thank you — Order ${order.orderNumber} | Falco P`

  const body: Record<string, unknown> = {
    from,
    to: [order.email.trim()],
    subject,
    html: buildOrderReceiptHtml(order),
  }
  if (replyTo) body.reply_to = replyTo

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[order-email] Resend failed:', res.status, text)
    return { ok: false, skipped: 'resend_send_failed' }
  }

  return { ok: true, via: 'resend' }
}

async function sendViaEmailJs(order: OrderWithItems): Promise<SendOrderReceiptResult> {
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim()
  const templateId = process.env.EMAILJS_ORDER_TEMPLATE_ID?.trim()
  const serviceId = process.env.EMAILJS_SERVICE_ID?.trim() || EMAILJS_CONFIG.SERVICE_ID
  const userId =
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() || EMAILJS_CONFIG.PUBLIC_KEY

  if (!privateKey || !templateId) {
    return { ok: false, skipped: 'emailjs_not_configured' }
  }

  const customerName = `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'Customer'
  const thankYou =
    'Thank you for purchasing from Falco P. Your payment was received and your order is confirmed. We will email you again when your order ships.'

  const email = order.email.trim()
  const template_params: Record<string, string> = {
    customer_email: email,
    /** Many EmailJS templates use "To Email" = {{to_email}} */
    to_email: email,
    user_email: email,
    customer_name: customerName,
    order_number: order.orderNumber,
    order_total: formatPrice(order.total),
    subtotal: formatPrice(order.subtotal),
    shipping: order.shippingCost > 0 ? formatPrice(order.shippingCost) : 'Free',
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

  return { ok: true, via: 'emailjs' }
}

/**
 * Sends purchase thank-you / order summary (server-side).
 * Tries Resend first, then EmailJS. Fails open (never throws) so checkout is not blocked.
 */
export async function sendOrderReceiptEmail(order: OrderWithItems): Promise<SendOrderReceiptResult> {
  if (!order.email?.trim()) {
    console.warn('[order-email] Skipped: order has no email')
    return { ok: false, skipped: 'no_customer_email' }
  }

  const resend = await sendViaResend(order)
  if (resend.ok) return resend

  const emailjs = await sendViaEmailJs(order)
  if (emailjs.ok) return emailjs

  const noProvider =
    resend.skipped === 'resend_not_configured' && emailjs.skipped === 'emailjs_not_configured'
  if (noProvider) {
    console.warn(
      '[order-email] No transactional email provider configured. Set RESEND_API_KEY + RESEND_ORDER_FROM (recommended), or EMAILJS_PRIVATE_KEY + EMAILJS_ORDER_TEMPLATE_ID. See .env.example.'
    )
  } else {
    console.warn('[order-email] All providers failed:', { resend: resend.skipped, emailjs: emailjs.skipped })
  }

  return { ok: false, skipped: emailjs.skipped || resend.skipped }
}
