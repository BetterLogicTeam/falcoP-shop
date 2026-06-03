type WebhookPayload = {
  raw: string
  ref?: string
  trackingNumber?: string
  status?: string
  shippingMethod?: string
}

function pickFirst(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    const v = value?.trim()
    if (v) return v
  }
  return undefined
}

function readXmlTag(xml: string, tagName: string): string | undefined {
  const re = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i')
  const m = xml.match(re)
  return m?.[1]?.trim()
}

function normalizeStatus(s?: string): string | undefined {
  const value = s?.trim().toLowerCase()
  if (!value) return undefined
  if (['created', 'incomplete', 'complete', 'ready_to_ship', 'attention'].includes(value)) return 'processing'
  if (value === 'shipped') return 'shipped'
  if (value === 'delivered') return 'delivered'
  if (value === 'returned') return 'cancelled'
  return undefined
}

export function parseFraktjaktWebhook(rawBody: string): WebhookPayload {
  const raw = rawBody || ''

  // JSON webhook payload (if configured as JSON by sender/proxy)
  try {
    const j = JSON.parse(raw) as Record<string, unknown>
    const ref = pickFirst(
      String(j.reference ?? ''),
      String(j.orderNumber ?? ''),
      String(j.order_number ?? ''),
      String(j.merchant_reference ?? ''),
      String(j.consignor_reference ?? ''),
      String(j.sender_reference ?? ''),
      String(j.your_reference ?? ''),
      String(j.order_ref ?? ''),
      String(j.shipment_reference ?? '')
    )
    const trackingNumber = pickFirst(
      String(j.trackingNumber ?? ''),
      String(j.tracking_number ?? ''),
      String(j.waybill ?? ''),
      String(j.track_and_trace ?? '')
    )
    const shippingMethod = pickFirst(
      String(j.shippingMethod ?? ''),
      String(j.shipping_method ?? ''),
      String(j.product_name ?? ''),
      String(j.carrier ?? '')
    )
    const status = pickFirst(String(j.status ?? ''), String(j.shipment_status ?? ''))

    return { raw, ref, trackingNumber, shippingMethod, status }
  } catch {
    // fallthrough to XML parsing
  }

  // XML webhook payload (Fraktjakt docs are XML-first)
  const ref = pickFirst(
    readXmlTag(raw, 'reference'),
    readXmlTag(raw, 'order_number'),
    readXmlTag(raw, 'ordernumber'),
    readXmlTag(raw, 'merchant_reference'),
    readXmlTag(raw, 'consignor_reference'),
    readXmlTag(raw, 'sender_reference'),
    readXmlTag(raw, 'your_reference'),
    readXmlTag(raw, 'shipment_reference'),
    readXmlTag(raw, 'order_ref')
  )
  const trackingNumber = pickFirst(
    readXmlTag(raw, 'tracking_number'),
    readXmlTag(raw, 'trackingnumber'),
    readXmlTag(raw, 'parcel_tracking_number'),
    readXmlTag(raw, 'waybill'),
    readXmlTag(raw, 'track_and_trace')
  )
  const shippingMethod = pickFirst(
    readXmlTag(raw, 'shipping_method'),
    readXmlTag(raw, 'shipping_product_name'),
    readXmlTag(raw, 'product_name'),
    readXmlTag(raw, 'carrier')
  )
  const status = pickFirst(readXmlTag(raw, 'status'), readXmlTag(raw, 'shipment_status'))

  return { raw, ref, trackingNumber, shippingMethod, status }
}

export function resolveFraktjaktWebhookToken(): string | null {
  const token = process.env.FRAKTJAKT_WEBHOOK_TOKEN?.trim()
  return token || null
}

export function isValidFraktjaktWebhookToken(headerToken: string | null): boolean {
  const expected = resolveFraktjaktWebhookToken()
  if (!expected) return true // allow integration without token initially; recommend setting one
  return Boolean(headerToken && headerToken === expected)
}

export function mapFraktjaktStatusToOrderStatus(status?: string): string | undefined {
  return normalizeStatus(status)
}

export function buildFraktjaktTrackingUrl(trackingNumber?: string | null): string | null {
  const t = trackingNumber?.trim()
  if (!t) return null
  // Public track page; customer can paste / verify shipment number here.
  return `https://www.fraktjakt.se/trace?locale=en&tracking_no=${encodeURIComponent(t)}`
}

