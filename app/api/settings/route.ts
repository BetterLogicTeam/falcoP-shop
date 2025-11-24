import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Default settings
const defaultSettings = {
  // General Settings
  siteName: 'Falco P',
  siteDescription: 'Premium Sportswear | Unleash Your Inner Maverick',
  siteUrl: 'https://falco-p.vercel.app',
  adminEmail: 'admin@falcop.com',
  timezone: 'America/New_York',
  currency: 'USD',
  language: 'en',

  // Appearance Settings
  primaryColor: '#FFD700',
  secondaryColor: '#000000',
  logo: '/images/falcop.jpg',
  favicon: '/images/falcop.jpg',

  // Email Settings
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUsername: '',
  smtpPassword: '',
  fromName: 'Falco P Team',
  fromEmail: 'noreply@falcop.com',

  // Notification Settings
  emailNotifications: true,
  orderNotifications: true,
  customerNotifications: true,
  inventoryAlerts: true,
  lowStockThreshold: 10,

  // Security Settings
  twoFactorAuth: false,
  sessionTimeout: 30,
  passwordMinLength: 8,
  requireStrongPasswords: true,

  // Payment Settings
  stripePublicKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  paypalSecret: '',

  // Backup Settings
  autoBackup: true,
  backupFrequency: 'daily',
  backupRetention: 30,
  cloudBackup: true
}

// Get category for a setting key
function getCategoryForKey(key: string): string {
  const generalKeys = ['siteName', 'siteDescription', 'siteUrl', 'adminEmail', 'timezone', 'currency', 'language']
  const appearanceKeys = ['primaryColor', 'secondaryColor', 'logo', 'favicon']
  const emailKeys = ['smtpHost', 'smtpPort', 'smtpUsername', 'smtpPassword', 'fromName', 'fromEmail']
  const notificationKeys = ['emailNotifications', 'orderNotifications', 'customerNotifications', 'inventoryAlerts', 'lowStockThreshold']
  const securityKeys = ['twoFactorAuth', 'sessionTimeout', 'passwordMinLength', 'requireStrongPasswords']
  const paymentKeys = ['stripePublicKey', 'stripeSecretKey', 'paypalClientId', 'paypalSecret']
  const backupKeys = ['autoBackup', 'backupFrequency', 'backupRetention', 'cloudBackup']

  if (generalKeys.includes(key)) return 'general'
  if (appearanceKeys.includes(key)) return 'appearance'
  if (emailKeys.includes(key)) return 'email'
  if (notificationKeys.includes(key)) return 'notifications'
  if (securityKeys.includes(key)) return 'security'
  if (paymentKeys.includes(key)) return 'payments'
  if (backupKeys.includes(key)) return 'backup'
  return 'general'
}

// GET /api/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {}
    if (category) {
      where.category = category
    }

    // Get settings from database
    const dbSettings = await prisma.setting.findMany({ where })

    // Merge with defaults
    const settings: Record<string, any> = { ...defaultSettings }

    dbSettings.forEach((setting) => {
      try {
        // Parse JSON values (for booleans, numbers, etc.)
        settings[setting.key] = JSON.parse(setting.value)
      } catch {
        // Use string value if not valid JSON
        settings[setting.key] = setting.value
      }
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      )
    }

    // Update each setting
    const updates = Object.entries(settings).map(async ([key, value]) => {
      const category = getCategoryForKey(key)
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)

      return prisma.setting.upsert({
        where: { key },
        update: {
          value: stringValue,
          category
        },
        create: {
          key,
          value: stringValue,
          category
        }
      })
    })

    await Promise.all(updates)

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// POST /api/settings/reset - Reset settings to defaults
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, category } = body

    if (action === 'reset') {
      if (category) {
        // Reset specific category
        await prisma.setting.deleteMany({
          where: { category }
        })
      } else {
        // Reset all settings
        await prisma.setting.deleteMany({})
      }

      return NextResponse.json({
        message: category
          ? `${category} settings reset to defaults`
          : 'All settings reset to defaults',
        settings: defaultSettings
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error resetting settings:', error)
    return NextResponse.json(
      { error: 'Failed to reset settings' },
      { status: 500 }
    )
  }
}
