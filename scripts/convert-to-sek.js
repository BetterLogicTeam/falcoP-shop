const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function convertToSEK() {
  try {
    console.log('Converting all prices from USD to SEK...')

    // Exchange rate: 1 USD ≈ 11.25 SEK
    const exchangeRate = 11.25

    // Get all products
    const products = await prisma.product.findMany()

    console.log(`Found ${products.length} products to update`)

    for (const product of products) {
      const newPrice = Math.round(product.price * exchangeRate)
      const newOriginalPrice = product.originalPrice
        ? Math.round(product.originalPrice * exchangeRate)
        : null

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: newPrice,
          originalPrice: newOriginalPrice
        }
      })

      console.log(`✓ ${product.name}: $${product.price} → ${newPrice} SEK`)
    }

    console.log('\n✓ All prices converted to SEK successfully!')

  } catch (error) {
    console.error('Error converting prices:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

convertToSEK()
