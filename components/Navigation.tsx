'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingBag, User, Search, ChevronDown, LogOut, Package, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useClientTranslation } from '../hooks/useClientTranslation'
import { useCart } from '../contexts/CartContext'
import LanguageSelector from './LanguageSelector'

export default function Navigation() {
  const { t } = useClientTranslation()
  const { data: session } = useSession()
  const { state, openCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
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

  // Nike-like primary categories
  const navItems = [
    { name: 'New', href: '/shop/new' },
    { name: 'Men', href: '/shop/men' },
    { name: 'Women', href: '/shop/women' },
    { name: 'Kids', href: '/shop/kids' },
    { name: 'Sport', href: '/shop/sport' },
    { name: 'Sportswear', href: '/shop/sportswear' },
  ]

  // Content for the "New" mega menu
  const newMenu = {
    New: [
      { label: 'Shop All New Arrivals', href: '/shop/new' },
      { label: 'Best Sellers', href: '/shop/new/best-sellers' },
      { label: 'SNKRS Launch Calendar', href: '/shop/new/launch-calendar' },
      { label: 'Best for Winter Wear', href: '/shop/new/winter' },
    ],
    Highlights: [
      { label: 'Jordan Remastered Icons', href: '/shop/new/jordan-remastered-icons' },
      { label: 'ACG Essentials', href: '/shop/new/acg-essentials' },
      { label: 'Shox: Style it Like Them', href: '/shop/new/shox-style' },
      { label: 'Nike Tech', href: '/shop/new/nike-tech' },
      { label: 'Max Voltage Pack: Football Picks', href: '/shop/new/max-voltage-pack' },
    ],
    Trending: [
      { label: 'Maximum Cushioning Running Shoes', href: '/shop/new/maximum-cushioning-running-shoes' },
      { label: 'Supportive Cushioning Running Shoes', href: '/shop/new/supportive-cushioning-running-shoes' },
      { label: 'Sportswear Clothing', href: '/shop/new/sportswear-clothing' },
      { label: 'Hybrid Training', href: '/shop/new/hybrid-training' },
      { label: 'Football Tracksuits', href: '/shop/new/football-tracksuits' },
    ],
  } as const

  // Content for the "Men" mega menu
  const menMenu = {
    Highlights: [
      { label: 'New in Men', href: '/shop/men/new' },
      { label: 'Best Sellers', href: '/shop/men/best-sellers' },
      { label: 'Look of Metcon', href: '/shop/men/look-of-metcon' },
      { label: 'Shox: Style it Like Them', href: '/shop/men/shox-style' },
      { label: 'Best for Winter Wear', href: '/shop/men/winter' },
    ],
    Shoes: [
      { label: 'All Shoes', href: '/shop/men/shoes' },
      { label: 'Lifestyle', href: '/shop/men/shoes/lifestyle' },
      { label: 'Jordan', href: '/shop/men/shoes/jordan' },
      { label: 'Running', href: '/shop/men/shoes/running' },
      { label: 'Football', href: '/shop/men/shoes/football' },
      { label: 'Basketball', href: '/shop/men/shoes/basketball' },
      { label: 'Training and Gym', href: '/shop/men/shoes/training-and-gym' },
      { label: 'Skateboarding', href: '/shop/men/shoes/skateboarding' },
      { label: 'Custom Shoes', href: '/shop/men/shoes/custom' },
    ],
    Clothing: [
      { label: 'All Clothing', href: '/shop/men/clothing' },
      { label: 'Hoodies and Sweatshirts', href: '/shop/men/clothing/hoodies-and-sweatshirts' },
      { label: 'Trousers and Tights', href: '/shop/men/clothing/trousers-and-tights' },
      { label: 'Tracksuits', href: '/shop/men/clothing/tracksuits' },
      { label: 'Jackets', href: '/shop/men/clothing/jackets' },
      { label: 'Tops and T-Shirts', href: '/shop/men/clothing/tops-and-t-shirts' },
      { label: 'Shorts', href: '/shop/men/clothing/shorts' },
      { label: 'Accessories', href: '/shop/men/clothing/accessories' },
    ],
    Sport: [
      { label: 'Running', href: '/shop/men/sport/running' },
      { label: 'Football', href: '/shop/men/sport/football' },
      { label: 'Basketball', href: '/shop/men/sport/basketball' },
      { label: 'Training and Gym', href: '/shop/men/sport/training-and-gym' },
      { label: 'Tennis', href: '/shop/men/sport/tennis' },
      { label: 'Golf', href: '/shop/men/sport/golf' },
    ],
  } as const

  // Content for the "Women" mega menu
  const womenMenu = {
    Highlights: [
      { label: 'New in Women', href: '/shop/women/new' },
      { label: 'Best Sellers', href: '/shop/women/best-sellers' },
      { label: 'New in: Air Max Muse and Air Superfly', href: '/shop/women/air-max-muse-and-air-superfly' },
      { label: 'Look of Metcon', href: '/shop/women/look-of-metcon' },
      { label: 'Shox: Style it Like Them', href: '/shop/women/shox-style' },
      { label: 'Best for Winter Wear', href: '/shop/women/winter' },
    ],
    Shoes: [
      { label: 'All Shoes', href: '/shop/women/shoes' },
      { label: 'Lifestyle', href: '/shop/women/shoes/lifestyle' },
      { label: 'Jordan', href: '/shop/women/shoes/jordan' },
      { label: 'Running', href: '/shop/women/shoes/running' },
      { label: 'Training and Gym', href: '/shop/women/shoes/training-and-gym' },
      { label: 'Football', href: '/shop/women/shoes/football' },
      { label: 'Custom Shoes', href: '/shop/women/shoes/custom' },
    ],
    Clothing: [
      { label: 'All Clothing', href: '/shop/women/clothing' },
      { label: 'Hoodies and Sweatshirts', href: '/shop/women/clothing/hoodies-and-sweatshirts' },
      { label: 'Trousers', href: '/shop/women/clothing/trousers' },
      { label: 'Leggings', href: '/shop/women/clothing/leggings' },
      { label: 'Matching Sets', href: '/shop/women/clothing/matching-sets' },
      { label: 'Jackets', href: '/shop/women/clothing/jackets' },
      { label: 'Tops and T-Shirts', href: '/shop/women/clothing/tops-and-t-shirts' },
      { label: 'Shorts', href: '/shop/women/clothing/shorts' },
      { label: 'Sports Bras', href: '/shop/women/clothing/sports-bras' },
      { label: 'Accessories', href: '/shop/women/clothing/accessories' },
    ],
    Sport: [
      { label: 'Training and Gym', href: '/shop/women/sport/training-and-gym' },
      { label: 'Running', href: '/shop/women/sport/running' },
      { label: 'Football', href: '/shop/women/sport/football' },
      { label: 'Basketball', href: '/shop/women/sport/basketball' },
      { label: 'Tennis', href: '/shop/women/sport/tennis' },
      { label: 'Yoga', href: '/shop/women/sport/yoga' },
      { label: 'Golf', href: '/shop/women/sport/golf' },
    ],
  } as const

  // Content for the "Kids" mega menu
  const kidsMenu = {
    Highlights: [
      { label: 'New in Kids', href: '/shop/kids/new' },
      { label: 'Best Sellers', href: '/shop/kids/best-sellers' },
      { label: 'Teen Destination', href: '/shop/kids/teen-destination' },
      { label: 'Nike x LEGO® Collection', href: '/shop/kids/nike-lego-collection' },
      { label: 'Shox: Style it Like Them', href: '/shop/kids/shox-style' },
      { label: 'Best for Winter Wear', href: '/shop/kids/winter' },
    ],
    Shoes: [
      { label: 'All Shoes', href: '/shop/kids/shoes' },
      { label: 'Lifestyle', href: '/shop/kids/shoes/lifestyle' },
      { label: 'Jordan', href: '/shop/kids/shoes/jordan' },
      { label: 'Football', href: '/shop/kids/shoes/football' },
      { label: 'Running', href: '/shop/kids/shoes/running' },
      { label: 'Basketball', href: '/shop/kids/shoes/basketball' },
      { label: 'Physical Education', href: '/shop/kids/shoes/physical-education' },
    ],
    Clothing: [
      { label: 'All Clothing', href: '/shop/kids/clothing' },
      { label: 'Hoodies and Sweatshirts', href: '/shop/kids/clothing/hoodies-and-sweatshirts' },
      { label: 'Trousers and Leggings', href: '/shop/kids/clothing/trousers-and-leggings' },
      { label: 'Jackets', href: '/shop/kids/clothing/jackets' },
      { label: 'Tracksuits', href: '/shop/kids/clothing/tracksuits' },
      { label: 'Tops and T-Shirts', href: '/shop/kids/clothing/tops-and-t-shirts' },
      { label: 'Shorts', href: '/shop/kids/clothing/shorts' },
      { label: 'Sports Bras', href: '/shop/kids/clothing/sports-bras' },
      { label: 'Accessories', href: '/shop/kids/clothing/accessories' },
    ],
    'Kids by age': [
      { label: 'Teens (13 - 17 years)', href: '/shop/kids/age/teens-13-17' },
      { label: 'Older Kids (7 - 12 years)', href: '/shop/kids/age/older-7-12' },
      { label: 'Younger Kids (3 - 7 years)', href: '/shop/kids/age/younger-3-7' },
      { label: 'Baby & Toddler (0 - 3 years)', href: '/shop/kids/age/baby-toddler-0-3' },
    ],
    Sport: [
      { label: 'Running', href: '/shop/kids/sport/running' },
      { label: 'Football', href: '/shop/kids/sport/football' },
      { label: 'Basketball', href: '/shop/kids/sport/basketball' },
      { label: 'Physical Education', href: '/shop/kids/sport/physical-education' },
    ],
  } as const

  // Content for the "Sport" mega menu
  const sportMenu = {
    Highlights: [
      { label: 'New In Sport', href: '/shop/sport/new' },
      { label: 'Best Sellers', href: '/shop/sport/best-sellers' },
      { label: 'Hybrid Training', href: '/shop/sport/hybrid-training' },
      { label: 'Jordan Sport', href: '/shop/sport/jordan' },
      { label: 'The Locker Room', href: '/shop/sport/locker-room' },
      { label: 'Nike Running Events', href: '/shop/sport/running-events' },
    ],
    Running: [
      { label: 'All Running', href: '/shop/sport/running' },
      { label: 'Shoes', href: '/shop/sport/running/shoes' },
      { label: 'Clothing', href: '/shop/sport/running/clothing' },
      { label: 'Accessories', href: '/shop/sport/running/accessories' },
    ],
    Football: [
      { label: 'All Football', href: '/shop/sport/football' },
      { label: 'Shoes', href: '/shop/sport/football/shoes' },
      { label: 'Clothing', href: '/shop/sport/football/clothing' },
      { label: 'Accessories', href: '/shop/sport/football/accessories' },
    ],
    'Training and Gym': [
      { label: 'All Training and Gym', href: '/shop/sport/training-and-gym' },
      { label: 'Shoes', href: '/shop/sport/training-and-gym/shoes' },
      { label: 'Clothing', href: '/shop/sport/training-and-gym/clothing' },
      { label: 'Accessories', href: '/shop/sport/training-and-gym/accessories' },
    ],
    'More Sports': [
      { label: 'All Sport', href: '/shop/sport/all' },
      { label: 'Basketball', href: '/shop/sport/basketball' },
      { label: 'Tennis', href: '/shop/sport/tennis' },
      { label: 'Yoga', href: '/shop/sport/yoga' },
      { label: 'Golf', href: '/shop/sport/golf' },
    ],
  } as const

  // Content for the "Sportswear" mega menu
  const sportswearMenu = {
    Highlights: [
      { label: 'New in Sportswear', href: '/shop/sportswear/new' },
      { label: 'Best Sellers', href: '/shop/sportswear/best-sellers' },
      { label: 'SNRKS Launch Calendar', href: '/shop/sportswear/launch-calendar' },
      { label: 'Home of Sportswear', href: '/shop/sportswear/home' },
      { label: 'Jordan Best Picks', href: '/shop/sportswear/jordan-best-picks' },
      { label: 'Nike Tech', href: '/shop/sportswear/nike-tech' },
    ],
    Shoes: [
      { label: 'All Shoes', href: '/shop/sportswear/shoes' },
      { label: 'Air Force 1', href: '/shop/sportswear/shoes/air-force-1' },
      { label: 'Air Jordan 1', href: '/shop/sportswear/shoes/air-jordan-1' },
      { label: 'Air Max', href: '/shop/sportswear/shoes/air-max' },
      { label: 'Dunk', href: '/shop/sportswear/shoes/dunk' },
      { label: 'Nike P-6000', href: '/shop/sportswear/shoes/p-6000' },
      { label: 'Nike Shox', href: '/shop/sportswear/shoes/shox' },
      { label: 'Custom Shoes', href: '/shop/sportswear/shoes/custom' },
    ],
    Clothing: [
      { label: 'All Clothing', href: '/shop/sportswear/clothing' },
      { label: 'Hoodies and Sweatshirts', href: '/shop/sportswear/clothing/hoodies-and-sweatshirts' },
      { label: 'Trousers and Leggings', href: '/shop/sportswear/clothing/trousers-and-leggings' },
      { label: 'Jackets', href: '/shop/sportswear/clothing/jackets' },
      { label: 'Tracksuits', href: '/shop/sportswear/clothing/tracksuits' },
      { label: 'Tops and T-Shirts', href: '/shop/sportswear/clothing/tops-and-t-shirts' },
      { label: 'Shorts', href: '/shop/sportswear/clothing/shorts' },
    ],
    Jordan: [
      { label: 'All Jordan', href: '/shop/sportswear/jordan' },
      { label: 'New in Jordan', href: '/shop/sportswear/jordan/new' },
      { label: 'Shoes', href: '/shop/sportswear/jordan/shoes' },
      { label: 'Clothing', href: '/shop/sportswear/jordan/clothing' },
      { label: 'Accessories & Equipment', href: '/shop/sportswear/jordan/accessories' },
    ],
  } as const

  const shopCategories = {
    'Men': {
      'Sportswear': ['T-Shirts', 'Hoodies', 'Shorts', 'Tracksuits', 'Jackets'],
      'Shoes': ['Running Shoes', 'Basketball', 'Training', 'Casual', 'Football Cleats']
    },
    'Women': {
      'Sportswear': ['Sports Bras', 'Leggings', 'Tank Tops', 'Hoodies', 'Jackets', 'Gym Lingerie'],
      'Shoes': ['Running Shoes', 'Training', 'Yoga', 'Casual', 'Cross Training']
    },
    'Kids': {
      'Sportswear': ['T-Shirts', 'Shorts', 'Hoodies', 'Tracksuits'],
      'Shoes': ['Running', 'Basketball', 'Casual', 'Football']
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800' 
        : 'bg-black/90 backdrop-blur-md'
    }`}>
      {/* Additional background layer to prevent text bleeding */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container-custom relative z-10">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-4 group relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <Image
                src="/images/falcop.jpg"
                alt="Falco P Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col bg-black/50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg backdrop-blur-sm">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-none relative z-10">
                FALCO P
              </span>
              <span className="text-xs text-gray-400 font-medium tracking-wider relative z-10 hidden sm:block">
                PREMIUM SPORTSWEAR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
            {navItems.map((item) => (
              item.name === 'New' ? (
                // New with Mega Menu
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => openDropdown('new')}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1 flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'new' ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {activeDropdown === 'new' && (
                    <div onMouseEnter={() => openDropdown('new')} onMouseLeave={closeDropdownWithDelay} className="fixed left-1/2 -translate-x-1/2 top-16 md:top-20 w-[90vw] max-w-[900px] bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl max-h-[70vh] overflow-y-auto z-[60]">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        {Object.entries(newMenu).map(([section, links]) => (
                          <div key={section} className="space-y-4">
                            <h3 className="text-falco-accent font-bold text-lg mb-2 border-b border-gray-800 pb-2">{section}</h3>
                            <ul className="space-y-1">
                              {links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} className="text-gray-400 hover:text-falco-accent transition-colors duration-300 text-sm block py-1">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.name === 'Men' ? (
                // Men with Mega Menu
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => openDropdown('men')}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1 flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'men' ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {activeDropdown === 'men' && (
                    <div onMouseEnter={() => openDropdown('men')} onMouseLeave={closeDropdownWithDelay} className="fixed left-1/2 -translate-x-1/2 top-16 md:top-20 w-[90vw] max-w-[1000px] bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl max-h-[70vh] overflow-y-auto z-[60]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {Object.entries(menMenu).map(([section, links]) => (
                          <div key={section} className="space-y-4">
                            <h3 className="text-falco-accent font-bold text-lg mb-2 border-b border-gray-800 pb-2">{section}</h3>
                            <ul className="space-y-1">
                              {links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} className="text-gray-400 hover:text-falco-accent transition-colors duration-300 text-sm block py-1">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.name === 'Women' ? (
                // Women with Mega Menu
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => openDropdown('women')}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1 flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'women' ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {activeDropdown === 'women' && (
                    <div onMouseEnter={() => openDropdown('women')} onMouseLeave={closeDropdownWithDelay} className="fixed left-1/2 -translate-x-1/2 top-16 md:top-20 w-[90vw] max-w-[1000px] bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl max-h-[70vh] overflow-y-auto z-[60]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {Object.entries(womenMenu).map(([section, links]) => (
                          <div key={section} className="space-y-4">
                            <h3 className="text-falco-accent font-bold text-lg mb-2 border-b border-gray-800 pb-2">{section}</h3>
                            <ul className="space-y-1">
                              {links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} className="text-gray-400 hover:text-falco-accent transition-colors duration-300 text-sm block py-1">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.name === 'Kids' ? (
                // Kids with Mega Menu
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => openDropdown('kids')}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1 flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'kids' ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {activeDropdown === 'kids' && (
                    <div onMouseEnter={() => openDropdown('kids')} onMouseLeave={closeDropdownWithDelay} className="fixed left-1/2 -translate-x-1/2 top-16 md:top-20 w-[90vw] max-w-[1100px] bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl max-h-[70vh] overflow-y-auto z-[60]">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                        {Object.entries(kidsMenu).map(([section, links]) => (
                          <div key={section} className="space-y-4">
                            <h3 className="text-falco-accent font-bold text-lg mb-2 border-b border-gray-800 pb-2">{section}</h3>
                            <ul className="space-y-1">
                              {links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} className="text-gray-400 hover:text-falco-accent transition-colors duration-300 text-sm block py-1">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.name === 'Sport' ? (
                // Sport with Mega Menu
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => openDropdown('sport')}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1 flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'sport' ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {activeDropdown === 'sport' && (
                    <div onMouseEnter={() => openDropdown('sport')} onMouseLeave={closeDropdownWithDelay} className="fixed left-1/2 -translate-x-1/2 top-16 md:top-20 w-[90vw] max-w-[1100px] bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl max-h-[70vh] overflow-y-auto z-[60]">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                        {Object.entries(sportMenu).map(([section, links]) => (
                          <div key={section} className="space-y-4">
                            <h3 className="text-falco-accent font-bold text-lg mb-2 border-b border-gray-800 pb-2">{section}</h3>
                            <ul className="space-y-1">
                              {links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} className="text-gray-400 hover:text-falco-accent transition-colors duration-300 text-sm block py-1">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.name === 'Sportswear' ? (
                // Sportswear with Mega Menu
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => openDropdown('sportswear')}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <Link
                    href={item.href}
                    className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1 flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'sportswear' ? 'rotate-180' : ''}`} />
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </Link>

                  {activeDropdown === 'sportswear' && (
                    <div onMouseEnter={() => openDropdown('sportswear')} onMouseLeave={closeDropdownWithDelay} className="fixed left-1/2 -translate-x-1/2 top-16 md:top-20 w-[90vw] max-w-[1100px] bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl max-h-[70vh] overflow-y-auto z-[60]">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {Object.entries(sportswearMenu).map(([section, links]) => (
                          <div key={section} className="space-y-4">
                            <h3 className="text-falco-accent font-bold text-lg mb-2 border-b border-gray-800 pb-2">{section}</h3>
                            <ul className="space-y-1">
                              {links.map((link) => (
                                <li key={link.label}>
                                  <Link href={link.href} className="text-gray-400 hover:text-falco-accent transition-colors duration-300 text-sm block py-1">
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1"
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              )
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6">
            <LanguageSelector />
            <button className="p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full">
              <Search className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
            </button>

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

            <button
              onClick={openCart}
              className="p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full relative"
            >
              <ShoppingBag className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
                  {state.totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:text-falco-accent transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-falco-primary/95 backdrop-blur-md border-t border-white/10 mobile-padding max-h-[80vh] overflow-y-auto">
            <div className="py-6 space-y-4">
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="block text-white/80 hover:text-falco-accent transition-colors duration-300 font-medium py-3 px-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.name === 'New' && (
                    <div className="pl-4 pb-2">
                      {Object.entries(newMenu).map(([section, links]) => (
                        <div key={section} className="mb-3">
                          <h4 className="text-gray-300 text-sm font-semibold mb-1">{section}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {links.map((link) => (
                              <Link key={link.label} href={link.href} className="text-gray-400 hover:text-falco-accent text-xs"
                                onClick={() => setIsOpen(false)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.name === 'Men' && (
                    <div className="pl-4 pb-2">
                      {Object.entries(menMenu).map(([section, links]) => (
                        <div key={section} className="mb-3">
                          <h4 className="text-gray-300 text-sm font-semibold mb-1">{section}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {links.map((link) => (
                              <Link key={link.label} href={link.href} className="text-gray-400 hover:text-falco-accent text-xs"
                                onClick={() => setIsOpen(false)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.name === 'Women' && (
                    <div className="pl-4 pb-2">
                      {Object.entries(womenMenu).map(([section, links]) => (
                        <div key={section} className="mb-3">
                          <h4 className="text-gray-300 text-sm font-semibold mb-1">{section}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {links.map((link) => (
                              <Link key={link.label} href={link.href} className="text-gray-400 hover:text-falco-accent text-xs"
                                onClick={() => setIsOpen(false)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.name === 'Kids' && (
                    <div className="pl-4 pb-2">
                      {Object.entries(kidsMenu).map(([section, links]) => (
                        <div key={section} className="mb-3">
                          <h4 className="text-gray-300 text-sm font-semibold mb-1">{section}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {links.map((link) => (
                              <Link key={link.label} href={link.href} className="text-gray-400 hover:text-falco-accent text-xs"
                                onClick={() => setIsOpen(false)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.name === 'Sport' && (
                    <div className="pl-4 pb-2">
                      {Object.entries(sportMenu).map(([section, links]) => (
                        <div key={section} className="mb-3">
                          <h4 className="text-gray-300 text-sm font-semibold mb-1">{section}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {links.map((link) => (
                              <Link key={link.label} href={link.href} className="text-gray-400 hover:text-falco-accent text-xs"
                                onClick={() => setIsOpen(false)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.name === 'Sportswear' && (
                    <div className="pl-4 pb-2">
                      {Object.entries(sportswearMenu).map(([section, links]) => (
                        <div key={section} className="mb-3">
                          <h4 className="text-gray-300 text-sm font-semibold mb-1">{section}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {links.map((link) => (
                              <Link key={link.label} href={link.href} className="text-gray-400 hover:text-falco-accent text-xs"
                                onClick={() => setIsOpen(false)}>
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile Shop Section */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-falco-accent font-bold text-lg">Shop</h3>
                  <Link 
                    href="/shop"
                    className="bg-falco-accent text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-falco-gold transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Browse All
                  </Link>
                </div>
                {Object.entries(shopCategories).map(([category, subcategories]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-white font-semibold text-base mb-3 px-2 border-l-2 border-falco-accent pl-3">
                      {category}
                    </h4>
                    {Object.entries(subcategories).map(([subcat, items]) => (
                      <div key={subcat} className="mb-4 px-4">
                        <h5 className="text-gray-300 font-medium text-sm mb-2">
                          {subcat}
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {items.map((item) => (
                            <Link
                              key={item}
                              href={`/shop/${category.toLowerCase()}/${subcat.toLowerCase()}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-gray-400 hover:text-falco-accent transition-colors duration-300 text-xs py-1"
                              onClick={() => setIsOpen(false)}
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              {/* Mobile Language Selector */}
              <LanguageSelector mobile className="mt-6" />
              
              {/* Mobile User Section */}
              <div className="border-t border-white/10 pt-4">
                {session ? (
                  <div className="space-y-2">
                    <div className="px-2 py-2">
                      <p className="text-sm font-medium text-white">{session.user?.name}</p>
                      <p className="text-xs text-gray-400">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center px-2 py-2 text-white/80 hover:text-falco-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      className="flex items-center px-2 py-2 text-white/80 hover:text-falco-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="w-5 h-5 mr-3" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        signOut({ redirect: false })
                      }}
                      className="flex items-center w-full px-2 py-2 text-white/80 hover:text-falco-accent"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="block px-2 py-3 text-white font-medium hover:text-falco-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-2 py-3 text-gray-400 hover:text-falco-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center space-x-6 pt-6 border-t border-white/10">
                <button className="p-3 text-white/80 hover:text-falco-accent transition-colors duration-300">
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={openCart}
                  className="p-3 text-white/80 hover:text-falco-accent transition-colors duration-300 relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {state.totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-falco-accent text-falco-primary text-xs rounded-full flex items-center justify-center font-bold">
                      {state.totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
