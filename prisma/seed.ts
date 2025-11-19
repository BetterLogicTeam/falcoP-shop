import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { products } from '../data/products'

const prisma = new PrismaClient()

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing products (optional - comment out to keep existing data)
  console.log('Clearing existing products...')
  await prisma.product.deleteMany({})

  // Seed products
  console.log(`Seeding ${products.length} products...`)

  for (const product of products) {
    let slug = generateSlug(product.name)

    // Check for duplicate slug
    let slugExists = await prisma.product.findUnique({ where: { slug } })
    let counter = 1
    while (slugExists) {
      slug = `${generateSlug(product.name)}-${counter}`
      slugExists = await prisma.product.findUnique({ where: { slug } })
      counter++
    }

    await prisma.product.create({
      data: {
        id: product.id, // Keep original ID for compatibility
        name: product.name,
        slug,
        category: product.category,
        subcategory: product.subcategory,
        type: product.type,
        price: product.price,
        originalPrice: product.originalPrice || null,
        rating: product.rating,
        reviewCount: product.reviews,
        image: product.image,
        images: product.images,
        badge: product.badge || null,
        colors: product.colors,
        sizes: product.sizes,
        description: product.description,
        features: product.features,
        inStock: product.inStock,
        stockQuantity: 100, // Default stock
      },
    })
  }

  console.log('✅ Products seeded successfully!')

  // Create default admin user
  console.log('Creating default admin user...')
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@falcop.com' },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await prisma.admin.create({
      data: {
        email: 'admin@falcop.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      },
    })
    console.log('✅ Default admin created (email: admin@falcop.com, password: admin123)')
  } else {
    // Update existing admin password
    const hashedPassword = await bcrypt.hash('admin123', 12)
    await prisma.admin.update({
      where: { email: 'admin@falcop.com' },
      data: { password: hashedPassword }
    })
    console.log('✅ Admin password updated (email: admin@falcop.com, password: admin123)')
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
