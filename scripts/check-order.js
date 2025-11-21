const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://postgres.aachaovbtsadkdnopcom:6731467112@aws-1-eu-west-2.pooler.supabase.com:5432/postgres'
})

async function checkLatestOrder() {
  try {
    const order = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    })

    console.log('\n=== LATEST ORDER ===')
    console.log('Order Number:', order?.orderNumber)
    console.log('Total:', order?.total)
    console.log('Subtotal:', order?.subtotal)
    console.log('Items count:', order?.items.length)
    console.log('\nItems:')
    order?.items.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}`)
    })

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkLatestOrder()
