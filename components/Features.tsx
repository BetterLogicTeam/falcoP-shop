'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Zap, 
  Shield, 
  Truck, 
  Headphones, 
  Award, 
  Leaf,
  Smartphone,
  Globe,
  Heart
} from 'lucide-react'
import Image from 'next/image'
import { useClientTranslation } from '../hooks/useClientTranslation'

export default function Features() {
  const { t } = useClientTranslation()
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const featuresRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Video array - single video
  const videos = [
    '/videos/4.mp4'
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight && rect.bottom > 0
        setIsVisible(isInView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Video cycling effect
  useEffect(() => {
    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('ended', handleVideoEnd)
      return () => video.removeEventListener('ended', handleVideoEnd)
    }
  }, [currentVideoIndex, videos.length])

  const features = [
    {
      icon: Zap,
      title: t('features.lightning_performance', 'Lightning Performance'),
      description: t('features.lightning_desc', 'Engineered with cutting-edge technology for maximum speed and agility, just like the falcon.'),
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: t('features.durability', 'Durability Guaranteed'),
      description: t('features.durability_desc', 'Built to withstand the toughest conditions with premium materials and construction.'),
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Leaf,
      title: t('features.eco_friendly', 'Eco-Friendly'),
      description: t('features.eco_desc', 'Committed to sustainability with recycled materials and environmentally conscious production.'),
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Award,
      title: t('features.premium_quality', 'Premium Quality'),
      description: t('features.quality_desc', 'Every product meets the highest standards of craftsmanship and attention to detail.'),
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Smartphone,
      title: t('features.smart_integration', 'Smart Integration'),
      description: t('features.smart_desc', 'Connect with our app for personalized training insights and performance tracking.'),
      color: 'from-indigo-400 to-blue-500'
    },
    {
      icon: Globe,
      title: t('features.global_reach', 'Global Reach'),
      description: t('features.global_desc', 'Available worldwide with fast shipping and local customer support in 50+ countries.'),
      color: 'from-teal-400 to-cyan-500'
    }
  ]

  const stats = [
    { icon: Heart, value: '10K+', label: 'Happy Customers' },
    { icon: Award, value: '50+', label: 'Awards Won' },
    { icon: Globe, value: '50+', label: 'Countries' },
    { icon: Zap, value: 'Mon-Fri', label: 'Support' },
  ]

  return (
    <section id="features" className="section-padding bg-gradient-to-br from-falco-secondary to-falco-primary">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6">
            {t('features.title', 'WHY CHOOSE')} <span className="gradient-text">FALCO PEAK</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            {t('features.subtitle', 'We combine aerodynamic design, innovative mechanisms, and premium quality to create sportswear that doesn\'t just meet expectations—it exceeds them.')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-0">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`group relative p-4 sm:p-6 lg:p-8 rounded-2xl bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                  activeFeature === index ? 'ring-2 ring-falco-accent bg-white/10' : ''
                }`}
                onClick={() => setActiveFeature(index)}
              >
                {/* 3D Border Effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Top and Left Border (Light) */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                
                {/* Bottom and Right Border (Dark) */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
                <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/40 to-transparent"></div>
                
                {/* Inner 3D Shadow */}
                <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Outer Glow Effect */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-falco-accent/20 to-falco-gold/20 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white drop-shadow-md" />
                </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3 lg:mb-4 group-hover:text-falco-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                  {feature.description}
                </p>
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

        {/* Active Feature Details */}
        <div ref={featuresRef} className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 mb-8 sm:mb-12 lg:mb-16 overflow-hidden mx-4 sm:mx-6 lg:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${features[activeFeature].color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                {(() => {
                  const Icon = features[activeFeature].icon
                  return <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                })()}
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white mb-4 sm:mb-6">
                {features[activeFeature].title}
              </h3>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6 sm:mb-8">
                {features[activeFeature].description}
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-falco-accent rounded-full"></div>
                  <span className="text-white/80">Premium materials and construction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-falco-accent rounded-full"></div>
                  <span className="text-white/80">Rigorous quality testing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-falco-accent rounded-full"></div>
                  <span className="text-white/80">Customer satisfaction guarantee</span>
                </div>
              </div>
            </div>
            
            {/* 3D Video Showcase */}
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center">
              <div className="relative">
                {/* 3D Video Container */}
                <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  {/* 3D Border Effects */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                  
                  {/* Top and Left Border (Light) */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                  <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/60 to-transparent"></div>
                  
                  {/* Bottom and Right Border (Dark) */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/60 to-transparent"></div>
                  <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/60 to-transparent"></div>
                  
                  {/* Inner 3D Shadow */}
                  <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-black/30 to-transparent"></div>
                  
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    key={currentVideoIndex}
                    src={videos[currentVideoIndex]}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  
                  {/* Video Info Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                    <span className="text-white text-sm font-medium">WING P</span>
                  </div>
                  
                  {/* Video Counter */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                    <span className="text-white text-sm font-medium">
                      {currentVideoIndex + 1} / {videos.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 lg:px-0">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-falco-accent to-falco-gold rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-falco-primary" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-white/60 text-xs sm:text-sm">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
