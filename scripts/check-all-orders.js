const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.aachaovbtsadkdnopcom:6731467112@aws-1-eu-west-2.pooler.supabase.com:5432/postgres'
})

async function checkAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true }
    })

    console.log(`\n=== LAST ${orders.length} ORDERS ===\n`)

    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order: ${order.orderNumber}`)
      console.log(`   Email: ${order.email}`)
      console.log(`   Created: ${order.createdAt}`)
      console.log(`   Total: $${order.total} (Subtotal: $${order.subtotal})`)
      console.log(`   Items: ${order.items.length}`)
      order.items.forEach((item, i) => {
        console.log(`      ${i + 1}. ${item.name} - $${item.price} x ${item.quantity}`)
      })
      console.log('')
    })

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkAllOrders()
