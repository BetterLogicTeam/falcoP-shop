/**
 * Ordered, de-duplicated gallery URLs for a product.
 * Primary `image` is always first; additional angles from `images` follow.
 */
export function productGalleryUrls(product: {
  image?: string | null
  images?: string[] | null
}): string[] {
  const primary = (product.image ?? '').trim()
  const rest = Array.isArray(product.images)
    ? product.images.map((u) => String(u).trim()).filter(Boolean)
    : []
  const ordered: string[] = []
  const seen = new Set<string>()
  for (const u of [primary, ...rest]) {
    if (!u || seen.has(u)) continue
    seen.add(u)
    ordered.push(u)
  }
  return ordered.length > 0 ? ordered : ['/images/placeholder-product.jpg']
}
