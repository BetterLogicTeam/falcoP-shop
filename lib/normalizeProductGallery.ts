/**
 * Normalize product gallery fields for API responses.
 * Legacy rows may only set `image` with an empty `images` array — shoppers and admin
 * still need a single coherent `images` list (cover first, then extra angles).
 */
export function normalizeProductGallery<T extends { image: string; images: string[] }>(
  product: T
): T {
  const primary = (product.image ?? '').trim()
  const rest = Array.isArray(product.images)
    ? product.images.map((u) => String(u).trim()).filter(Boolean)
    : []
  const out: string[] = []
  const seen = new Set<string>()
  for (const u of [primary, ...rest]) {
    if (!u || seen.has(u)) continue
    seen.add(u)
    out.push(u)
  }
  return { ...product, images: out.length > 0 ? out : primary ? [primary] : [] }
}
