'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Play, Star, Zap, BookOpen, Feather } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useClientTranslation } from '../../hooks/useClientTranslation'

export default function StoriesIndex() {
  const { t } = useClientTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stories = [
    {
      id: 'wing-p',
      title: 'WING P STORY',
      subtitle: 'The Original Dream',
      description: 'Discover the visionary journey of Abdusebur and the birth of Wing Power - where performance meets perfection.',
      href: '/story/wing-p',
      icon: Zap,
      gradient: 'from-falco-accent to-falco-gold',
      bgGradient: 'from-falco-accent/20 to-falco-gold/20'
    },
    {
      id: 'falco-p',
      title: 'FALCO PEAK STORY',
      subtitle: 'The Evolution',
      description: 'Experience the story of the peregrine falcon\'s grace captured in every step - engineered for athletes who understand flight.',
      href: '/story/falco-p',
      icon: Feather,
      gradient: 'from-falco-gold to-falco-accent',
      bgGradient: 'from-falco-gold/20 to-falco-accent/20'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-white hover:text-falco-accent transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('common.back_to_home', 'Back to Home')}</span>
            </Link>
            <div className="text-falco-accent font-bold text-xl">FALCO PEAK</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-gold via-falco-accent to-falco-gold mb-4">
              {t('stories.title', 'OUR STORIES')}
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              {t('stories.subtitle', 'Discover the inspiration, vision, and craftsmanship behind every Falco Peak creation')}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-falco-accent to-falco-gold mx-auto rounded-full"></div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stories.map((story, index) => {
              const Icon = story.icon
              return (
                <div
                  key={story.id}
                  className={`group relative bg-black/40 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:-translate-y-2 hover:scale-105 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    transitionDelay: `${index * 200}ms`
                  }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${story.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                  
                  {/* Border Effects */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
                  <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/40 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${story.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      <Icon className="w-8 h-8 text-white drop-shadow-md" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-falco-accent to-falco-gold mb-2 group-hover:scale-105 transition-transform duration-300">
                      {story.title}
                    </h2>

                    {/* Subtitle */}
                    <p className="text-falco-gold font-semibold mb-4 text-lg">
                      {story.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-white/70 leading-relaxed mb-8 group-hover:text-white/90 transition-colors duration-300">
                      {story.description}
                    </p>

                    {/* CTA Button */}
                    <Link 
                      href={story.href}
                      className={`inline-flex items-center space-x-2 bg-gradient-to-r ${story.gradient} text-falco-primary px-6 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-falco-accent/25 hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-white/20`}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>{t('stories.read_story', 'Read Story')}</span>
                    </Link>
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-falco-accent/60 rounded-full animate-ping opacity-0 group-hover:opacity-100"
                        style={{
                          left: `${20 + (i * 30)}%`,
                          top: `${25 + (i * 15)}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: '2s'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-falco-accent to-falco-gold rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-black text-falco-primary mb-4">
                {t('stories.explore_collection', 'Ready to Experience the Stories?')}
              </h3>
              <p className="text-falco-primary/80 mb-6">
                {t('stories.explore_desc', 'Explore our complete collection and find your perfect pair')}
              </p>
              <Link 
                href="/shop" 
                className="inline-flex items-center space-x-2 bg-falco-primary text-falco-accent px-8 py-4 rounded-full font-bold text-lg hover:bg-falco-primary hover:text-falco-accent hover:shadow-lg hover:shadow-falco-accent/25 hover:scale-105 transition-all duration-300 border-2 border-falco-accent"
              >
                <span>{t('stories.shop_now', 'Shop Now')}</span>
                <Zap className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
