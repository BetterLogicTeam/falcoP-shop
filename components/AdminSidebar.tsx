'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  BarChart3,
  ShoppingCart,
  Tag,
  Menu,
  X,
  LogOut,
  User,
  Activity,
  CreditCard,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully', {
      duration: 2000,
      style: { background: '#10B981', color: '#fff', fontSize: '14px', fontWeight: '500' },
    })
    router.push('/admin/login')
  }

  const menuItems = [
    { name: 'Dashboard',    href: '/admin',                icon: LayoutDashboard },
    { name: 'Products',     href: '/admin/products',       icon: Package },
    { name: 'Orders',       href: '/admin/orders',         icon: ShoppingCart },
    { name: 'Checkout log', href: '/admin/checkout-audit', icon: Activity },
    { name: 'Coupons',      href: '/admin/coupons',        icon: Tag },
    { name: 'Customers',    href: '/admin/customers',      icon: Users },
    { name: 'Analytics',    href: '/admin/analytics',      icon: BarChart3 },
    { name: 'Settings',     href: '/admin/settings',       icon: Settings },
    { name: 'Due Payment',  href: '/admin/services',       icon: CreditCard },
  ]

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64'

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-lg rounded-lg"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar — flex column so nav scrolls and footer stays pinned */}
      <div
        className={`
          bg-white shadow-lg transition-all duration-300
          ${sidebarWidth}
          fixed left-0 top-0 h-full z-50
          flex flex-col
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ── Header ── */}
        <div className="shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-falco-accent rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">FP</span>
                </div>
                <span className="font-bold text-gray-800">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
              aria-label="Collapse sidebar"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Navigation — scrollable ── */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                      ${isActive ? 'bg-falco-accent text-black' : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ── Footer — pinned at bottom ── */}
        <div className="shrink-0 border-t border-gray-100 p-3 space-y-1">
          {/* User info */}
          {user && (
            <div className={`flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-falco-accent rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-black" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              )}
            </div>
          )}

          {/* Back to Site */}
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            title={isCollapsed ? 'Back to Site' : undefined}
            className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Back to Site</span>}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : undefined}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
