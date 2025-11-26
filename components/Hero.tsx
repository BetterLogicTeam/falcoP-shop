'use client'

import { useState, useEffect } from 'react'
import { Play, ArrowRight, Star, Zap, Sparkles, Target, Award } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useClientTranslation } from '../hooks/useClientTranslation'

export default function Hero() {
  const { t } = useClientTranslation()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20 sm:pt-24 lg:pt-28">
      {/* Clean Background */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mt-8 sm:mt-12 lg:mt-16">
            {/* Left Content */}
            <div className="text-left px-4 sm:px-6 lg:px-0">
              {/* Premium Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-white tracking-wider">{t('hero.badge', 'PREMIUM SPORTSWEAR')}</span>
              </div>

              {/* Main Heading - Nike Style */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-none tracking-tight">
                <span className="block">{t('hero.title_1', 'UNLEASH')}</span>
                <span className="block">{t('hero.title_2', 'YOUR')}</span>
                <span className="block">{t('hero.title_3', 'INNER')}</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">{t('hero.title_4', 'MAVERICK')}</span>
              </h1>

              {/* Professional Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed font-light">
                Inspired by the majestic falcon, we craft premium sportswear that empowers athletes to soar beyond limits with aerodynamic precision and unmatched style.
              </p>

              {/* Professional CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                <Link href="/shop" className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/story" className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-white hover:text-black transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center">
                  <Play className="w-4 h-4" />
                  <span>Watch Story</span>
                </Link>
              </div>
            </div>

            {/* Right Content - Clean Video Background */}
            <div className="relative mt-8 lg:mt-0 px-6 sm:px-8 lg:px-4">
              {/* Just the video background, no overlay images */}
              <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-2xl overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/4.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group cursor-pointer hover:border-white transition-colors duration-300">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}
