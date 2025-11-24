'use client'

import { useState, useEffect } from 'react'
import { Save, Upload, Eye, EyeOff, Globe, Mail, Bell, Shield, Palette, CreditCard, Database, Loader2, RefreshCw, RotateCcw } from 'lucide-react'
import { Settings as SettingsIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface Settings {
  // General Settings
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  timezone: string
  currency: string
  language: string

  // Appearance Settings
  primaryColor: string
  secondaryColor: string
  logo: string
  favicon: string

  // Email Settings
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpPassword: string
  fromName: string
  fromEmail: string

  // Notification Settings
  emailNotifications: boolean
  orderNotifications: boolean
  customerNotifications: boolean
  inventoryAlerts: boolean
  lowStockThreshold: number

  // Security Settings
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordMinLength: number
  requireStrongPasswords: boolean

  // Payment Settings
  stripePublicKey: string
  stripeSecretKey: string
  paypalClientId: string
  paypalSecret: string

  // Backup Settings
  autoBackup: boolean
  backupFrequency: string
  backupRetention: number
  cloudBackup: boolean
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [settings, setSettings] = useState<Settings>({
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
  })

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'backup', label: 'Backup', icon: Database }
  ]

  // Fetch settings from database
  const fetchSettings = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      else setRefreshing(true)

      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('Failed to fetch settings')

      const data = await response.json()
      setSettings(data.settings)
      setHasChanges(false)

      if (!showLoader) {
        toast.success('Settings refreshed!')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSettings(true)
  }, [])

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings })
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      setHasChanges(false)
      toast.success('Settings saved successfully!', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
        },
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async (category?: string) => {
    const confirmMessage = category
      ? `Reset ${category} settings to defaults?`
      : 'Reset ALL settings to defaults?'

    if (!confirm(confirmMessage)) return

    try {
      setSaving(true)

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'reset', category })
      })

      if (!response.ok) {
        throw new Error('Failed to reset settings')
      }

      const data = await response.json()
      setSettings(data.settings)
      setHasChanges(false)

      toast.success(data.message)
    } catch (error) {
      console.error('Error resetting settings:', error)
      toast.error('Failed to reset settings')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (key: string, file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      handleInputChange(key, data.url)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => handleInputChange('adminEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => handleInputChange('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
        <input
          type="url"
          value={settings.siteUrl}
          onChange={(e) => handleInputChange('siteUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div className="flex items-center space-x-4">
            <img
              src={settings.logo}
              alt="Logo"
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/placeholder-product.jpg'
              }}
            />
            <label className="px-4 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold transition-colors flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload('logo', file)
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
          <div className="flex items-center space-x-4">
            <img
              src={settings.favicon}
              alt="Favicon"
              className="w-8 h-8 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/placeholder-product.jpg'
              }}
            />
            <label className="px-4 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold transition-colors flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload Favicon
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload('favicon', file)
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
          <input
            type="text"
            value={settings.smtpHost}
            onChange={(e) => handleInputChange('smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
          <input
            type="text"
            value={settings.smtpPort}
            onChange={(e) => handleInputChange('smtpPort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
          <input
            type="text"
            value={settings.smtpUsername}
            onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={settings.smtpPassword}
              onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
          <input
            type="text"
            value={settings.fromName}
            onChange={(e) => handleInputChange('fromName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
          <input
            type="email"
            value={settings.fromEmail}
            onChange={(e) => handleInputChange('fromEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive email notifications for important events' },
          { key: 'orderNotifications', title: 'Order Notifications', desc: 'Get notified when new orders are placed' },
          { key: 'customerNotifications', title: 'Customer Notifications', desc: 'Get notified when new customers register' },
          { key: 'inventoryAlerts', title: 'Inventory Alerts', desc: 'Get notified when inventory is low' }
        ].map(({ key, title, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">{title}</h4>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key as keyof Settings] as boolean}
                onChange={(e) => handleInputChange(key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-falco-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-falco-accent"></div>
            </label>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
        <input
          type="number"
          value={settings.lowStockThreshold}
          onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
        />
        <p className="mt-1 text-sm text-gray-500">Alert when stock falls below this number</p>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-falco-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-falco-accent"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Require Strong Passwords</h4>
          <p className="text-sm text-gray-500">Passwords must include uppercase, lowercase, and numbers</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requireStrongPasswords}
            onChange={(e) => handleInputChange('requireStrongPasswords', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-falco-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-falco-accent"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Password Length</label>
          <input
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-800 mb-1">Payment Gateway Configuration</h4>
        <p className="text-sm text-blue-600">Configure your payment gateways. Keep your API keys secure.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Stripe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
            <input
              type="text"
              value={settings.stripePublicKey}
              onChange={(e) => handleInputChange('stripePublicKey', e.target.value)}
              placeholder="pk_test_..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
            <input
              type="password"
              value={settings.stripeSecretKey}
              onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
              placeholder="sk_test_..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">PayPal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
            <input
              type="text"
              value={settings.paypalClientId}
              onChange={(e) => handleInputChange('paypalClientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secret</label>
            <input
              type="password"
              value={settings.paypalSecret}
              onChange={(e) => handleInputChange('paypalSecret', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Automatic Backups</h4>
          <p className="text-sm text-gray-500">Automatically backup your data</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.autoBackup}
            onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-falco-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-falco-accent"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Cloud Backup</h4>
          <p className="text-sm text-gray-500">Store backups in the cloud</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.cloudBackup}
            onChange={(e) => handleInputChange('cloudBackup', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-falco-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-falco-accent"></div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Retention (days)</label>
          <input
            type="number"
            value={settings.backupRetention}
            onChange={(e) => handleInputChange('backupRetention', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falco-accent focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'appearance':
        return renderAppearanceSettings()
      case 'email':
        return renderEmailSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'payments':
        return renderPaymentSettings()
      case 'backup':
        return renderBackupSettings()
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-falco-accent mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your store settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchSettings(false)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => handleReset(activeTab)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
            Reset Tab
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-falco-accent text-falco-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div>
            {hasChanges && (
              <span className="text-sm text-orange-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                You have unsaved changes
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-6 py-2 bg-falco-accent text-black rounded-lg hover:bg-falco-gold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
