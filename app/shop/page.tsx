import ShopPageClient from './ShopPageClient'

// Prevent static prerender so useSearchParams() works at build time
export const dynamic = 'force-dynamic'

export default function ShopPage() {
  return <ShopPageClient />
}
