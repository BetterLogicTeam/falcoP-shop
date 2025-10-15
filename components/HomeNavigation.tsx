'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, User, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useClientTranslation } from '../hooks/useClientTranslation'
import { useCart } from '../contexts/CartContext'
import LanguageSelector from './LanguageSelector'

export default function HomeNavigation() {
  const { t } = useClientTranslation()
  const { state, openCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: t('nav.home', 'Home'), href: '#home' },
    { name: t('nav.shop', 'Shop'), href: '/shop' },
    { name: t('nav.features', 'Features'), href: '#features' },
    { name: t('nav.nft_collection', 'NFT Collection'), href: 'https://nft.falcop.com/', external: true },
    { name: t('nav.about', 'About'), href: '#about' },
    { name: t('nav.contact', 'Contact'), href: '#contact' },
  ]

  // Removed shop categories dropdown for a simple Shop link

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800' 
        : 'bg-black/90 backdrop-blur-md'
    }`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container-custom relative z-10">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
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

          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-300 font-semibold text-sm xl:text-base 2xl:text-lg relative group px-2 py-1"
                >
                  {item.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </a>
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

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 2xl:space-x-6">
            <LanguageSelector />
            <button className="p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full">
              <Search className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
            </button>
            <button className="p-2 xl:p-3 text-white hover:text-gray-300 transition-colors duration-300 hover:bg-white/10 rounded-full">
              <User className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
            </button>
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

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:text-falco-accent transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-falco-primary/95 backdrop-blur-md border-t border-white/10 mobile-padding max-h-[80vh] overflow-y-auto">
            <div className="py-6 space-y-4">
              {navItems.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-white/80 hover:text-falco-accent transition-colors duration-300 font-medium py-3 px-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-white/80 hover:text-falco-accent transition-colors duration-300 font-medium py-3 px-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}

              {/* Removed mobile Shop categories; keep simple link above */}

              <LanguageSelector mobile className="mt-6" />

              <div className="flex items-center justify-center space-x-6 pt-6 border-t border-white/10">
                <button className="p-3 text-white/80 hover:text-falco-accent transition-colors duration-300">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-3 text-white/80 hover:text-falco-accent transition-colors duration-300">
                  <User className="w-5 h-5" />
                </button>
                <button className="p-3 text-white/80 hover:text-falco-accent transition-colors duration-300 relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-falco-accent text-falco-primary text-xs rounded-full flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


