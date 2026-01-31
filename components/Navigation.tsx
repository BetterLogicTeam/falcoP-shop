'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingBag, User, Search, Heart, ChevronDown, ChevronRight, LogOut, Package, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useClientTranslation } from '../hooks/useClientTranslation'
import { useCart } from '../contexts/CartContext'
import LanguageSelector from './LanguageSelector'

export default function Navigation() {
  useClientTranslation()
  const { data: session } = useSession()
  const { state, openCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null)
  const closeTimer = useRef<number | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openDropdown = (key: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setActiveDropdown(key)
  }

  const closeDropdownWithDelay = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
    }
    closeTimer.current = window.setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Simple category structure
  const navItems = [
    { name: 'Shoes', href: '/shop/shoes', hasSubmenu: true },
    { name: 'Sportswear', href: '/shop/sportswear', hasSubmenu: true },
  ]

  // Submenu options for both categories
  const categorySubmenu = [
    { label: 'Men', href: 'men' },
    { label: 'Women', href: 'women' },
    { label: 'Kids', href: 'kids' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800'
        : 'bg-black/90 backdrop-blur-md'
    }`}>
      {/* Additional background layer to prevent text bleeding */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container-custom relative z-10">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group relative">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <Image
                src="/images/falcop.jpg"
                alt="Falco Peak Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight leading-none">
                FALCO PEAK
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wider hidden sm:block">
                PREMIUM SPORTSWEAR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => openDropdown(item.name.toLowerCase())}
                onMouseLeave={closeDropdownWithDelay}
              >
                <Link
                  href={item.href}
                  className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-base xl:text-lg relative group px-2 py-1 flex items-center space-x-1"
                >
                  <span>{item.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === item.name.toLowerCase() ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>

                {activeDropdown === item.name.toLowerCase() && (
                  <div
                    onMouseEnter={() => openDropdown(item.name.toLowerCase())}
                    onMouseLeave={closeDropdownWithDelay}
                    className="absolute left-0 top-full mt-2 w-48 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-xl p-2 shadow-2xl z-[60]"
                  >
                    {categorySubmenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={`/shop/${item.name.toLowerCase()}/${sub.href}`}
                        className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6">
            <LanguageSelector />
            <button className="p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full" aria-label="Search">
              <Search className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
            </button>
            <Link
              href="/account/wishlist"
              className="p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full"
              >
                <User className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-800">
                        <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                      {session.user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          signOut({ redirect: false })
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 border-t border-gray-800"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-3 text-sm text-white hover:bg-white/10 font-medium"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 border-t border-gray-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full"
            >
              <ShoppingBag className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-falco-accent text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {state.totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: Search, Favorite, Cart, Menu (always visible in header) */}
          <div className="lg:hidden flex items-center space-x-2">
            <button className="p-2 text-white hover:text-gray-300 transition-colors duration-300" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/account/wishlist"
              className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative p-2 text-white hover:text-gray-300 transition-colors duration-300"
            >
              <ShoppingBag className="w-5 h-5" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-falco-accent text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {state.totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setIsOpen(!isOpen)
                setMobileSubmenu(null)
              }}
              className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-800 shadow-2xl">
          <div className="py-4 px-4">
            {/* Main Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={() => setMobileSubmenu(mobileSubmenu === item.name ? null : item.name)}
                    className="w-full flex items-center justify-between text-white hover:text-falco-accent transition-colors font-medium py-3 px-3 rounded-lg hover:bg-gray-900"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${mobileSubmenu === item.name ? 'rotate-90' : ''}`} />
                  </button>

                  {/* Mobile Submenu */}
                  {mobileSubmenu === item.name && (
                    <div className="pl-4 space-y-1 mt-1">
                      {categorySubmenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={`/shop/${item.name.toLowerCase()}/${sub.href}`}
                          className="block text-gray-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-gray-900"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 my-4"></div>

            {/* User Links */}
            <div className="space-y-1">
              {session ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-400">
                    Signed in as <span className="text-white font-medium">{session.user?.name}</span>
                  </div>
                  <Link
                    href="/account"
                    className="block text-white hover:text-falco-accent transition-colors font-medium py-2.5 px-3 rounded-lg hover:bg-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block text-white hover:text-falco-accent transition-colors font-medium py-2.5 px-3 rounded-lg hover:bg-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    My Orders
                  </Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block text-white hover:text-falco-accent transition-colors font-medium py-2.5 px-3 rounded-lg hover:bg-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      signOut({ redirect: false })
                    }}
                    className="w-full text-left text-gray-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-gray-900"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block text-white hover:text-falco-accent transition-colors font-medium py-2.5 px-3 rounded-lg hover:bg-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block text-gray-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
