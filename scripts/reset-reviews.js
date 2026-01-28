const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetReviews() {
  try {
    console.log('Resetting all product reviews and ratings...')

    const result = await prisma.product.updateMany({
      data: {
        reviewCount: 0,
        rating: 5.0
      }
    })

    console.log(`✓ Successfully reset ${result.count} products`)
    console.log('  - Review count: 0')
    console.log('  - Rating: 5.0')

  } catch (error) {
    console.error('Error resetting reviews:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

resetReviews()
