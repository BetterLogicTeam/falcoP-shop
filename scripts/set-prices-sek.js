/**
 * Set all product prices to SEK:
 * - Kids category: 600 SEK
 * - All others (men, women): 900 SEK
 *
 * Run: node scripts/set-prices-sek.js
 * Requires: DATABASE_URL in .env
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const PRICE_ADULT = 900   // SEK
const PRICE_KIDS = 600    // SEK

async function setPricesSEK() {
  try {
    console.log('Setting all product prices to SEK...')
    console.log('  Adults (men, women):', PRICE_ADULT, 'SEK')
    console.log('  Kids:', PRICE_KIDS, 'SEK')

    const products = await prisma.product.findMany()
    console.log(`\nFound ${products.length} products`)

    let updated = 0
    for (const product of products) {
      const price = product.category === 'kids' ? PRICE_KIDS : PRICE_ADULT

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price,
          originalPrice: null,
        },
      })
      console.log(`  ${product.category}/${product.subcategory}: ${product.name} → ${price} SEK`)
      updated++
    }

    console.log(`\n✓ Updated ${updated} products to SEK prices.`)
  } catch (error) {
    console.error('Error setting prices:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setPricesSEK()
